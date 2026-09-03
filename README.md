# CodeFlow Website

Website resmi CodeFlow — *Learn. Code. Build.* React + TypeScript + Vite di Cloudflare Pages, API di Cloudflare Workers, database Cloudflare D1.

## Status: Implementasi Penuh (Phase 3–13 dari brief)

Semua fitur inti dari brief sudah diimplementasikan: auth, dashboard, learning engine + UUID session, chat system (UUID + mock assistant), gamifikasi, challenge & quiz, projects & articles, admin panel dasar, PWA, dan security headers/rate limiting dasar. Detail status lengkap di bagian bawah.

## Setup

```bash
npm install --ignore-scripts
cp .env.example .env
```

> `--ignore-scripts` diperlukan karena `workerd` (dipakai `wrangler dev`) tidak punya build untuk Android/Termux — lihat bagian **Wrangler + Termux/Android** di bawah.

### Jalankan frontend lokal

```bash
npm run dev
```

Vite saja (`http://localhost:5173`). Karena `wrangler dev` tidak bisa jalan di Termux, endpoint `/api/*` tidak bisa dites di localhost — lihat alur kerja di bawah.

## Setup Cloudflare (D1 + deploy)

```bash
wrangler login
wrangler d1 create codeflow-db
# → copy "database_id" yang muncul, isi ke wrangler.jsonc (field database_id)

npm run db:migrate:remote     # jalankan migration (semua tabel)
npm run db:seed:remote         # isi data contoh (schedule, course, roadmap, quiz, dst)

npm run deploy                  # build frontend + deploy ke Cloudflare Pages
wrangler deploy                  # deploy Worker (API)
```

Setelah deploy, API live di Worker kamu dan frontend di `https://codeflow.pages.dev` (atau domain preview Cloudflare Pages kamu selama belum dihubungkan ke domain custom).

### Membuat akun admin pertama

Register lewat website seperti biasa, lalu jadikan admin manual (belum ada UI untuk ini, sesuai scope saat ini):

```bash
wrangler d1 execute codeflow-db --remote --command "UPDATE users SET role='ADMIN' WHERE email='emailkamu@example.com'"
```

## Wrangler + Termux/Android

`wrangler dev` bergantung pada `workerd`, yang tidak punya build untuk Android — limitasi Cloudflare, bukan bug project ini.

- **Tidak jalan di Termux:** `wrangler dev`, `npm run dev:worker`, migration `--local`
- **Jalan normal di Termux** (cuma komunikasi ke Cloudflare API): `wrangler login`, `wrangler d1 create`, `d1 migrations apply --remote`, `d1 execute --remote`, `pages deploy`, `wrangler deploy`, `wrangler secret put`
- Konsekuensi: testing API hanya bisa dilakukan setelah deploy ke Cloudflare, tidak di localhost.

## Struktur Project

```
src/client/    → React SPA (components, pages, layouts, hooks, lib, styles, app)
src/server/    → Cloudflare Workers API (routes, middleware, services, repositories, auth, utils)
src/db/        → schema, migrations (0001, 0002), seed.sql
src/shared/    → types, constants, validators — dipakai client & server
public/        → assets statis, offline.html, robots.txt
tests/unit/    → vitest — jalankan dengan `npm test`
```

## Environment Variables

```
PUBLIC_APP_URL=https://codeflow.pages.dev
```

## Fitur yang Sudah Diimplementasikan

**Auth** — register, login, logout, forgot/reset password, session HTTP-only cookie, password hashing PBKDF2 via Web Crypto (tanpa native addon)

**Learning** — courses → modules → lessons, learning session dengan UUID (`/learn/:uuid`), ownership check server-side, lesson completion + XP

**Roadmap** — 8 roadmap (Frontend/Backend/Fullstack/Mobile/AI/DevOps/Cybersecurity/Game), progress per item

**Challenge** — list, detail, hint, submit (mark solved) + XP; solution endpoint masih placeholder (lihat "Belum Ada")

**Quiz** — quiz engine multi-soal, submit jawaban, scoring + XP, jawaban benar tidak pernah dikirim ke client sebelum submit

**Chat (AI Tutor architecture)** — `/chat/:uuid`, CRUD (new/rename/delete), mock assistant reply (provider asli belum diaktifkan, sesuai instruksi brief), ownership check ketat

**Gamifikasi** — XP, Level (curve di `xp.service.ts`), Streak (berbasis tanggal), Achievements (4 achievement aktif), Leaderboard

**Dashboard** — welcome message, today's subject (dari DB), stats XP/Level/Streak, recent chats, quick links

**Admin** — role-gated (`role === 'ADMIN'` dicek server-side di setiap request), kelola users (view), courses (create/list), articles (create/list), weekly schedule (edit)

**PWA** — manifest, service worker (vite-plugin-pwa), offline fallback, runtime cache **hanya** untuk endpoint publik (courses/roadmaps/articles/projects) — tidak pernah cache auth/chat/profile/dashboard

**Security** — password hashing, HTTP-only+SameSite cookie, security headers dasar, rate limiting sederhana (in-memory, di endpoint login/register/forgot-password), parameterized queries di semua repository, UUID tidak pernah jadi satu-satunya mekanisme otorisasi

**SEO** — `robots.txt` dengan disallow untuk route privat; metadata dasar di `index.html`

## Belum Ada / Parsial

- **Solution challenge** — endpoint dedicated `/api/challenges/:id/solution` belum dibuat; saat ini UI menampilkan placeholder
- **AI provider asli untuk chat** — arsitektur (`chat.service.ts`) sudah siap dengan satu titik sambung (`generateAssistantReply`), tapi provider sungguhan belum diintegrasikan sesuai instruksi brief
- **Email provider** — forgot-password membuat token di DB tapi belum benar-benar mengirim email (belum ada provider ditentukan); token saat ini cuma di-log ke console Worker
- **Admin UI** — masih dasar (list + create sederhana), belum ada edit/delete penuh untuk semua entity (modules, lessons, roadmap items, challenges, quizzes, projects belum ada admin form)
- **CSP ketat** — security headers dasar sudah ada, tapi Content-Security-Policy belum di-set (sengaja, supaya tidak merusak app saat masih berkembang — lihat komentar di `utils/response.ts`)
- **Notifikasi push/email** — tabel & endpoint dasar ada, belum ada pengirim
- **PWA icons** — belum ada file icon asli di `public/icons/`, perlu ditambahkan manual
- **Telegram account linking** — sengaja belum diimplementasikan sesuai brief

## Testing

```bash
npm test
```

Test saat ini mencakup validators (email, username, password, register). Test integrasi untuk auth/authorization/UUID ownership (item di Phase 14 brief) belum ditambahkan — butuh environment D1 test yang terpisah dari flow development Termux ini.

## Catatan

Project ini dibuat di lingkungan tanpa akses jaringan, jadi `npm install` dan build **belum divalidasi** end-to-end di sini. Kalau ada error saat kamu jalankan, kirim log-nya.
