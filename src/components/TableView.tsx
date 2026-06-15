import { useAppStore } from "../store/appStore";

function getWeekDays(offset: number): { label: string; date: string; isToday: boolean }[] {
  const now = new Date();
  const monday = new Date(now);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff + offset * 7);

  const days: { label: string; date: string; isToday: boolean }[] = [];
  const labels = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const todayStr = now.toISOString().split("T")[0];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({ label: labels[i], date: dateStr, isToday: dateStr === todayStr });
  }
  return days;
}

function formatWeekRange(offset: number): string {
  const days = getWeekDays(offset);
  const fmt = (d: string) => {
    const p = d.split("-");
    return `${p[2]}.${p[1]}`;
  };
  return `${fmt(days[0].date)} - ${fmt(days[6].date)}`;
}

const PRIORITY_COLOR: Record<string, string> = {
  must: "bg-priority-must/20 border-priority-must text-priority-must",
  wait: "bg-priority-wait/20 border-priority-wait text-priority-wait",
  ok: "bg-priority-ok/20 border-priority-ok text-priority-ok",
};

export function TableView() {
  const { tasks, weekOffset, setWeekOffset, toggleDone } = useAppStore();
  const days = getWeekDays(weekOffset);

  return (
    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="sketchy-sm px-3 py-1 text-text-muted hover:text-text cursor-pointer"
        >
          &lt;
        </button>
        <span className="text-lg font-hand text-text-muted">{formatWeekRange(weekOffset)}</span>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="sketchy-sm px-3 py-1 text-text-muted hover:text-text cursor-pointer"
        >
          &gt;
        </button>
      </div>

      <div className="sketchy bg-surface overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-7 border-b border-border">
          {days.map((d) => (
            <div
              key={d.date}
              className={`text-center py-2 text-sm font-hand border-r border-border last:border-r-0
                ${d.isToday ? "text-accent" : "text-text-muted"}`}
            >
              {d.label}
              <div className="text-xs">{d.date.split("-")[2]}</div>
            </div>
          ))}
        </div>

        {/* Task cells */}
        <div className="grid grid-cols-7 min-h-[300px]">
          {days.map((d) => {
            const dayTasks = tasks.filter((t) => t.date === d.date);
            return (
              <div
                key={d.date}
                className={`border-r border-border last:border-r-0 p-1 flex flex-col gap-1
                  ${d.isToday ? "bg-accent/5" : ""}`}
              >
                {dayTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => toggleDone(t.id)}
                    className={`text-xs p-1 rounded border cursor-pointer text-left truncate
                      ${t.done ? "opacity-40 line-through" : ""}
                      ${PRIORITY_COLOR[t.priority]}`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
