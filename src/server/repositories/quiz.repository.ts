import type { Env } from "../index";
import { newId } from "../auth/tokens";

export const quizRepository = {
  recordAttempt: (
    env: Env,
    userId: string,
    quizId: string,
    score: number,
    total: number,
    xpEarned: number
  ) =>
    env.DB.prepare(
      `INSERT INTO quiz_attempts (id, user_id, quiz_id, score, total_questions, xp_earned) VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(newId(), userId, quizId, score, total, xpEarned)
      .run(),
};
