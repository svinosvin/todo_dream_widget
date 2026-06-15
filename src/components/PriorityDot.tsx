import type { Priority } from "../types";

const COLORS: Record<Priority, string> = {
  must: "bg-priority-must",
  wait: "bg-priority-wait",
  ok: "bg-priority-ok",
};

const LABELS: Record<Priority, string> = {
  must: "Must have",
  wait: "Can wait",
  ok: "It's ok",
};

interface Props {
  priority: Priority;
  onClick: () => void;
  size?: "sm" | "md";
}

export function PriorityDot({ priority, onClick, size = "md" }: Props) {
  const s = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <button
      onClick={onClick}
      title={LABELS[priority]}
      className={`${s} rounded-sm ${COLORS[priority]} shrink-0 cursor-pointer
        hover:ring-2 hover:ring-white/20 transition-all`}
    />
  );
}
