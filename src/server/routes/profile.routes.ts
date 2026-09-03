import type { Env } from "../index";
import { json } from "../utils/response";
import { resolveUser } from "../middleware/auth.middleware";
import { userRepository } from "../repositories/user.repository";
import { gamificationRepository } from "../repositories/gamification.repository";
import { progressRepository } from "../repositories/progress.repository";

export async function handleProfileRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  if (path === "/api/profile" && request.method === "GET") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);

    const full = await userRepository.findById(env, user.id);
    if (!full) return json({ message: "User tidak ditemukan" }, 404);

    return json({
      id: full.id,
      name: full.name,
      username: full.username,
      email: full.email,
      xp: full.xp,
      level: full.level,
      streak: full.streak,
    });
  }

  if (path === "/api/progress" && request.method === "GET") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);

    const [lessonsCompleted, challengesSolved, quizAccuracy] = await Promise.all([
      userRepository.countCompletedLessons(env, user.id),
      userRepository.countSolvedChallenges(env, user.id),
      userRepository.quizAccuracy(env, user.id),
    ]);
    return json({ lessonsCompleted, challengesSolved, quizAccuracy });
  }

  if (path === "/api/achievements" && request.method === "GET") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);

    const [all, mine] = await Promise.all([
      gamificationRepository.listAchievements(env),
      gamificationRepository.userAchievements(env, user.id),
    ]);
    const earnedCodes = new Set((mine.results as any[]).map((a) => a.achievement_code));
    const merged = (all.results as any[]).map((a) => ({ ...a, earned: earnedCodes.has(a.code) }));
    return json(merged);
  }

  if (path === "/api/leaderboard" && request.method === "GET") {
    const top = await userRepository.leaderboard(env, 10);
    return json(top);
  }

  if (path === "/api/bookmarks" && request.method === "GET") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);
    const res = await progressRepository.listBookmarks(env, user.id);
    return json(res.results);
  }

  if (path === "/api/bookmarks" && request.method === "POST") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);
    const body = await request.json<any>().catch(() => ({}));
    if (!body.targetType || !body.targetId) return json({ message: "targetType dan targetId wajib" }, 422);
    await progressRepository.addBookmark(env, user.id, body.targetType, body.targetId);
    return json({ ok: true }, 201);
  }

  if (path === "/api/bookmarks" && request.method === "DELETE") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);
    const body = await request.json<any>().catch(() => ({}));
    await progressRepository.removeBookmark(env, user.id, body.targetType, body.targetId);
    return json({ ok: true });
  }

  return null;
}
