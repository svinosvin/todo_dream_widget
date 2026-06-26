import { useAppStore } from "../store/appStore";
import { getSkillLevel } from "../types";

const BAR_COLORS = [
  "#4caf50",
  "#5b8def",
  "#e8a830",
  "#e8453c",
  "#a855f7",
  "#2dd4bf",
];

export function LevelsView() {
  const { skills, setActiveTab } = useAppStore();

  if (skills.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-muted">
        <span className="text-sm">No skills yet.</span>
        <button
          onClick={() => setActiveTab("skills")}
          className="sketchy-sm bg-accent text-white px-4 py-1.5 text-base font-hand
            hover:bg-accent/80 transition-colors cursor-pointer"
        >
          create skill
        </button>
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
                {skill.image && <span className="mr-1">{skill.image}</span>}
                {skill.name}
              </div>

              <div className="w-full flex justify-center gap-4" style={{ height: 120 }}>
                <div className="flex flex-col items-center w-12">
                  <span className="text-xs text-text-muted mb-1">lvl {level}</span>
                  <div className="flex-1 w-full flex flex-col justify-end bg-black/5 rounded">
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

                <div className="flex flex-col items-center w-12">
                  <span className="text-xs text-text-muted mb-1">next</span>
                  <div className="flex-1 w-full flex flex-col justify-end bg-black/5 rounded">
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${Math.max(pct, 3)}%`,
                        backgroundColor: color,
                        opacity: 0.5,
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

        {skills.length < 4 &&
          Array.from({ length: 4 - skills.length }).map((_, i) => (
            <button
              key={`empty-${i}`}
              onClick={() => setActiveTab("skills")}
              className="sketchy bg-surface/50 p-4 flex items-center justify-center min-h-[200px]
                border-dashed text-text-muted text-base font-hand cursor-pointer
                hover:bg-surface-hover hover:text-text transition-colors"
            >
              + add skill
            </button>
          ))}
      </div>
    </div>
  );
}
