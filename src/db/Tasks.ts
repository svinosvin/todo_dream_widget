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
    recurring: (row.recurring as Task["recurring"]) || null,
    subtasks: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function seedDefaultTasks(): Promise<void> {
  const db = await getDb();
  const hasRecurring = await db.select<{ id: string }[]>("SELECT id FROM tasks WHERE recurring IS NOT NULL LIMIT 1");
  if (hasRecurring.length > 0) return;

  const skills = await db.select<{ id: string; name: string }[]>("SELECT id, name FROM skills");
  const sk = (name: string) => skills.find((s) => s.name.toLowerCase() === name)?.id || null;

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const tasks = [
    { title: "Write 3 sentences in English to Claude", skill: "english", recurring: "daily", date: today },
    { title: "Read 1 article or chapter", skill: "typescript", recurring: "daily", date: today },
    { title: "Code: fix or build 1 small thing", skill: "typescript", recurring: "daily", date: today },
    { title: "Write or plan Twitter post", skill: "twitter", recurring: "daily", date: today },
    { title: "Learn: how stack and heap work in memory", skill: "typescript", date: today },
    { title: "Practice: refactor appStore types, remove 'as' casts", skill: "typescript", date: tomorrow },
    { title: "Learn: Big-O basics, O(1) vs O(n) vs O(n²)", skill: "sql", date: tomorrow },
    { title: "Twitter post about widget build progress", skill: "twitter", date: today },
  ];

  for (const t of tasks) {
    await db.execute(
      "INSERT INTO tasks (id, title, date, skill_id, recurring) VALUES (?, ?, ?, ?, ?)",
      [crypto.randomUUID(), t.title, t.date, sk(t.skill), t.recurring || null]
    );
  }
}

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDb();
  const rows = await db.select<TaskRow[]>("SELECT * FROM tasks ORDER BY created_at DESC");
  return rows.map(rowToTask);
}

export async function createTask(title: string, date?: string, skillId?: string): Promise<string> {
  const db = await getDb();
  const id = crypto.randomUUID();
  await db.execute(
    "INSERT INTO tasks (id, title, date, skill_id) VALUES (?, ?, ?, ?)",
    [id, title, date || "", skillId || null]
  );
  return id;
}

export async function updateTask(id: string, fields: Partial<Pick<Task, "title" | "description" | "date" | "skillId" | "priority" | "recurring">>): Promise<void> {
  const db = await getDb();
  const sets: string[] = [];
  const vals: unknown[] = [];

  if (fields.title !== undefined) { sets.push("title = ?"); vals.push(fields.title); }
  if (fields.description !== undefined) { sets.push("description = ?"); vals.push(fields.description); }
  if (fields.date !== undefined) { sets.push("date = ?"); vals.push(fields.date); }
  if (fields.skillId !== undefined) { sets.push("skill_id = ?"); vals.push(fields.skillId || null); }
  if (fields.priority !== undefined) { sets.push("priority = ?"); vals.push(fields.priority); }
  if (fields.recurring !== undefined) { sets.push("recurring = ?"); vals.push(fields.recurring || null); }

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

export async function duplicateTask(sourceId: string, newDate?: string): Promise<string> {
  const db = await getDb();
  const rows = await db.select<TaskRow[]>("SELECT * FROM tasks WHERE id = ?", [sourceId]);
  if (rows.length === 0) throw new Error("Task not found");
  const src = rows[0];
  const id = crypto.randomUUID();
  await db.execute(
    "INSERT INTO tasks (id, title, description, priority, date, skill_id, recurring) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, src.title, src.description, src.priority, newDate || src.date, src.skill_id, newDate ? null : src.recurring]
  );
  return id;
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
