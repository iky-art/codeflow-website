import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose — that config sets root to
// src/client for the frontend build, which would confuse Vitest's test
// discovery. Tests live under /tests, independent of the client root.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
