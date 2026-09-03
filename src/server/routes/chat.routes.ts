import type { Env } from "../index";
import { json, noContent } from "../utils/response";
import { resolveUser } from "../middleware/auth.middleware";
import { chatRepository } from "../repositories/chat.repository";
import { chatService } from "../services/chat.service";

// Every route here enforces: authenticated AND owns the session.
// The UUID in the URL is never treated as sufficient authorization on its own.

export async function handleChatRoute(request: Request, env: Env, path: string): Promise<Response | null> {
  if (path === "/api/chat" && request.method === "GET") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);
    const res = await chatRepository.listForUser(env, user.id);
    return json(res.results);
  }

  if (path === "/api/chat" && request.method === "POST") {
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);
    const body = await request.json<any>().catch(() => ({}));
    const id = await chatRepository.create(env, user.id, body.title || "New Chat");
    return json({ id }, 201);
  }

  const chatMatch = path.match(/^\/api\/chat\/([^/]+)$/);
  if (chatMatch) {
    const chatId = chatMatch[1];
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);

    const session = await chatRepository.getById(env, chatId);
    // Ownership check — 404 (not 403) so we don't confirm the session exists
    // to a user who doesn't own it.
    if (!session || session.user_id !== user.id) return json({ message: "Not found" }, 404);

    if (request.method === "GET") {
      const messages = await chatRepository.listMessages(env, chatId);
      return json({ ...session, messages: messages.results });
    }

    if (request.method === "PATCH") {
      const body = await request.json<any>().catch(() => ({}));
      if (body.title) await chatRepository.rename(env, chatId, body.title);
      return json({ ok: true });
    }

    if (request.method === "DELETE") {
      await chatRepository.deleteMessages(env, chatId);
      await chatRepository.delete(env, chatId);
      return noContent();
    }
  }

  const messagesMatch = path.match(/^\/api\/chat\/([^/]+)\/messages$/);
  if (messagesMatch && request.method === "POST") {
    const chatId = messagesMatch[1];
    const user = await resolveUser(request, env);
    if (!user) return json({ message: "Unauthorized" }, 401);

    const session = await chatRepository.getById(env, chatId);
    if (!session || session.user_id !== user.id) return json({ message: "Not found" }, 404);

    const body = await request.json<any>().catch(() => ({}));
    if (!body.content || typeof body.content !== "string") return json({ message: "content wajib diisi" }, 422);

    const reply = await chatService.sendMessage(env, chatId, body.content);
    return json({ reply });
  }

  return null;
}
