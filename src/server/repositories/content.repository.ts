import type { Env } from "../index";

// Read-mostly repository for public content: courses, modules, lessons,
// roadmaps, challenges, quizzes, projects, articles.

export const contentRepository = {
  listCourses: (env: Env) =>
    env.DB.prepare(`SELECT * FROM courses WHERE published = 1 ORDER BY order_index`).all(),

  getCourseBySlug: (env: Env, slug: string) =>
    env.DB.prepare(`SELECT * FROM courses WHERE slug = ? AND published = 1`).bind(slug).first(),

  listModules: (env: Env, courseId: string) =>
    env.DB.prepare(`SELECT * FROM course_modules WHERE course_id = ? ORDER BY order_index`).bind(courseId).all(),

  listLessonsByModule: (env: Env, moduleId: string) =>
    env.DB.prepare(`SELECT * FROM lessons WHERE module_id = ? AND published = 1 ORDER BY order_index`)
      .bind(moduleId)
      .all(),

  getLessonById: (env: Env, id: string) => env.DB.prepare(`SELECT * FROM lessons WHERE id = ?`).bind(id).first(),

  listRoadmaps: (env: Env) => env.DB.prepare(`SELECT * FROM roadmaps`).all(),

  getRoadmapBySlug: (env: Env, slug: string) =>
    env.DB.prepare(`SELECT * FROM roadmaps WHERE slug = ?`).bind(slug).first<{ id: string; title: string; slug: string; description: string }>(),

  listRoadmapItems: (env: Env, roadmapId: string) =>
    env.DB.prepare(`SELECT * FROM roadmap_items WHERE roadmap_id = ? ORDER BY order_index`).bind(roadmapId).all(),

  listChallenges: (env: Env, difficulty?: string) =>
    difficulty
      ? env.DB.prepare(`SELECT id, title, slug, difficulty, xp_reward FROM challenges WHERE published = 1 AND difficulty = ?`)
          .bind(difficulty)
          .all()
      : env.DB.prepare(`SELECT id, title, slug, difficulty, xp_reward FROM challenges WHERE published = 1`).all(),

  getChallengeBySlug: (env: Env, slug: string) =>
    env.DB.prepare(`SELECT * FROM challenges WHERE slug = ? AND published = 1`).bind(slug).first<any>(),

  getChallengeById: (env: Env, id: string) => env.DB.prepare(`SELECT * FROM challenges WHERE id = ?`).bind(id).first<any>(),

  listQuizzes: (env: Env) => env.DB.prepare(`SELECT id, title, category FROM quizzes`).all(),

  getQuiz: (env: Env, id: string) => env.DB.prepare(`SELECT * FROM quizzes WHERE id = ?`).bind(id).first(),

  listQuizQuestions: (env: Env, quizId: string) =>
    env.DB.prepare(`SELECT * FROM quiz_questions WHERE quiz_id = ?`).bind(quizId).all(),

  getQuizQuestion: (env: Env, id: string) =>
    env.DB.prepare(`SELECT * FROM quiz_questions WHERE id = ?`).bind(id).first<any>(),

  listProjects: (env: Env) => env.DB.prepare(`SELECT * FROM projects`).all(),

  getProjectBySlug: (env: Env, slug: string) => env.DB.prepare(`SELECT * FROM projects WHERE slug = ?`).bind(slug).first(),

  listArticles: (env: Env) =>
    env.DB.prepare(`SELECT id, title, slug, summary, created_at FROM articles WHERE published = 1 ORDER BY created_at DESC`).all(),

  getArticleBySlug: (env: Env, slug: string) =>
    env.DB.prepare(`SELECT * FROM articles WHERE slug = ? AND published = 1`).bind(slug).first(),

  todaySchedule: (env: Env, dayOfWeek: number) =>
    env.DB.prepare(`SELECT * FROM schedule WHERE day_of_week = ?`).bind(dayOfWeek).first(),

  listSchedule: (env: Env) => env.DB.prepare(`SELECT * FROM schedule ORDER BY day_of_week`).all(),
};
