import { useAppStore } from "../store/appStore";
import { getSkillLevel } from "../types";

const BAR_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#2dd4bf",
];

export function LevelsView() {
  const { skills } = useAppStore();

  if (skills.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
        No skills yet. Create some in "My skills" tab.
      </div>
    );
  }

  const maxPoints = Math.max(...skills.map((s) => s.totalPoints), 1);

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="grid grid-cols-2 gap-3">
        {skills.map((skill, i) => {
          const { level, current, needed } = getSkillLevel(skill.totalPoints);
          const pct = needed > 0 ? (current / needed) * 100 : 0;
          const color = BAR_COLORS[i % BAR_COLORS.length];
          const heightPct = Math.max((skill.totalPoints / maxPoints) * 100, 10);

          return (
            <div key={skill.id} className="sketchy bg-surface p-4 flex flex-col items-center gap-3">
              <div className="text-lg font-hand truncate w-full text-center">
                {skill.name}
              </div>

              <div className="w-full flex justify-center gap-4" style={{ height: 140 }}>
                {/* Total level bar */}
                <div className="flex flex-col items-center w-14">
                  <span className="text-xs text-text-muted mb-1">lvl {level}</span>
                  <div className="flex-1 w-full flex flex-col justify-end bg-bg/30 rounded">
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: color,
                        minHeight: 8,
                      }}
                    />
                  </div>
                </div>

                {/* Progress to next level bar */}
                <div className="flex flex-col items-center w-14">
                  <span className="text-xs text-text-muted mb-1">next</span>
                  <div className="flex-1 w-full flex flex-col justify-end bg-bg/30 rounded">
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${Math.max(pct, 3)}%`,
                        backgroundColor: color,
                        opacity: 0.4,
                        minHeight: 4,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-sm text-text-muted text-center">
                {skill.totalPoints} pts &middot; {needed - current} to lvl {level + 1}
              </div>
            </div>
          );
        })}

        {/* Empty slots */}
        {skills.length < 4 &&
          Array.from({ length: 4 - skills.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="sketchy bg-surface/30 p-4 flex items-center justify-center min-h-[240px]
                border-dashed text-text-muted text-sm cursor-default"
            >
              + add skill
            </div>
          ))}
      </div>
    </div>
  );
}
