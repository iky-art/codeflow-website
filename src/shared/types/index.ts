export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  difficulty: string;
  category: string;
  estimated_duration: string;
  published: number;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  slug: string;
  content: string;
  difficulty: string;
  xp_reward: number;
  estimated_minutes: number;
}

export interface Roadmap {
  id: string;
  title: string;
  slug: string;
  description: string;
}

export interface RoadmapItem {
  id: string;
  roadmap_id: string;
  title: string;
  order_index: number;
}

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  language: string;
  instructions: string;
  examples: string;
  hints: string;
  solution?: string;
  xp_reward: number;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer?: string;
  explanation?: string;
  xp_reward: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  xp_reward: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface LearningSession {
  id: string;
  course_id: string;
  lesson_id: string | null;
  progress: number;
}

export interface Achievement {
  code: string;
  title: string;
  description: string;
}

export interface ScheduleDay {
  day_of_week: number;
  subject: string;
  description: string;
}
