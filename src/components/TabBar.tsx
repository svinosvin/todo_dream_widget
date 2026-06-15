import { useAppStore } from "../store/appStore";
import type { TabId } from "../types";

const TABS: { id: TabId; label: string }[] = [
  { id: "table", label: "table" },
  { id: "tasks", label: "tasks" },
  { id: "skills", label: "My skills" },
  { id: "lvls", label: "LVLS" },
];

export function TabBar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="flex border-b-2 border-border bg-surface">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-lg font-hand cursor-pointer transition-colors border-r border-border
            ${activeTab === tab.id
              ? "bg-bg text-text border-b-2 border-b-accent"
              : "text-text-muted hover:text-text hover:bg-surface-hover"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
