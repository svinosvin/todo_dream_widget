import { create } from "zustand";
import type { Task, Priority, Skill, TabId } from "../types";
import * as tasksDb from "../db/Tasks";
import * as skillsDb from "../db/Skills";
import * as subtasksDb from "../db/Subtasks";
import * as dailyLogsDb from "../db/DailyLogs";

const PRIORITY_CYCLE: Priority[] = ["ok", "wait", "must"];

interface AppState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  weekOffset: number;
  setWeekOffset: (offset: number) => void;

  tasks: Task[];
  expandedTaskId: string | null;
  sortBy: "date" | "priority" | "status";
  filterSkillId: string;

  skills: Skill[];
  expandedSkillId: string | null;

  dbReady: boolean;

  loadAll: () => Promise<void>;

  addTask: (title: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  cyclePriority: (id: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Pick<Task, "title" | "description" | "date" | "skillId" | "priority">>) => Promise<void>;
  setExpandedTask: (id: string | null) => void;
  setSortBy: (sort: "date" | "priority" | "status") => void;
  setFilterSkillId: (id: string) => void;

  addSubtask: (taskId: string, title: string) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;

  addSkill: (name: string) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  updateSkill: (id: string, updates: Partial<Pick<Skill, "name" | "image">>) => Promise<void>;
  setExpandedSkill: (id: string | null) => void;
}

async function loadTasksWithSubtasks(): Promise<Task[]> {
  const tasks = await tasksDb.getAllTasks();
  for (const task of tasks) {
    task.subtasks = await subtasksDb.getSubtasksByTaskId(task.id);
  }
  return tasks;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: "tasks",
  setActiveTab: (tab) => set({ activeTab: tab }),

  weekOffset: 0,
  setWeekOffset: (offset) => set({ weekOffset: offset }),

  tasks: [],
  expandedTaskId: null,
  sortBy: "date",
  filterSkillId: "",

  skills: [],
  expandedSkillId: null,

  dbReady: false,

  loadAll: async () => {
    const tasks = await loadTasksWithSubtasks();
    const skills = await skillsDb.getAllSkills();
    set({ tasks, skills, dbReady: true });
  },

  addTask: async (title) => {
    await tasksDb.createTask(title);
    const tasks = await loadTasksWithSubtasks();
    set({ tasks });
  },

  deleteTask: async (id) => {
    await tasksDb.deleteTask(id);
    const tasks = await loadTasksWithSubtasks();
    set({ tasks });
  },

  toggleDone: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const newDone = !task.done;
    await tasksDb.toggleTaskDone(id, newDone);

    if (newDone && task.skillId) {
      const points = 5 + task.subtasks.length;
      await skillsDb.addPointsToSkill(task.skillId, points);
      await dailyLogsDb.recordCompletion(points);
      const skills = await skillsDb.getAllSkills();
      set({ skills });
    }

    const tasks = await loadTasksWithSubtasks();
    set({ tasks });
  },

  cyclePriority: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    await tasksDb.cyclePriority(id, task.priority);
    const tasks = await loadTasksWithSubtasks();
    set({ tasks });
  },

  updateTask: async (id, updates) => {
    await tasksDb.updateTask(id, updates);
    const tasks = await loadTasksWithSubtasks();
    set({ tasks });
  },

  setExpandedTask: (id) =>
    set((s) => ({ expandedTaskId: s.expandedTaskId === id ? null : id })),

  setSortBy: (sortBy) => set({ sortBy }),
  setFilterSkillId: (id) => set({ filterSkillId: id }),

  addSubtask: async (taskId, title) => {
    await subtasksDb.createSubtask(taskId, title);
    const tasks = await loadTasksWithSubtasks();
    set({ tasks });
  },

  toggleSubtask: async (taskId, subtaskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    const st = task?.subtasks.find((s) => s.id === subtaskId);
    if (!st) return;
    await subtasksDb.toggleSubtask(subtaskId, !st.done);
    const tasks = await loadTasksWithSubtasks();
    set({ tasks });
  },

  deleteSubtask: async (taskId, subtaskId) => {
    await subtasksDb.deleteSubtask(subtaskId);
    const tasks = await loadTasksWithSubtasks();
    set({ tasks });
  },

  addSkill: async (name) => {
    await skillsDb.createSkill(name);
    const skills = await skillsDb.getAllSkills();
    set({ skills });
  },

  deleteSkill: async (id) => {
    await skillsDb.deleteSkill(id);
    const skills = await skillsDb.getAllSkills();
    const tasks = await loadTasksWithSubtasks();
    set({ skills, tasks });
  },

  updateSkill: async (id, updates) => {
    await skillsDb.updateSkill(id, updates);
    const skills = await skillsDb.getAllSkills();
    set({ skills });
  },

  setExpandedSkill: (id) =>
    set((s) => ({ expandedSkillId: s.expandedSkillId === id ? null : id })),
}));
