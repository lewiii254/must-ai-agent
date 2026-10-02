type SuggestionButtonProps = {
  label: string;
  onClick: () => void;
};

export function SuggestionButton({ label, onClick }: SuggestionButtonProps) {
  return (
    <button type="button" className="must-ai-suggestion" onClick={onClick}>
      {label}
    </button>
  );
}
