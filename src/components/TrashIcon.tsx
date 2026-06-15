interface Props {
  onClick: () => void;
}

export function TrashIcon({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="text-text-muted hover:text-priority-must transition-colors cursor-pointer"
      title="Delete"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2.5 3.5h9M5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M3.5 3.5v8a1 1 0 001 1h5a1 1 0 001-1v-8"
          stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
