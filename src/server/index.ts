import { handleAuthRoute } from "./routes/auth.routes";
import { handleContentRoute } from "./routes/content.routes";
import { handleLessonsRoute } from "./routes/lessons.routes";
import { handleChallengeSubmitRoute } from "./routes/challenges.routes";
import { handleQuizSubmitRoute } from "./routes/quizzes.routes";
import { handleProfileRoute } from "./routes/profile.routes";
import { handleChatRoute } from "./routes/chat.routes";
import { handleLearningRoute } from "./routes/learning.routes";
import { handleSettingsRoute } from "./routes/settings.routes";
import { handleAdminRoute } from "./routes/admin.routes";
import { json, withSecurityHeaders } from "./utils/response";

export interface Env {
  DB: D1Database;
  PUBLIC_APP_URL: string;
}

const RATE_LIMITED_PATHS = new Set(["/api/auth/login", "/api/auth/register", "/api/auth/forgot-password"]);

// Very simple in-memory rate limiter — resets on Worker cold start.
// Fine as a first line of defense; swap for Cloudflare KV-backed limiting
// if abuse becomes a real problem (see Phase 13 note in README).
const requestCounts = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(key: string, max = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = requestCounts.get(key);
  if (!entry || entry.resetAt < now) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > max;
}

async function router(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/api/health") {
    return json({ status: "ok", appUrl: env.PUBLIC_APP_URL });
  }

  if (RATE_LIMITED_PATHS.has(path)) {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(`${ip}:${path}`)) {
      return json({ message: "Terlalu banyak percobaan, coba lagi nanti." }, 429);
    }
  }

  const handlers = [
    handleAuthRoute,
    handleContentRoute,
    handleLessonsRoute,
    handleChallengeSubmitRoute,
    handleQuizSubmitRoute,
    handleProfileRoute,
    handleChatRoute,
    handleLearningRoute,
    handleSettingsRoute,
    handleAdminRoute,
  ];

  for (const handler of handlers) {
    const result = await handler(request, env, path);
    if (result) return result;
  }

  if (path.startsWith("/api/")) {
    return json({ message: "Not found" }, 404);
  }

  // Non-API requests reaching the Worker (shouldn't normally happen — Pages
  // serves static assets directly) fall back to a plain 404.
  return new Response("Not found", { status: 404, headers: withSecurityHeaders() });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await router(request, env);
    } catch (err) {
      console.error("Unhandled error:", err);
      return json({ message: "Internal server error" }, 500);
    }
  },
};
