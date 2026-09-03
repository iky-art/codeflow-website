import type { Env } from "../index";
import { newId } from "../auth/tokens";

export const progressRepository = {
  getLessonProgress: (env: Env, userId: string, lessonId: string) =>
    env.DB.prepare(`SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?`)
      .bind(userId, lessonId)
      .first<{ status: string }>(),

  markLessonCompleted: (env: Env, userId: string, lessonId: string) =>
    env.DB.prepare(
      `INSERT INTO lesson_progress (user_id, lesson_id, status, completed_at) VALUES (?, ?, 'completed', datetime('now'))
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = datetime('now')`
    )
      .bind(userId, lessonId)
      .run(),

  async createLearningSession(env: Env, userId: string, courseId: string, lessonId: string | null) {
    const id = newId();
    await env.DB.prepare(
      `INSERT INTO learning_sessions (id, user_id, course_id, lesson_id, progress) VALUES (?, ?, ?, ?, 0)`
    )
      .bind(id, userId, courseId, lessonId)
      .run();
    return id;
  },

  getLearningSession: (env: Env, id: string) =>
    env.DB.prepare(`SELECT * FROM learning_sessions WHERE id = ?`).bind(id).first<{
      id: string;
      user_id: string;
      course_id: string;
      lesson_id: string | null;
      progress: number;
    }>(),

  updateLearningSessionProgress: (env: Env, id: string, progress: number, lessonId: string | null) =>
    env.DB.prepare(`UPDATE learning_sessions SET progress = ?, lesson_id = ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(progress, lessonId, id)
      .run(),

  addBookmark: (env: Env, userId: string, targetType: string, targetId: string) =>
    env.DB.prepare(`INSERT OR IGNORE INTO bookmarks (user_id, target_type, target_id) VALUES (?, ?, ?)`)
      .bind(userId, targetType, targetId)
      .run(),

  removeBookmark: (env: Env, userId: string, targetType: string, targetId: string) =>
    env.DB.prepare(`DELETE FROM bookmarks WHERE user_id = ? AND target_type = ? AND target_id = ?`)
      .bind(userId, targetType, targetId)
      .run(),

  listBookmarks: (env: Env, userId: string) =>
    env.DB.prepare(`SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC`).bind(userId).all(),
};
