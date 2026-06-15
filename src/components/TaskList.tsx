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

export function TaskList() {
  const { tasks, sortBy, filterSkillId } = useAppStore();

  const filtered = filterSkillId
    ? tasks.filter((t) => t.skillId === filterSkillId)
    : tasks;
  const sorted = sortTasks(filtered, sortBy);

  if (sorted.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
        {filterSkillId ? "No tasks for this skill." : "No tasks yet. Create one above."}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
      {sorted.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
