import { FormEvent, useState } from "react";
import { Button } from "../Button/Button";
import "./ChatUI.css";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatUIProps {
  messages: ChatMessage[];
  onSend: (content: string) => void;
  disabled?: boolean;
}

// Presentation-only chat UI. Wiring to /api/chat/:uuid and the eventual
// AI Tutor provider happens in Phase 7 — this component doesn't assume
// where messages come from.
export function ChatUI({ messages, onSend, disabled }: ChatUIProps) {
  const [draft, setDraft] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft("");
  }

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble chat-bubble-${m.role}`}>
            {m.content}
          </div>
        ))}
      </div>
      <form className="chat-input-bar" onSubmit={handleSubmit}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tanya sesuatu..."
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled}>
          Kirim
        </Button>
      </form>
    </div>
  );
}
