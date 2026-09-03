import type { Env } from "../index";
import { chatRepository } from "../repositories/chat.repository";

// Mock assistant for now — Phase 7 requires the architecture to be ready
// for a real AI provider without implementing one yet. This function is
// the single seam to swap in a real provider later.
export async function generateAssistantReply(env: Env, chatId: string, userMessage: string): Promise<string> {
  return `(mock tutor) Kamu bilang: "${userMessage}". Fitur AI Tutor sungguhan belum aktif — ini cuma placeholder supaya alur chat bisa diuji end-to-end.`;
}

export const chatService = {
  async sendMessage(env: Env, chatId: string, userMessage: string) {
    await chatRepository.addMessage(env, chatId, "user", userMessage);
    const reply = await generateAssistantReply(env, chatId, userMessage);
    await chatRepository.addMessage(env, chatId, "assistant", reply);
    await chatRepository.touch(env, chatId);
    return reply;
  },
};
