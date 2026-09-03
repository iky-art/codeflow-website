import type { Env } from "../index";
import { newId } from "../auth/tokens";

export interface ChatSessionRow {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const chatRepository = {
  async create(env: Env, userId: string, title = "New Chat") {
    const id = newId();
    await env.DB.prepare(`INSERT INTO chat_sessions (id, user_id, title) VALUES (?, ?, ?)`)
      .bind(id, userId, title)
      .run();
    return id;
  },

  getById: (env: Env, id: string) =>
    env.DB.prepare(`SELECT * FROM chat_sessions WHERE id = ?`).bind(id).first<ChatSessionRow>(),

  listForUser: (env: Env, userId: string) =>
    env.DB.prepare(`SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC`).bind(userId).all(),

  rename: (env: Env, id: string, title: string) =>
    env.DB.prepare(`UPDATE chat_sessions SET title = ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(title, id)
      .run(),

  touch: (env: Env, id: string) =>
    env.DB.prepare(`UPDATE chat_sessions SET updated_at = datetime('now') WHERE id = ?`).bind(id).run(),

  delete: (env: Env, id: string) => env.DB.prepare(`DELETE FROM chat_sessions WHERE id = ?`).bind(id).run(),

  deleteMessages: (env: Env, chatId: string) =>
    env.DB.prepare(`DELETE FROM chat_messages WHERE chat_id = ?`).bind(chatId).run(),

  addMessage: (env: Env, chatId: string, role: "user" | "assistant" | "system", content: string) =>
    env.DB.prepare(`INSERT INTO chat_messages (id, chat_id, role, content) VALUES (?, ?, ?, ?)`)
      .bind(newId(), chatId, role, content)
      .run(),

  listMessages: (env: Env, chatId: string) =>
    env.DB.prepare(`SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC`).bind(chatId).all(),
};
