import type { Env } from "../index";
import { json } from "../utils/response";
import { resolveUser } from "../middleware/auth.middleware";
import { newId } from "../auth/tokens";

// Every /api/admin/* route requires role === 'ADMIN', checked server-side.
// This is intentionally a compact set covering the entities the brief lists —
// deep admin UI/UX (bulk actions, pagination, etc.) can grow from here later.

async function requireAdminOr401(request: Request, env: Env) {
  const user = await resolveUser(request, env);
  if (!user || user.role !== "ADMIN") return null;
  return user;
}

export async function handleAdminRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  if (!path.startsWith("/api/admin/")) return null;

  const admin = await requireAdminOr401(request, env);
  if (!admin) return json({ message: "Forbidden" }, 403);

  // Users
  if (path === "/api/admin/users" && request.method === "GET") {
    const res = await env.DB.prepare(`SELECT id, name, username, email, role, xp, level FROM users`).all();
    return json(res.results);
  }

  // Schedule (weekly learning schedule — admin can change without touching source code)
  if (path === "/api/admin/schedule" && request.method === "GET") {
    const res = await env.DB.prepare(`SELECT * FROM schedule ORDER BY day_of_week`).all();
    return json(res.results);
  }
  if (path === "/api/admin/schedule" && request.method === "PUT") {
    const body = await request.json<{ day_of_week: number; subject: string; description?: string }>().catch(
      () => null
    );
    if (!body) return json({ message: "Invalid body" }, 422);
    const existing = await env.DB.prepare(`SELECT id FROM schedule WHERE day_of_week = ?`)
      .bind(body.day_of_week)
      .first<{ id: string }>();
    if (existing) {
      await env.DB.prepare(`UPDATE schedule SET subject = ?, description = ?, updated_at = datetime('now') WHERE id = ?`)
        .bind(body.subject, body.description ?? "", existing.id)
        .run();
    } else {
      await env.DB.prepare(`INSERT INTO schedule (id, day_of_week, subject, description) VALUES (?, ?, ?, ?)`)
        .bind(newId(), body.day_of_week, body.subject, body.description ?? "")
        .run();
    }
    return json({ ok: true });
  }

  // Courses (basic create/list — full CRUD editor UI is a later iteration)
  if (path === "/api/admin/courses" && request.method === "GET") {
    const res = await env.DB.prepare(`SELECT * FROM courses ORDER BY order_index`).all();
    return json(res.results);
  }
  if (path === "/api/admin/courses" && request.method === "POST") {
    const body = await request.json<any>().catch(() => ({}));
    if (!body.title || !body.slug) return json({ message: "title dan slug wajib diisi" }, 422);
    const id = newId();
    await env.DB.prepare(
      `INSERT INTO courses (id, title, slug, description, difficulty, category, estimated_duration, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, body.title, body.slug, body.description ?? "", body.difficulty ?? "Easy", body.category ?? "", body.estimated_duration ?? "", body.published ? 1 : 0)
      .run();
    return json({ id }, 201);
  }

  // Articles
  if (path === "/api/admin/articles" && request.method === "GET") {
    const res = await env.DB.prepare(`SELECT * FROM articles ORDER BY created_at DESC`).all();
    return json(res.results);
  }
  if (path === "/api/admin/articles" && request.method === "POST") {
    const body = await request.json<any>().catch(() => ({}));
    if (!body.title || !body.slug) return json({ message: "title dan slug wajib diisi" }, 422);
    const id = newId();
    await env.DB.prepare(`INSERT INTO articles (id, title, slug, summary, content, published) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(id, body.title, body.slug, body.summary ?? "", body.content ?? "", body.published ? 1 : 0)
      .run();
    return json({ id }, 201);
  }

  return json({ message: "Admin route not found" }, 404);
}
