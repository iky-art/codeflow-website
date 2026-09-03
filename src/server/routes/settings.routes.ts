import type { Env } from "../index";
import { json } from "../utils/response";
import { resolveUser } from "../middleware/auth.middleware";

export async function handleSettingsRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  if (path !== "/api/settings") return null;

  const user = await resolveUser(request, env);
  if (!user) return json({ message: "Unauthorized" }, 401);

  if (request.method === "GET") {
    const settings = await env.DB.prepare(`SELECT * FROM user_settings WHERE user_id = ?`).bind(user.id).first();
    return json(settings);
  }

  if (request.method === "PATCH") {
    const body = await request.json<any>().catch(() => ({}));
    await env.DB.prepare(
      `UPDATE user_settings SET language = COALESCE(?, language),
       notifications_enabled = COALESCE(?, notifications_enabled),
       privacy_public_profile = COALESCE(?, privacy_public_profile) WHERE user_id = ?`
    )
      .bind(body.language ?? null, body.notifications_enabled ?? null, body.privacy_public_profile ?? null, user.id)
      .run();
    return json({ ok: true });
  }

  return null;
}
