import { useState } from "react";
import { useAppStore } from "../store/appStore";

export function Header() {
  const { addTask, sortBy, setSortBy, tasks, skills, filterSkillId, setFilterSkillId } = useAppStore();
  const [newTitle, setNewTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    addTask(title);
    setNewTitle("");
  }

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="flex border-b border-border bg-surface">
      {/* Left header */}
      <div className="flex items-center justify-center px-3 py-2 border-r border-border min-w-[56px]">
        <span className="text-lg text-text-muted font-hand">{done}/{total}</span>
      </div>

      {/* Right header */}
      <div className="flex-1 flex items-center gap-2 px-3 py-2">
        <select
          value={filterSkillId}
          onChange={(e) => setFilterSkillId(e.target.value)}
          className="sketchy-sm bg-bg px-2 py-1 text-sm text-text-muted outline-none cursor-pointer"
        >
          <option value="">all skills</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "priority" | "status")}
          className="sketchy-sm bg-bg px-2 py-1 text-sm text-text-muted outline-none cursor-pointer"
        >
          <option value="date">by date</option>
          <option value="priority">by priority</option>
          <option value="status">by status</option>
        </select>

        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="new task..."
            className="flex-1 sketchy-sm bg-bg px-3 py-1 text-text
              outline-none focus:border-accent placeholder:text-text-muted"
          />
          <button
            type="submit"
            className="sketchy-sm bg-accent text-white px-4 py-1 text-lg font-hand
              hover:bg-accent/80 transition-colors cursor-pointer"
          >
            create
          </button>
        </form>
      </div>
    </div>
  );
}
