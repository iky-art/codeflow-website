import type { Env } from "../index";
import { newId } from "../auth/tokens";

export const challengeRepository = {
  recordSubmission: (env: Env, userId: string, challengeId: string, status: "attempted" | "solved") =>
    env.DB.prepare(`INSERT INTO challenge_submissions (id, user_id, challenge_id, status) VALUES (?, ?, ?, ?)`)
      .bind(newId(), userId, challengeId, status)
      .run(),

  hasSolved: async (env: Env, userId: string, challengeId: string) => {
    const row = await env.DB.prepare(
      `SELECT 1 FROM challenge_submissions WHERE user_id = ? AND challenge_id = ? AND status = 'solved' LIMIT 1`
    )
      .bind(userId, challengeId)
      .first();
    return !!row;
  },
};
