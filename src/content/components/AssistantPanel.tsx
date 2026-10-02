import { useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { SuggestionButton } from "./SuggestionButton";
import { VoiceButton } from "./VoiceButton";
import type { ChatMessage as ChatMessageType, PageContext } from "../types";

type AssistantPanelProps = {
  pageContext: PageContext | null;
  messages: ChatMessageType[];
  onClose: () => void;
  onNewMessage: (content: string) => void;
};

export function AssistantPanel({ messages, onClose, onNewMessage }: AssistantPanelProps) {
  const [input, setInput] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);

  const handleSubmit = () => {
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    onNewMessage(trimmed);
    setInput("");
  };

  return (
    <div className="must-ai-panel" role="dialog" aria-modal="false" aria-label="MUST AI assistant">
      <div className="must-ai-header">
        <div>
          <strong>MUST AI</strong>
          <span>Your intelligent university assistant</span>
        </div>

        <button type="button" className="must-ai-close" onClick={onClose} aria-label="Close MUST AI">
          ×
        </button>
      </div>

      <div className="must-ai-body">
        <div className="must-ai-toolbar">
          <VoiceButton onClick={() => setVoiceActive((value) => !value)} active={voiceActive} />
          <span className="must-ai-status">Page analysis ready</span>
        </div>

        <div className="must-ai-chat" aria-live="polite">
          {messages.length === 0 ? (
            <div className="must-ai-empty-state">Ask a question about the page or use a suggested action.</div>
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}
        </div>

        <div className="must-ai-suggestions">
          <SuggestionButton
            label="🧭 Understand this page"
            onClick={() => onNewMessage("What is on this page?")}
          />
          <SuggestionButton
            label="🔎 Find Admissions"
            onClick={() => onNewMessage("Where is Admissions?")}
          />
          <SuggestionButton
            label="📚 Summarize the page"
            onClick={() => onNewMessage("Summarize this page")}
          />
        </div>
      </div>

      <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} />
    </div>
  );
}
