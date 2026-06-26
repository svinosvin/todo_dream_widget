import { useAppStore } from "../store/appStore";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { TabId } from "../types";

const TABS: { id: TabId; label: string }[] = [
  { id: "table", label: "table" },
  { id: "tasks", label: "tasks" },
  { id: "skills", label: "skills" },
  { id: "lvls", label: "lvls" },
];

export function TabBar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="flex items-center border-b-2 border-border bg-surface drag-region">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-3 py-2 text-base font-hand cursor-pointer transition-colors border-r border-border
            ${activeTab === tab.id
              ? "bg-bg text-text border-b-2 border-b-accent"
              : "text-text-muted hover:text-text hover:bg-surface-hover"
            }`}
        >
          {tab.label}
        </button>
      ))}
      <div className="flex-1" />
      <button
        onClick={() => void getCurrentWindow().close()}
        className="px-3 py-2 text-text-muted hover:text-priority-must transition-colors cursor-pointer"
        title="Close"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
