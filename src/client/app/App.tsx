import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./ProtectedRoute";

import HomePage from "../pages/HomePage";
import LearnPage from "../pages/LearnPage";
import CoursePage from "../pages/CoursePage";
import RoadmapsPage from "../pages/RoadmapsPage";
import RoadmapPage from "../pages/RoadmapPage";
import ChallengesPage from "../pages/ChallengesPage";
import ChallengePage from "../pages/ChallengePage";
import QuizzesPage from "../pages/QuizzesPage";
import QuizPage from "../pages/QuizPage";
import ProjectsPage from "../pages/ProjectsPage";
import ProjectPage from "../pages/ProjectPage";
import ArticlesPage from "../pages/ArticlesPage";
import ArticlePage from "../pages/ArticlePage";
import ToolsPage from "../pages/ToolsPage";
import AboutPage from "../pages/AboutPage";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import NotificationsPage from "../pages/NotificationsPage";
import BookmarksPage from "../pages/BookmarksPage";
import ProgressPage from "../pages/ProgressPage";
import AchievementsPage from "../pages/AchievementsPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import ChatPage from "../pages/ChatPage";
import LearningSessionPage from "../pages/LearningSessionPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminCoursesPage from "../pages/admin/AdminCoursesPage";
import AdminSchedulePage from "../pages/admin/AdminSchedulePage";
import AdminArticlesPage from "../pages/admin/AdminArticlesPage";

import NotFoundPage from "../pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/courses" element={<LearnPage />} />
      <Route path="/courses/:slug" element={<CoursePage />} />
      <Route path="/roadmaps" element={<RoadmapsPage />} />
      <Route path="/roadmap/:slug" element={<RoadmapPage />} />
      <Route path="/challenges" element={<ChallengesPage />} />
      <Route path="/challenge/:id" element={<ChallengePage />} />
      <Route path="/quizzes" element={<QuizzesPage />} />
      <Route path="/quiz/:id" element={<QuizPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:slug" element={<ArticlePage />} />
      <Route path="/resources" element={<ToolsPage />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Private — protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/chat/:uuid" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/learn/:uuid" element={<ProtectedRoute><LearningSessionPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
      <Route path="/admin/courses" element={<AdminRoute><AdminCoursesPage /></AdminRoute>} />
      <Route path="/admin/schedule" element={<AdminRoute><AdminSchedulePage /></AdminRoute>} />
      <Route path="/admin/articles" element={<AdminRoute><AdminArticlesPage /></AdminRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
