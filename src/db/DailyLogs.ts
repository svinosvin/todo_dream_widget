import { getDb } from './Database';

export interface DailyLog {
  id: string;
  date: string;
  tasksCompleted: number;
  pointsEarned: number;
  streak: number;
}

interface DailyLogRow {
  id: string;
  date: string;
  tasks_completed: number;
  points_earned: number;
  streak: number;
}

function rowToLog(row: DailyLogRow): DailyLog {
  return {
    id: row.id,
    date: row.date,
    tasksCompleted: row.tasks_completed,
    pointsEarned: row.points_earned,
    streak: row.streak,
  };
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getTodayLog(): Promise<DailyLog | null> {
  const db = await getDb();
  const rows = await db.select<DailyLogRow[]>(
    "SELECT * FROM daily_logs WHERE date = ?",
    [today()]
  );
  return rows.length > 0 ? rowToLog(rows[0]) : null;
}

export async function recordCompletion(points: number): Promise<void> {
  const db = await getDb();
  const date = today();
  const existing = await db.select<DailyLogRow[]>(
    "SELECT * FROM daily_logs WHERE date = ?",
    [date]
  );

  if (existing.length > 0) {
    await db.execute(
      "UPDATE daily_logs SET tasks_completed = tasks_completed + 1, points_earned = points_earned + ? WHERE date = ?",
      [points, date]
    );
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const prev = await db.select<DailyLogRow[]>(
      "SELECT streak FROM daily_logs WHERE date = ?",
      [yesterdayStr]
    );
    const streak = (prev.length > 0 ? prev[0].streak : 0) + 1;

    await db.execute(
      "INSERT INTO daily_logs (id, date, tasks_completed, points_earned, streak) VALUES (?, ?, 1, ?, ?)",
      [crypto.randomUUID(), date, points, streak]
    );
  }
}
