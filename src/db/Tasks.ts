import { getDb } from './Database';
import type { Task } from '../types';

interface TaskRow {
  id: string;
  title: string;
  description: string;
  priority: string;
  done: number;
  date: string;
  skill_id: string | null;
  recurring: string | null;
  created_at: string;
  updated_at: string;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority as Task["priority"],
    done: row.done === 1,
    date: row.date,
    skillId: row.skill_id || "",
    subtasks: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDb();
  const rows = await db.select<TaskRow[]>("SELECT * FROM tasks ORDER BY created_at DESC");
  return rows.map(rowToTask);
}

export async function createTask(title: string, skillId?: string): Promise<string> {
  const db = await getDb();
  const id = crypto.randomUUID();
  await db.execute(
    "INSERT INTO tasks (id, title, skill_id) VALUES (?, ?, ?)",
    [id, title, skillId || null]
  );
  return id;
}

export async function updateTask(id: string, fields: Partial<Pick<Task, "title" | "description" | "date" | "skillId" | "priority">>): Promise<void> {
  const db = await getDb();
  const sets: string[] = [];
  const vals: unknown[] = [];

  if (fields.title !== undefined) { sets.push("title = ?"); vals.push(fields.title); }
  if (fields.description !== undefined) { sets.push("description = ?"); vals.push(fields.description); }
  if (fields.date !== undefined) { sets.push("date = ?"); vals.push(fields.date); }
  if (fields.skillId !== undefined) { sets.push("skill_id = ?"); vals.push(fields.skillId || null); }
  if (fields.priority !== undefined) { sets.push("priority = ?"); vals.push(fields.priority); }

  if (sets.length === 0) return;

  sets.push("updated_at = datetime('now')");
  vals.push(id);

  await db.execute(`UPDATE tasks SET ${sets.join(", ")} WHERE id = ?`, vals);
}

export async function toggleTaskDone(id: string, done: boolean): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE tasks SET done = ?, updated_at = datetime('now') WHERE id = ?",
    [done ? 1 : 0, id]
  );
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM tasks WHERE id = ?", [id]);
}

export async function cyclePriority(id: string, currentPriority: string): Promise<string> {
  const cycle: Record<string, string> = { ok: "wait", wait: "must", must: "ok" };
  const next = cycle[currentPriority] || "ok";
  const db = await getDb();
  await db.execute(
    "UPDATE tasks SET priority = ?, updated_at = datetime('now') WHERE id = ?",
    [next, id]
  );
  return next;
}
