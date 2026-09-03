import type { Env } from "../index";
import { newId } from "../auth/tokens";

export const gamificationRepository = {
  addXpTransaction: (env: Env, userId: string, amount: number, reason: string) =>
    env.DB.prepare(`INSERT INTO xp_transactions (id, user_id, amount, reason) VALUES (?, ?, ?, ?)`)
      .bind(newId(), userId, amount, reason)
      .run(),

  recordStreakDay: (env: Env, userId: string, date: string) =>
    env.DB.prepare(`INSERT OR IGNORE INTO daily_streaks (user_id, date) VALUES (?, ?)`).bind(userId, date).run(),

  listAchievements: (env: Env) => env.DB.prepare(`SELECT * FROM achievements`).all(),

  userAchievements: (env: Env, userId: string) =>
    env.DB.prepare(`SELECT * FROM user_achievements WHERE user_id = ?`).bind(userId).all(),

  hasAchievement: async (env: Env, userId: string, code: string) => {
    const row = await env.DB.prepare(`SELECT 1 FROM user_achievements WHERE user_id = ? AND achievement_code = ?`)
      .bind(userId, code)
      .first();
    return !!row;
  },

  grantAchievement: (env: Env, userId: string, code: string) =>
    env.DB.prepare(`INSERT OR IGNORE INTO user_achievements (user_id, achievement_code) VALUES (?, ?)`)
      .bind(userId, code)
      .run(),
};
