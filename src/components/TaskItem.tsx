import { useState } from "react";
import { useAppStore } from "../store/appStore";
import { PriorityDot } from "./PriorityDot";
import { StatusIcon } from "./StatusIcon";
import { TrashIcon } from "./TrashIcon";
import { SubtaskList } from "./SubtaskList";
import type { Task } from "../types";

interface Props {
  task: Task;
}

export function TaskItem({ task }: Props) {
  const { toggleDone, cyclePriority, deleteTask, updateTask, expandedTaskId, setExpandedTask, skills } =
    useAppStore();
  const isExpanded = expandedTaskId === task.id;
  const [editDesc, setEditDesc] = useState(task.description);
  const skillName = skills.find((s) => s.id === task.skillId)?.name;

  function handleDescBlur() {
    updateTask(task.id, { description: editDesc });
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" });
  }

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
        <div className="flex flex-col items-center gap-2 px-2.5 py-2.5 border-r border-border min-w-[56px]">
          <PriorityDot priority={task.priority} onClick={() => cyclePriority(task.id)} />
          <StatusIcon done={task.done} onClick={() => toggleDone(task.id)} />
          <TrashIcon onClick={() => deleteTask(task.id)} />
        </div>

        {/* Right panel: content */}
        <div className="flex-1 min-w-0">
          <div
            className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
            onClick={() => setExpandedTask(task.id)}
          >
            {task.date && (
              <span className="text-sm text-text-muted sketchy-sm bg-bg px-2 py-0.5 shrink-0">
                {formatDate(task.date)}
              </span>
            )}

            <span className={`flex-1 truncate text-lg ${task.done ? "line-through text-text-muted" : ""}`}>
              {task.title}
            </span>

            {skillName && (
              <span className="text-xs text-accent/70 sketchy-sm px-1.5 py-0.5 shrink-0">
                {skillName}
              </span>
            )}

            {subtaskCount > 0 && (
              <span className="text-sm text-text-muted shrink-0">
                {subtaskDone}/{subtaskCount}
              </span>
            )}

            <svg
              width="16" height="16" viewBox="0 0 14 14" fill="none"
              className={`text-text-muted shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            >
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {isExpanded && (
            <div className="px-3 pb-3 border-t border-border">
              {/* Expanded controls row */}
              <div className="flex items-center gap-3 py-2">
                <PriorityDot priority={task.priority} onClick={() => cyclePriority(task.id)} size="sm" />
                <StatusIcon done={task.done} onClick={() => toggleDone(task.id)} />
                <TrashIcon onClick={() => deleteTask(task.id)} />

                <select
                  value={task.skillId}
                  onChange={(e) => { e.stopPropagation(); updateTask(task.id, { skillId: e.target.value }); }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-bg border border-border rounded px-1.5 py-0.5 text-sm text-text-muted
                    outline-none focus:border-accent cursor-pointer"
                >
                  <option value="">no skill</option>
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5 ml-auto">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-muted">
                    <rect x="1.5" y="2.5" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M1.5 5.5h11" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M4.5 1v3M9.5 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <input
                    type="date"
                    value={task.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => updateTask(task.id, { date: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-bg border border-border rounded px-1.5 py-0.5 text-sm text-text-muted
                      outline-none focus:border-accent cursor-pointer"
                  />
                </div>
              </div>

              {/* Description */}
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                onBlur={handleDescBlur}
                placeholder="Description..."
                className="w-full sketchy-alt bg-bg px-3 py-2 text-text text-base
                  resize-none outline-none focus:border-accent min-h-[60px] mb-2"
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
    </div>
  );
}
