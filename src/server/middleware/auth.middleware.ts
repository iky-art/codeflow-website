import type { Env } from "../index";
import { getUserFromSessionToken, parseCookie, SESSION_COOKIE_NAME, type SessionUser } from "../auth/session";

// Resolves the current user (if any) from the session cookie.
// Does NOT reject the request — route handlers decide whether auth is required.
export async function resolveUser(request: Request, env: Env): Promise<SessionUser | null> {
  const token = parseCookie(request, SESSION_COOKIE_NAME);
  return getUserFromSessionToken(env, token);
}

export function requireAuth(user: SessionUser | null): user is SessionUser {
  return user !== null;
}

export function requireAdmin(user: SessionUser | null): user is SessionUser {
  return user !== null && user.role === "ADMIN";
}
