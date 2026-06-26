import { useState } from "react";
import { useAppStore } from "../store/appStore";

export function getDateStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

function formatDay(offset: number): string {
  if (offset === 0) return "Today";
  if (offset === -1) return "Yesterday";
  if (offset === 1) return "Tomorrow";
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const weekday = d.toLocaleDateString("en", { weekday: "short" });
  const num = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${weekday}, ${num}.${month}`;
}

export function Header() {
  const {
    addTask, sortBy, setSortBy, tasks, skills,
    filterSkillId, setFilterSkillId,
    dayOffset, setDayOffset,
  } = useAppStore();
  const [newTitle, setNewTitle] = useState("");

  const selectedDate = getDateStr(dayOffset);
  const dayTasks = tasks.filter((t) => {
    if (t.date === selectedDate) return true;
    if (t.recurring === "daily") return true;
    if (t.recurring === "weekly" && t.date) {
      return new Date(t.date).getDay() === new Date(selectedDate).getDay();
    }
    return false;
  });
  const done = dayTasks.filter((t) => t.done).length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    addTask(title, selectedDate);
    setNewTitle("");
  }

  return (
    <div className="border-b border-border bg-surface">
      {/* Day navigator */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border/50">
        <button
          onClick={() => setDayOffset(dayOffset - 1)}
          className="px-2 py-0.5 text-text-muted hover:text-text cursor-pointer text-lg"
        >
          &lt;
        </button>
        <button
          onClick={() => setDayOffset(0)}
          className={`flex-1 text-center font-hand cursor-pointer text-lg
            ${dayOffset === 0 ? "text-accent" : "text-text"}`}
        >
          {formatDay(dayOffset)}
        </button>
        <button
          onClick={() => setDayOffset(dayOffset + 1)}
          className="px-2 py-0.5 text-text-muted hover:text-text cursor-pointer text-lg"
        >
          &gt;
        </button>

        <span className="text-sm text-text-muted px-2">{done}/{dayTasks.length}</span>

        <select
          value={filterSkillId}
          onChange={(e) => setFilterSkillId(e.target.value)}
          className="bg-bg border border-border rounded px-1.5 py-0.5 text-xs text-text-muted outline-none cursor-pointer"
        >
          <option value="">all</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "priority" | "status")}
          className="bg-bg border border-border rounded px-1.5 py-0.5 text-xs text-text-muted outline-none cursor-pointer"
        >
          <option value="date">date</option>
          <option value="priority">prio</option>
          <option value="status">status</option>
        </select>
      </div>

      {/* Create task */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-1.5">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="new task..."
          className="flex-1 sketchy-sm bg-bg px-3 py-1 text-text
            outline-none focus:border-accent placeholder:text-text-muted"
        />
        <button
          type="submit"
          className="sketchy-sm bg-accent text-white px-3 py-1 text-lg font-hand
            hover:bg-accent/80 transition-colors cursor-pointer"
        >
          +
        </button>
      </form>
    </div>
  );
}
