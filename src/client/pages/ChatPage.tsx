import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { ChatUI, ChatMessage } from "../components/ChatUI/ChatUI";
import { apiClient } from "../lib/apiClient";

// Route: /chat/:uuid — ownership enforced server-side (see chat.routes.ts).
export default function ChatPage() {
  const { uuid } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [sending, setSending] = useState(false);

  async function load() {
    if (!uuid) return;
    try {
      const session = await apiClient.get<any>(`/api/chat/${uuid}`);
      setMessages(session.messages.map((m: any) => ({ id: m.id, role: m.role, content: m.content })));
    } catch {
      setNotFound(true);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  async function handleSend(content: string) {
    setMessages((prev) => [...prev, { id: `tmp-${Date.now()}`, role: "user", content }]);
    setSending(true);
    try {
      const res = await apiClient.post<{ reply: string }>(`/api/chat/${uuid}/messages`, { content });
      setMessages((prev) => [...prev, { id: `reply-${Date.now()}`, role: "assistant", content: res.reply }]);
    } finally {
      setSending(false);
    }
  }

  if (notFound) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ padding: "var(--space-6) 0" }}>
          <h1>Chat tidak ditemukan</h1>
          <p>Chat ini tidak ada, atau bukan milik akun kamu.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ height: "calc(100vh - 65px)" }}>
        <ChatUI messages={messages} onSend={handleSend} disabled={sending} />
      </div>
    </>
  );
}
