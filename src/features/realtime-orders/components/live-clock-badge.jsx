import { useEffect, useState } from 'react';

const WEEKDAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const TICK_MS = 1000;

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);
  return now;
}

/** Pulsing "synced" pill with the current time, and the weekday/date line under the title. */
export function LiveClockBadge() {
  const now = useNow();
  const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <div className="space-y-1.5">
      <span
        className="inline-flex items-center gap-1 rounded-full border border-success bg-success-soft px-2 py-0.5 text-xs font-extrabold text-success"
        title="آخر مزامنة تلقائية"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-50" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
        مُزامن
        <span className="tabular-nums font-bold">{time}</span>
      </span>
      <p className="text-xs font-bold tabular-nums text-muted-foreground">
        {WEEKDAYS_AR[now.getDay()]} {date} - {time}
      </p>
    </div>
  );
}
