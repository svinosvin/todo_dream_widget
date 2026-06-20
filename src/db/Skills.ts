import { getDb } from './Database';
import type { Skill } from '../types';

interface SkillRow {
  id: string;
  name: string;
  image: string;
  total_points: number;
  created_at: string;
  updated_at: string;
}

function rowToSkill(row: SkillRow): Skill {
  return {
    id: row.id,
    name: row.name,
    image: row.image,
    totalPoints: row.total_points,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllSkills(): Promise<Skill[]> {
  const db = await getDb();
  const rows = await db.select<SkillRow[]>("SELECT * FROM skills ORDER BY created_at ASC");
  return rows.map(rowToSkill);
}

export async function createSkill(name: string): Promise<string> {
  const db = await getDb();
  const id = crypto.randomUUID();
  await db.execute(
    "INSERT INTO skills (id, name) VALUES (?, ?)",
    [id, name]
  );
  return id;
}

export async function updateSkill(id: string, fields: Partial<Pick<Skill, "name" | "image">>): Promise<void> {
  const db = await getDb();
  const sets: string[] = [];
  const vals: unknown[] = [];

  if (fields.name !== undefined) { sets.push("name = ?"); vals.push(fields.name); }
  if (fields.image !== undefined) { sets.push("image = ?"); vals.push(fields.image); }

  if (sets.length === 0) return;

  sets.push("updated_at = datetime('now')");
  vals.push(id);

  await db.execute(`UPDATE skills SET ${sets.join(", ")} WHERE id = ?`, vals);
}

export async function deleteSkill(id: string): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM skills WHERE id = ?", [id]);
}

export async function addPointsToSkill(id: string, points: number): Promise<void> {
  const db = await getDb();
  await db.execute(
    "UPDATE skills SET total_points = total_points + ?, updated_at = datetime('now') WHERE id = ?",
    [points, id]
  );
}
