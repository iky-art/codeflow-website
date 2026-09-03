import type { Env } from "../index";
import { json } from "../utils/response";
import { resolveUser } from "../middleware/auth.middleware";
import { contentRepository } from "../repositories/content.repository";
import { progressRepository } from "../repositories/progress.repository";
import { xpService } from "../services/xp.service";
import { streakService } from "../services/streak.service";
import { achievementService } from "../services/achievement.service";

export async function handleLessonsRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  const completeMatch = path.match(/^\/api\/lessons\/([^/]+)\/complete$/);
  if (completeMatch && request.method === "POST") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);

    const lessonId = completeMatch[1];
    const lesson: any = await contentRepository.getLessonById(env, lessonId);
    if (!lesson) return json({ message: "Lesson tidak ditemukan" }, 404);

    const already = await progressRepository.getLessonProgress(env, user.id, lessonId);
    const alreadyCompleted = already?.status === "completed";

    await progressRepository.markLessonCompleted(env, user.id, lessonId);

    let xpResult = null;
    if (!alreadyCompleted) {
      xpResult = await xpService.award(env, user.id, lesson.xp_reward || 25, `lesson:${lessonId}`);
    }
    const newStreak = await streakService.touch(env, user.id);
    const achievements = await achievementService.checkAndGrant(env, user.id);

    return json({ alreadyCompleted, xpResult, newStreak, achievements });
  }

  const lessonMatch = path.match(/^\/api\/lessons\/([^/]+)$/);
  if (lessonMatch && request.method === "GET") {
    const lesson = await contentRepository.getLessonById(env, lessonMatch[1]);
    if (!lesson) return json({ message: "Lesson tidak ditemukan" }, 404);
    return json(lesson);
  }

  return null;
}
