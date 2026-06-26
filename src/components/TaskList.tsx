import { useAppStore } from "../store/appStore";
import { TaskItem } from "./TaskItem";
import type { Task, Priority } from "../types";

const PRIORITY_ORDER: Record<Priority, number> = { must: 0, wait: 1, ok: 2 };

function sortTasks(tasks: Task[], sortBy: "date" | "priority" | "status"): Task[] {
  return [...tasks].sort((a, b) => {
    if (sortBy === "priority") {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    if (sortBy === "status") {
      if (a.done !== b.done) return a.done ? 1 : -1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function getDateStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
}

export function TaskList() {
  const { tasks, sortBy, filterSkillId, dayOffset } = useAppStore();

  const selectedDate = getDateStr(dayOffset);

  const filtered = filterSkillId
    ? tasks.filter((t) => t.skillId === filterSkillId)
    : tasks;

  const dayTasks = filtered.filter((t) => {
    if (t.date === selectedDate) return true;
    if (t.recurring === "daily") return true;
    if (t.recurring === "weekly" && t.date) {
      return new Date(t.date).getDay() === new Date(selectedDate).getDay();
    }
    return false;
  });

  const undated = filtered.filter((t) => !t.date && !t.recurring);

  const sortedDay = sortTasks(dayTasks, sortBy);
  const sortedUndated = sortTasks(undated, sortBy);

  if (sortedDay.length === 0 && sortedUndated.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
        No tasks for this day.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
      {sortedDay.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}

      {sortedUndated.length > 0 && (
        <>
          {sortedDay.length > 0 && (
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="flex-1 border-t border-border/50" />
              <span className="text-xs text-text-muted">no date</span>
              <div className="flex-1 border-t border-border/50" />
            </div>
          )}
          {sortedUndated.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </>
      )}
    </div>
  );
}
