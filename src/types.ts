export type Priority = "must" | "wait" | "ok";

export type TabId = "table" | "tasks" | "skills" | "lvls";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  done: boolean;
  date: string;
  skillId: string;
  recurring: "daily" | "weekly" | null;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  image: string;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}

export function pointsForLevel(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(10 * Math.pow(level, 1.6));
}

export function getSkillLevel(totalPoints: number): { level: number; current: number; needed: number } {
  let level = 0;
  let accumulated = 0;
  while (true) {
    const next = pointsForLevel(level + 1);
    if (accumulated + next > totalPoints) {
      return { level, current: totalPoints - accumulated, needed: next };
    }
    accumulated += next;
    level++;
  }
}
