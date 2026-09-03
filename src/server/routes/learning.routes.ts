import type { Env } from "../index";
import { json } from "../utils/response";
import { resolveUser } from "../middleware/auth.middleware";
import { progressRepository } from "../repositories/progress.repository";

// Same ownership pattern as chat: UUID + authenticated + owner check.
export async function handleLearningRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  if (path === "/api/learning" && request.method === "POST") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);
    const body = await request.json<any>().catch(() => ({}));
    if (!body.courseId) return json({ message: "courseId wajib diisi" }, 422);
    const id = await progressRepository.createLearningSession(env, user.id, body.courseId, body.lessonId ?? null);
    return json({ id }, 201);
  }

  const match = path.match(/^\/api\/learning\/([^/]+)$/);
  if (match) {
    const sessionId = match[1];
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);

    const session = await progressRepository.getLearningSession(env, sessionId);
    if (!session || session.user_id !== user.id) return json({ message: "Not found" }, 404);

    if (request.method === "GET") return json(session);

    if (request.method === "PATCH") {
      const body = await request.json<any>().catch(() => ({}));
      await progressRepository.updateLearningSessionProgress(
        env,
        sessionId,
        body.progress ?? session.progress,
        body.lessonId ?? session.lesson_id
      );
      return json({ ok: true });
    }
  }

  return null;
}
