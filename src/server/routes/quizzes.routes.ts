import type { Env } from "../index";
import { json } from "../utils/response";
import { resolveUser } from "../middleware/auth.middleware";
import { contentRepository } from "../repositories/content.repository";
import { quizRepository } from "../repositories/quiz.repository";
import { xpService } from "../services/xp.service";
import { streakService } from "../services/streak.service";
import { achievementService } from "../services/achievement.service";

interface AnswerPayload {
  questionId: string;
  selected: string; // matches correct_answer format, e.g. option index as string
}

export async function handleQuizSubmitRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  const submitMatch = path.match(/^\/api\/quizzes\/([^/]+)\/submit$/);
  if (!submitMatch || request.method !== "POST") return null;

  const user = await resolveUser(request, env);
  if (!user) return json({ message: "Unauthorized" }, 401);

  const quizId = submitMatch[1];
  const body = await request.json<{ answers: AnswerPayload[] }>().catch(() => ({ answers: [] as AnswerPayload[] }));

  let correctCount = 0;
  let xpEarned = 0;
  const total = body.answers.length;

  for (const answer of body.answers) {
    const question = await contentRepository.getQuizQuestion(env, answer.questionId);
    if (!question) continue;
    if (question.correct_answer === answer.selected) {
      correctCount++;
      xpEarned += question.xp_reward;
    }
  }

  await quizRepository.recordAttempt(env, user.id, quizId, correctCount, total, xpEarned);

  let xpResult = null;
  if (xpEarned > 0) {
    xpResult = await xpService.award(env, user.id, xpEarned, `quiz:${quizId}`);
  }
  const newStreak = await streakService.touch(env, user.id);
  const achievements = await achievementService.checkAndGrant(env, user.id);

  return json({ score: correctCount, total, xpEarned, xpResult, newStreak, achievements });
}
