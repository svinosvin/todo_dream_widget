interface Props {
  done: boolean;
  onClick: () => void;
}

export function StatusIcon({ done, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
        done
          ? "border-done bg-done/20 text-done"
          : "border-border bg-transparent hover:border-text-muted"
      }`}
    >
      {done && (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
