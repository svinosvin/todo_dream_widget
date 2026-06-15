import { create } from "zustand";
import type { Task, Priority, Skill, TabId } from "../types";

const PRIORITY_CYCLE: Priority[] = ["ok", "wait", "must"];

interface AppState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // Week navigation
  weekOffset: number;
  setWeekOffset: (offset: number) => void;

  // Tasks
  tasks: Task[];
  expandedTaskId: string | null;
  sortBy: "date" | "priority" | "status";
  filterSkillId: string;

  addTask: (title: string) => void;
  deleteTask: (id: string) => void;
  toggleDone: (id: string) => void;
  cyclePriority: (id: string) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, "title" | "description" | "date" | "skillId">>) => void;
  setExpandedTask: (id: string | null) => void;
  setSortBy: (sort: "date" | "priority" | "status") => void;
  setFilterSkillId: (id: string) => void;

  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Skills
  skills: Skill[];
  expandedSkillId: string | null;
  addSkill: (name: string) => void;
  deleteSkill: (id: string) => void;
  updateSkill: (id: string, updates: Partial<Pick<Skill, "name" | "image">>) => void;
  setExpandedSkill: (id: string | null) => void;
  addPointsToSkill: (id: string, points: number) => void;
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

const DEMO_SKILLS: Skill[] = [
  { id: "skill-dev", name: "Development", image: "", totalPoints: 33, createdAt: new Date().toISOString() },
  { id: "skill-read", name: "Reading", image: "", totalPoints: 12, createdAt: new Date().toISOString() },
];

export const useAppStore = create<AppState>((set) => ({
  activeTab: "tasks",
  setActiveTab: (tab) => set({ activeTab: tab }),

  weekOffset: 0,
  setWeekOffset: (offset) => set({ weekOffset: offset }),

  tasks: [
    {
      id: "demo-1",
      title: "Set up Tauri project",
      description: "Install dependencies, configure Tailwind",
      priority: "must" as Priority,
      done: true,
      date: today(),
      skillId: "skill-dev",
      subtasks: [
        { id: "s1", title: "Install Rust", done: true },
        { id: "s2", title: "Fix time crate", done: true },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "demo-2",
      title: "Build task list UI",
      description: "React components with priority system and inline expansion",
      priority: "must" as Priority,
      done: false,
      date: today(),
      skillId: "skill-dev",
      subtasks: [
        { id: "s3", title: "Two-panel layout", done: false },
        { id: "s4", title: "Subtask support", done: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "demo-3",
      title: "Read Tauri docs",
      description: "",
      priority: "wait" as Priority,
      done: false,
      date: "",
      skillId: "skill-read",
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "demo-4",
      title: "Daily check-in system",
      description: "Gamification with points and streaks",
      priority: "ok" as Priority,
      done: false,
      date: "",
      skillId: "",
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  expandedTaskId: null,
  sortBy: "date",
  filterSkillId: "",

  addTask: (title) =>
    set((s) => ({
      tasks: [
        {
          id: genId(),
          title,
          description: "",
          priority: "ok" as Priority,
          done: false,
          date: today(),
          skillId: "",
          subtasks: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...s.tasks,
      ],
    })),

  deleteTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  toggleDone: (id) =>
    set((s) => {
      const task = s.tasks.find((t) => t.id === id);
      if (!task || task.done) {
        return {
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, done: !t.done, updatedAt: new Date().toISOString() } : t
          ),
        };
      }
      const skillId = task.skillId;
      const points = 5 + task.subtasks.length;
      return {
        tasks: s.tasks.map((t) =>
          t.id === id ? { ...t, done: true, updatedAt: new Date().toISOString() } : t
        ),
        skills: skillId
          ? s.skills.map((sk) =>
              sk.id === skillId ? { ...sk, totalPoints: sk.totalPoints + points } : sk
            )
          : s.skills,
      };
    }),

  cyclePriority: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id !== id) return t;
        const idx = PRIORITY_CYCLE.indexOf(t.priority);
        const next = PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length];
        return { ...t, priority: next, updatedAt: new Date().toISOString() };
      }),
    })),

  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    })),

  setExpandedTask: (id) =>
    set((s) => ({ expandedTaskId: s.expandedTaskId === id ? null : id })),

  setSortBy: (sortBy) => set({ sortBy }),

  setFilterSkillId: (id) => set({ filterSkillId: id }),

  addSubtask: (taskId, title) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [...t.subtasks, { id: genId(), title, done: false }],
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    })),

  toggleSubtask: (taskId, subtaskId) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, done: !st.done } : st
              ),
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    })),

  deleteSubtask: (taskId, subtaskId) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.filter((st) => st.id !== subtaskId),
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    })),

  // Skills
  skills: DEMO_SKILLS,
  expandedSkillId: null,

  addSkill: (name) =>
    set((s) => ({
      skills: [
        ...s.skills,
        { id: genId(), name, image: "", totalPoints: 0, createdAt: new Date().toISOString() },
      ],
    })),

  deleteSkill: (id) =>
    set((s) => ({
      skills: s.skills.filter((sk) => sk.id !== id),
      tasks: s.tasks.map((t) => (t.skillId === id ? { ...t, skillId: "" } : t)),
    })),

  updateSkill: (id, updates) =>
    set((s) => ({
      skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...updates } : sk)),
    })),

  setExpandedSkill: (id) =>
    set((s) => ({ expandedSkillId: s.expandedSkillId === id ? null : id })),

  addPointsToSkill: (id, points) =>
    set((s) => ({
      skills: s.skills.map((sk) =>
        sk.id === id ? { ...sk, totalPoints: sk.totalPoints + points } : sk
      ),
    })),
}));
