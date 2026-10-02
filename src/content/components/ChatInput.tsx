type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};

export function ChatInput({ value, onChange, onSubmit, placeholder = "Ask MUST AI..." }: ChatInputProps) {
  return (
    <div className="must-ai-input">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Message MUST AI"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onSubmit();
          }
        }}
      />

      <button type="button" onClick={onSubmit} aria-label="Send message">
        ➤
      </button>
    </div>
  );
}
