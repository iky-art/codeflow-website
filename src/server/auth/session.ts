import type { Env } from "../index";
import { generateRawToken, hashToken, newId } from "./tokens";

const SESSION_DAYS = 30;
export const SESSION_COOKIE_NAME = "codeflow_session";

export async function createSession(env: Env, userId: string): Promise<string> {
  const rawToken = generateRawToken();
  const tokenHash = await hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(`INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)`)
    .bind(newId(), userId, tokenHash, expiresAt)
    .run();

  return rawToken;
}

export async function destroySession(env: Env, rawToken: string): Promise<void> {
  const tokenHash = await hashToken(rawToken);
  await env.DB.prepare(`DELETE FROM sessions WHERE token_hash = ?`).bind(tokenHash).run();
}

export interface SessionUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
}

export async function getUserFromSessionToken(env: Env, rawToken: string | null): Promise<SessionUser | null> {
  if (!rawToken) return null;
  const tokenHash = await hashToken(rawToken);

  const row = await env.DB.prepare(
    `SELECT u.id, u.name, u.username, u.email, u.role, s.expires_at
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?`
  )
    .bind(tokenHash)
    .first<{ id: string; name: string; username: string; email: string; role: "USER" | "ADMIN"; expires_at: string }>();

  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;

  return { id: row.id, name: row.name, username: row.username, email: row.email, role: row.role };
}

export function parseCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function sessionCookieHeader(token: string, env: Env, maxAgeSeconds = SESSION_DAYS * 24 * 60 * 60): string {
  const isProd = env.PUBLIC_APP_URL.startsWith("https://");
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookieHeader(env: Env): string {
  return sessionCookieHeader("", env, 0);
}
