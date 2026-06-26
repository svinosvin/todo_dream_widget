import { useState } from "react";
import { useAppStore } from "../store/appStore";
import { PriorityDot } from "./PriorityDot";
import { StatusIcon } from "./StatusIcon";
import { TrashIcon } from "./TrashIcon";
import { SubtaskList } from "./SubtaskList";
import type { Task } from "../types";
import { getDateStr } from "./Header";
interface Props {
  task: Task;
}

export function TaskItem({ task }: Props) {
  const {
    toggleDone, cyclePriority, deleteTask, updateTask, duplicateTask,
    expandedTaskId, setExpandedTask, skills,
  } = useAppStore();
  const isExpanded = expandedTaskId === task.id;
  const [editDesc, setEditDesc] = useState(task.description);
  const [showSkillPicker, setShowSkillPicker] = useState(false);
  const skillName = skills.find((s) => s.id === task.skillId)?.name;
  const skill = skills.find((s) => s.id === task.skillId);

  function handleDescBlur() {
    updateTask(task.id, { description: editDesc });
  }


  const dayOffset = useAppStore((state)=> state.dayOffset);
  const subtaskCount = task.subtasks.length;
  const subtaskDone = task.subtasks.filter((s) => s.done).length;

  return (
    <div
      className={`task-item sketchy transition-all ${
        task.done ? "opacity-50" : ""
      } ${isExpanded ? "bg-surface" : "hover:bg-surface-hover"}`}
    >
      <div className="flex">
        {/* Left panel: controls */}
        <div className="flex flex-col items-center gap-2 px-2.5 py-2.5 border-r border-border min-w-[48px]">
          <PriorityDot priority={task.priority} onClick={() => cyclePriority(task.id)} />
          <StatusIcon done={task.done} onClick={() => toggleDone(task.id)} />
          <TrashIcon onClick={() => deleteTask(task.id)} />
        </div>

        {/* Right panel: content */}
        <div className="flex-1 min-w-0">
          <div
            className="flex items-center gap-1.5 px-3 py-2.5 cursor-pointer"
            onClick={() => setExpandedTask(task.id)}
          >
            <span className={`flex-1 truncate text-lg ${task.done ? "line-through text-text-muted" : ""}`}>
              {task.title}
            </span>

            {task.recurring && (
              <span className="text-xs text-accent/60 px-1" title={`Repeats ${task.recurring}`}>
                {task.recurring === "daily" ? "d" : "w"}
              </span>
            )}

            {skillName && (
              <span className="text-xs text-accent/70 sketchy-sm px-1.5 py-0.5 shrink-0">
                {skill?.image || ""} {skillName}
              </span>
            )}

            {subtaskCount > 0 && (
              <span className="text-sm text-text-muted shrink-0">
                {subtaskDone}/{subtaskCount}
              </span>
            )}

            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              className={`text-text-muted shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            >
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {isExpanded && (
            <div className="px-3 pb-3 border-t border-border">
              {/* Controls row */}
              <div className="flex items-center gap-2 py-2 flex-wrap">
                {/* Skill picker button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSkillPicker(true); }}
                  className="sketchy-sm bg-bg px-2 py-1 text-sm cursor-pointer hover:bg-surface-hover transition-colors flex items-center gap-1"
                >
                  {skill ? (
                    <>{skill.image || skill.name[0]?.toUpperCase()} {skill.name}</>
                  ) : (
                    <span className="text-text-muted">skill</span>
                  )}
                </button>

                {/* Recurring toggle */}
                <select
                  value={task.recurring || ""}
                  onChange={(e) => {
                    e.stopPropagation();
                    const val = e.target.value as "daily" | "weekly" | "";
                    updateTask(task.id, { recurring: val || null });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-bg border border-border rounded px-1.5 py-1 text-sm text-text-muted outline-none cursor-pointer"
                >
                  <option value="">once</option>
                  <option value="daily">daily</option>
                  <option value="weekly">weekly</option>
                </select>

                {/* Date picker */}
                <input
                  type="date"
                  value={task.date}
                  onChange={(e) => updateTask(task.id, { date: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-bg border border-border rounded px-1.5 py-1 text-sm text-text-muted outline-none cursor-pointer"
                />

                <div className="flex items-center gap-1 ml-auto">
                  {/* Copy to 7 days like daily next week */}
                  <button
                    onClick={(e) => { e.stopPropagation(); duplicateTask(task.id,getDateStr(dayOffset) , 7); }} 
                    className="text-text-muted hover:text-accent transition-colors cursor-pointer text-xs sketchy-sm px-1.5 py-1"
                    title="Seven days copy"
                  >
                    +7d
                  </button>
                 <button  
                    onClick={(e) => { e.stopPropagation(); duplicateTask(task.id,getDateStr(dayOffset), 3); }} 
                    className="text-text-muted hover:text-accent transition-colors cursor-pointer text-xs sketchy-sm px-1.5 py-1"
                    title="Three days copy"
                  >
                    +3d
                  </button>
                   <button  
                    onClick={(e) => { e.stopPropagation(); duplicateTask(task.id,getDateStr(dayOffset), 1); }} 
                    className="text-text-muted hover:text-accent transition-colors cursor-pointer text-xs sketchy-sm px-1.5 py-1"
                    title="One day copy"
                  >
                    +1d
                  </button>
                  {/* Duplicate */}
                  <button
                    onClick={(e) => { e.stopPropagation(); duplicateTask(task.id); }}
                    className="text-text-muted hover:text-accent transition-colors cursor-pointer"
                    title="Duplicate task"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M10 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v6a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description */}
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                onBlur={handleDescBlur}
                placeholder="Description..."
                className="w-full sketchy-alt bg-bg px-3 py-2 text-text text-base
                  resize-none outline-none focus:border-accent min-h-[50px] mb-2"
              />

              {/* Subtasks */}
              <div className="sketchy-sm bg-bg px-3 py-2">
                <div className="text-sm text-text-muted mb-1.5">Subtasks</div>
                <SubtaskList taskId={task.id} subtasks={task.subtasks} />
              </div>
         
            </div>
            
          )}
        </div>
      </div>

      {/* Skill picker modal */}
      {showSkillPicker && (
        <div
          className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); setShowSkillPicker(false); }}
        >
          <div
            className="bg-surface sketchy p-4 w-72 max-h-80 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-lg font-hand mb-3">Choose skill</div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => { updateTask(task.id, { skillId: "" }); setShowSkillPicker(false); }}
                className={`sketchy-sm px-3 py-2 text-left cursor-pointer transition-colors text-base
                  ${!task.skillId ? "bg-accent/10 border-accent" : "bg-bg hover:bg-surface-hover"}`}
              >
                none
              </button>
              {skills.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { updateTask(task.id, { skillId: s.id }); setShowSkillPicker(false); }}
                  className={`sketchy-sm px-3 py-2 text-left cursor-pointer flex items-center gap-2 transition-colors
                    ${task.skillId === s.id ? "bg-accent/10 border-accent" : "bg-bg hover:bg-surface-hover"}`}
                >
                  <span className="w-8 h-8 sketchy-sm bg-surface flex items-center justify-center text-lg shrink-0">
                    {s.image || s.name[0]?.toUpperCase()}
                  </span>
                  <span className="text-base">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
