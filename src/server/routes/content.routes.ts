import type { Env } from "../index";
import { json } from "../utils/response";
import { contentRepository } from "../repositories/content.repository";

// Public, read-only content: courses, roadmaps, challenges, quizzes,
// projects, articles, schedule. No auth required.
export async function handleContentRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  const url = new URL(request.url);

  if (path === "/api/courses" && request.method === "GET") {
    const res = await contentRepository.listCourses(env);
    return json(res.results);
  }

  const courseMatch = path.match(/^\/api\/courses\/([^/]+)$/);
  if (courseMatch && request.method === "GET") {
    const course: any = await contentRepository.getCourseBySlug(env, courseMatch[1]);
    if (!course) return json({ message: "Course tidak ditemukan" }, 404);
    const modules = (await contentRepository.listModules(env, course.id)).results as any[];
    const modulesWithLessons = await Promise.all(
      modules.map(async (m) => ({
        ...m,
        lessons: (await contentRepository.listLessonsByModule(env, m.id)).results,
      }))
    );
    return json({ ...course, modules: modulesWithLessons });
  }

  if (path === "/api/roadmaps" && request.method === "GET") {
    const res = await contentRepository.listRoadmaps(env);
    return json(res.results);
  }

  const roadmapMatch = path.match(/^\/api\/roadmaps\/([^/]+)$/);
  if (roadmapMatch && request.method === "GET") {
    const roadmap = await contentRepository.getRoadmapBySlug(env, roadmapMatch[1]);
    if (!roadmap) return json({ message: "Roadmap tidak ditemukan" }, 404);
    const items = await contentRepository.listRoadmapItems(env, roadmap.id);
    return json({ ...roadmap, items: items.results });
  }

  if (path === "/api/challenges" && request.method === "GET") {
    const difficulty = url.searchParams.get("difficulty") || undefined;
    const res = await contentRepository.listChallenges(env, difficulty);
    return json(res.results);
  }

  const challengeMatch = path.match(/^\/api\/challenges\/([^/]+)$/);
  if (challengeMatch && request.method === "GET") {
    const challenge: any = await contentRepository.getChallengeBySlug(env, challengeMatch[1]);
    if (!challenge) return json({ message: "Challenge tidak ditemukan" }, 404);
    const { solution, ...safe } = challenge; // never send solution unless explicitly requested/solved
    return json(safe);
  }

  if (path === "/api/quizzes" && request.method === "GET") {
    const res = await contentRepository.listQuizzes(env);
    return json(res.results);
  }

  const quizMatch = path.match(/^\/api\/quizzes\/([^/]+)$/);
  if (quizMatch && request.method === "GET") {
    const quiz = await contentRepository.getQuiz(env, quizMatch[1]);
    if (!quiz) return json({ message: "Quiz tidak ditemukan" }, 404);
    const questions = (await contentRepository.listQuizQuestions(env, quizMatch[1])).results as any[];
    // Strip correct_answer/explanation before sending to client
    const safeQuestions = questions.map(({ correct_answer, explanation, ...q }) => ({
      ...q,
      options: JSON.parse(q.options),
    }));
    return json({ ...quiz, questions: safeQuestions });
  }

  if (path === "/api/projects" && request.method === "GET") {
    const res = await contentRepository.listProjects(env);
    return json(res.results);
  }

  const projectMatch = path.match(/^\/api\/projects\/([^/]+)$/);
  if (projectMatch && request.method === "GET") {
    const project = await contentRepository.getProjectBySlug(env, projectMatch[1]);
    if (!project) return json({ message: "Project tidak ditemukan" }, 404);
    return json(project);
  }

  if (path === "/api/articles" && request.method === "GET") {
    const res = await contentRepository.listArticles(env);
    return json(res.results);
  }

  const articleMatch = path.match(/^\/api\/articles\/([^/]+)$/);
  if (articleMatch && request.method === "GET") {
    const article = await contentRepository.getArticleBySlug(env, articleMatch[1]);
    if (!article) return json({ message: "Artikel tidak ditemukan" }, 404);
    return json(article);
  }

  if (path === "/api/schedule" && request.method === "GET") {
    const today = new Date().getDay(); // 0=Sunday
    const todaySubject = await contentRepository.todaySchedule(env, today);
    const all = await contentRepository.listSchedule(env);
    return json({ today: todaySubject, week: all.results });
  }

  return null;
}
