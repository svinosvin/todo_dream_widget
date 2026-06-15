import { useState } from "react";
import { useAppStore } from "../store/appStore";
import type { Subtask } from "../types";

interface Props {
  taskId: string;
  subtasks: Subtask[];
}

export function SubtaskList({ taskId, subtasks }: Props) {
  const { addSubtask, toggleSubtask, deleteSubtask } = useAppStore();
  const [newTitle, setNewTitle] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    addSubtask(taskId, title);
    setNewTitle("");
  }

  return (
    <div className="flex flex-col gap-1.5">
      {subtasks.map((st) => (
        <div key={st.id} className="flex items-center gap-2 group">
          <button
            onClick={() => toggleSubtask(taskId, st.id)}
            className={`w-3.5 h-3.5 rounded-sm border shrink-0 flex items-center justify-center cursor-pointer transition-colors ${
              st.done ? "border-done bg-done/20 text-done" : "border-border hover:border-text-muted"
            }`}
          >
            {st.done && (
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span className={`text-sm flex-1 ${st.done ? "line-through text-text-muted" : "text-text"}`}>
            {st.title}
          </span>
          <button
            onClick={() => deleteSubtask(taskId, st.id)}
            className="text-text-muted hover:text-priority-must opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
      <form onSubmit={handleAdd} className="flex items-center gap-2 mt-0.5">
        <span className="text-text-muted text-sm leading-none">+</span>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="add subtask..."
          className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted/50"
        />
      </form>
    </div>
  );
}
