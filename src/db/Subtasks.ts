import { getDb } from './Database';
import type { Subtask } from '../types';

interface SubtaskRow {
  id: string;
  task_id: string;
  title: string;
  done: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function rowToSubtask(row: SubtaskRow): Subtask {
  return {
    id: row.id,
    title: row.title,
    done: row.done === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getSubtasksByTaskId(taskId: string): Promise<Subtask[]> {
  const db = await getDb();
  const rows = await db.select<SubtaskRow[]>(
    "SELECT * FROM subtasks WHERE task_id = ? ORDER BY sort_order ASC",
    [taskId]
  );
  return rows.map(rowToSubtask);
}

export async function createSubtask(taskId: string, title: string): Promise<string> {
  const db = await getDb();
  const id = crypto.randomUUID();
  const maxOrder = await db.select<[{ max_order: number | null }]>(
    "SELECT MAX(sort_order) as max_order FROM subtasks WHERE task_id = ?",
    [taskId]
  );
  const order = (maxOrder[0]?.max_order ?? -1) + 1;
  await db.execute(
    "INSERT INTO subtasks (id, task_id, title, sort_order) VALUES (?, ?, ?, ?)",
    [id, taskId, title, order]
  );
  return id;
}

export async function toggleSubtask(id: string, done: boolean): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE subtasks SET done = ?, updated_at = datetime('now') WHERE id = ?",
    [done ? 1 : 0, id]
  );
}

export async function deleteSubtask(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM subtasks WHERE id = ?", [id]);
}
