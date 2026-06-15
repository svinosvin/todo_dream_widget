import { useState } from "react";
import { useAppStore } from "../store/appStore";
import { getSkillLevel } from "../types";

export function SkillsView() {
  const { skills, expandedSkillId, addSkill, deleteSkill, updateSkill, setExpandedSkill } =
    useAppStore();
  const [newName, setNewName] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    addSkill(name);
    setNewName("");
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <form onSubmit={handleAdd} className="flex-1 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="new skill..."
            className="flex-1 sketchy-sm bg-bg px-3 py-1 text-text outline-none
              focus:border-accent placeholder:text-text-muted"
          />
          <button
            type="submit"
            className="sketchy-sm bg-accent text-white px-3 py-1 text-lg font-hand
              hover:bg-accent/80 transition-colors cursor-pointer"
          >
            +
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-2">
        {skills.map((skill) => {
          const { level, current, needed } = getSkillLevel(skill.totalPoints);
          const isExpanded = expandedSkillId === skill.id;
          const pct = needed > 0 ? Math.round((current / needed) * 100) : 0;

          return (
            <div key={skill.id} className="sketchy bg-surface">
              <div
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                onClick={() => setExpandedSkill(skill.id)}
              >
                {/* Skill avatar */}
                <div className="w-10 h-10 sketchy-sm bg-bg flex items-center justify-center shrink-0 text-xl">
                  {skill.image || skill.name[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-lg truncate">{skill.name}</div>
                  <div className="text-sm text-text-muted">
                    lvl {level} &middot; {skill.totalPoints} pts
                  </div>
                </div>

                {/* Progress mini bar */}
                <div className="w-20 h-2 bg-bg rounded-full overflow-hidden shrink-0">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <svg
                  width="16" height="16" viewBox="0 0 14 14" fill="none"
                  className={`text-text-muted shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 border-t border-border">
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1">
                      <div className="text-sm text-text-muted mb-1">
                        Total: {skill.totalPoints} pts
                      </div>
                      <div className="text-sm text-text-muted mb-2">
                        To next lvl {needed - current} remain
                      </div>

                      {/* Full progress bar */}
                      <div className="w-full h-3 bg-bg rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 sketchy-sm bg-bg px-2 py-1 text-sm text-text outline-none focus:border-accent"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSkill(skill.id);
                      }}
                      className="text-text-muted hover:text-priority-must transition-colors cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {skills.length === 0 && (
          <div className="text-center text-text-muted text-sm py-8">
            No skills yet. Create one above.
          </div>
        )}
      </div>
    </div>
  );
}
