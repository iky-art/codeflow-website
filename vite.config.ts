import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  root: "src/client",
  publicDir: "../../public",
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@client": path.resolve(__dirname, "src/client"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  server: {
    proxy: {
      // During local dev, forward /api to Wrangler dev server (Workers)
      "/api": "http://localhost:8787",
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "CodeFlow",
        short_name: "CodeFlow",
        description: "Learn. Code. Build.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // Never precache/runtime-cache anything under /api/auth, /api/chat,
        // /api/profile, /api/dashboard — those are private/session-bound.
        navigateFallback: "/offline.html",
        runtimeCaching: [
          {
            urlPattern: /^\/api\/(courses|roadmaps|articles|projects)/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "public-api-cache" },
          },
        ],
      },
    }),
  ],
});
