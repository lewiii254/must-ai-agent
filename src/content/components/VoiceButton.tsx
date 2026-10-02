type VoiceButtonProps = {
  onClick: () => void;
  active?: boolean;
};

export function VoiceButton({ onClick, active = false }: VoiceButtonProps) {
  return (
    <button
      type="button"
      className={`must-ai-voice-button ${active ? "active" : ""}`}
      onClick={onClick}
      aria-label={active ? "Voice input active" : "Start voice input"}
    >
      {active ? "🎙️" : "🎧"}
    </button>
  );
}
