import type { Env } from "../index";
import { json } from "../utils/response";
import { userRepository } from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../auth/password";
import { createSession, destroySession, sessionCookieHeader, clearSessionCookieHeader, parseCookie, SESSION_COOKIE_NAME } from "../auth/session";
import { validateRegisterInput, isValidEmail } from "../../shared/validators";
import { resolveUser } from "../middleware/auth.middleware";
import { generateRawToken, hashToken, newId } from "../auth/tokens";

export async function handleAuthRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  if (path === "/api/auth/register" && request.method === "POST") {
    const body = await request.json<any>().catch(() => ({}));
    const errors = validateRegisterInput(body);
    if (errors.length > 0) return json({ message: "Validation failed", errors }, 422);

    const existing = await userRepository.findByEmailOrUsername(env, body.email);
    const existingUsername = await userRepository.findByEmailOrUsername(env, body.username);
    if (existing || existingUsername) return json({ message: "Email atau username sudah dipakai" }, 409);

    const passwordHash = await hashPassword(body.password);
    const user = await userRepository.create(env, {
      name: body.name,
      username: body.username,
      email: body.email,
      passwordHash,
    });
    if (!user) return json({ message: "Gagal membuat user" }, 500);

    const token = await createSession(env, user.id);
    return json(
      { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
      201,
      { "Set-Cookie": sessionCookieHeader(token, env) }
    );
  }

  if (path === "/api/auth/login" && request.method === "POST") {
    const body = await request.json<any>().catch(() => ({}));
    if (!body.identifier || !body.password) return json({ message: "Email/username dan password wajib diisi" }, 422);

    const user = await userRepository.findByEmailOrUsername(env, body.identifier);
    if (!user) return json({ message: "Kredensial salah" }, 401);

    const valid = await verifyPassword(body.password, user.password_hash);
    if (!valid) return json({ message: "Kredensial salah" }, 401);

    const token = await createSession(env, user.id);
    return json(
      { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
      200,
      { "Set-Cookie": sessionCookieHeader(token, env) }
    );
  }

  if (path === "/api/auth/logout" && request.method === "POST") {
    const token = parseCookie(request, SESSION_COOKIE_NAME);
    if (token) await destroySession(env, token);
    return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookieHeader(env) });
  }

  if (path === "/api/auth/me" && request.method === "GET") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);
    return json(user);
  }

  if (path === "/api/auth/forgot-password" && request.method === "POST") {
    const body = await request.json<any>().catch(() => ({}));
    if (!body.email || !isValidEmail(body.email)) return json({ message: "Email tidak valid" }, 422);

    const user = await userRepository.findByEmailOrUsername(env, body.email);
    // Always return success even if user not found — don't leak account existence.
    if (user) {
      const rawToken = generateRawToken();
      const tokenHash = await hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
      await env.DB.prepare(
        `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)`
      )
        .bind(newId(), user.id, tokenHash, expiresAt)
        .run();
      // NOTE: no email provider configured yet — the reset link would normally
      // be emailed here. For now this is a stub; wire up a real provider
      // (Resend/Mailgun/etc.) when you're ready, then send `rawToken` via email.
      console.log(`[stub] Password reset token generated for ${user.email} (not emailed — no provider configured)`);
    }
    return json({ ok: true, message: "Kalau email terdaftar, instruksi reset akan dikirim." });
  }

  if (path === "/api/auth/reset-password" && request.method === "POST") {
    const body = await request.json<any>().catch(() => ({}));
    if (!body.token || !body.password) return json({ message: "Token dan password baru wajib diisi" }, 422);
    if (body.password.length < 8) return json({ message: "Password minimal 8 karakter" }, 422);

    const tokenHash = await hashToken(body.token);
    const row = await env.DB.prepare(
      `SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL`
    )
      .bind(tokenHash)
      .first<{ id: string; user_id: string; expires_at: string }>();

    if (!row || new Date(row.expires_at).getTime() < Date.now()) {
      return json({ message: "Token tidak valid atau kedaluwarsa" }, 400);
    }

    const passwordHash = await hashPassword(body.password);
    await userRepository.updatePasswordHash(env, row.user_id, passwordHash);
    await env.DB.prepare(`UPDATE password_reset_tokens SET used_at = datetime('now') WHERE id = ?`).bind(row.id).run();
    // Invalidate all existing sessions for this user after password reset.
    await env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(row.user_id).run();

    return json({ ok: true });
  }

  return null; // not an auth route
}
