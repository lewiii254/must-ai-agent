import type { ChatMessage as ChatMessageType } from "../types";

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`must-ai-message ${isAssistant ? "assistant" : "user"}`}>
      <div className="must-ai-message-bubble">
        {message.content}
      </div>
    </div>
  );
}
