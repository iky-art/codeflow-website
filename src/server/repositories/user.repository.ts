import type { Env } from "../index";
import { newId } from "../auth/tokens";

export interface UserRow {
  id: string;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  role: "USER" | "ADMIN";
  xp: number;
  level: number;
  streak: number;
  last_active_date: string | null;
  created_at: string;
  updated_at: string;
}

export const userRepository = {
  async findByEmailOrUsername(env: Env, identifier: string) {
    return env.DB.prepare(`SELECT * FROM users WHERE email = ?1 OR username = ?1`)
      .bind(identifier)
      .first<UserRow>();
  },

  async findById(env: Env, id: string) {
    return env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first<UserRow>();
  },

  async create(env: Env, data: { name: string; username: string; email: string; passwordHash: string }) {
    const id = newId();
    await env.DB.prepare(
      `INSERT INTO users (id, name, username, email, password_hash, xp, level, streak) VALUES (?, ?, ?, ?, ?, 0, 1, 0)`
    )
      .bind(id, data.name, data.username, data.email, data.passwordHash)
      .run();
    await env.DB.prepare(`INSERT INTO user_settings (user_id) VALUES (?)`).bind(id).run();
    return this.findById(env, id);
  },

  async updateXpAndLevel(env: Env, userId: string, xp: number, level: number) {
    await env.DB.prepare(`UPDATE users SET xp = ?, level = ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(xp, level, userId)
      .run();
  },

  async updateStreak(env: Env, userId: string, streak: number, lastActiveDate: string) {
    await env.DB.prepare(
      `UPDATE users SET streak = ?, last_active_date = ?, updated_at = datetime('now') WHERE id = ?`
    )
      .bind(streak, lastActiveDate, userId)
      .run();
  },

  async updatePasswordHash(env: Env, userId: string, passwordHash: string) {
    await env.DB.prepare(`UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(passwordHash, userId)
      .run();
  },

  async leaderboard(env: Env, limit = 10) {
    const res = await env.DB.prepare(`SELECT id, name, username, xp, level FROM users ORDER BY xp DESC LIMIT ?`)
      .bind(limit)
      .all();
    return res.results;
  },

  async countCompletedLessons(env: Env, userId: string): Promise<number> {
    const row = await env.DB.prepare(
      `SELECT COUNT(*) as c FROM lesson_progress WHERE user_id = ? AND status = 'completed'`
    )
      .bind(userId)
      .first<{ c: number }>();
    return row?.c ?? 0;
  },

  async countSolvedChallenges(env: Env, userId: string): Promise<number> {
    const row = await env.DB.prepare(
      `SELECT COUNT(*) as c FROM challenge_submissions WHERE user_id = ? AND status = 'solved'`
    )
      .bind(userId)
      .first<{ c: number }>();
    return row?.c ?? 0;
  },

  async quizAccuracy(env: Env, userId: string): Promise<number> {
    const row = await env.DB.prepare(
      `SELECT SUM(score) as correct, SUM(total_questions) as total FROM quiz_attempts WHERE user_id = ?`
    )
      .bind(userId)
      .first<{ correct: number | null; total: number | null }>();
    if (!row?.total) return 0;
    return Math.round(((row.correct || 0) / row.total) * 100);
  },
};
