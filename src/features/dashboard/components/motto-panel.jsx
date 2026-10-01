import logo from '@/assets/dashboard/logo.svg';
import { DASHBOARD_MOTTO } from '@/features/dashboard/lib/dashboard-content';

export function MottoPanel() {
  const { brandLabel, title, body, verse, footnote } = DASHBOARD_MOTTO;

  return (
    <div className="flex min-w-0 flex-col justify-center">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent">
          <img src={logo} alt="" className="h-5 w-auto object-contain" aria-hidden />
        </span>
        <span className="text-xs font-semibold tracking-wide text-accent-foreground">{brandLabel}</span>
      </div>

      <h1 className="mb-5 max-w-xl text-3xl font-extrabold leading-relaxed text-foreground">{title}</h1>

      <div className="relative max-w-xl ps-5">
        <span aria-hidden className="absolute inset-y-1 start-0 w-1 rounded-full bg-gradient-to-b from-primary to-success" />
        <p className="text-base leading-8 text-muted-foreground">{body}</p>
        {verse && <p className="mt-4 text-base font-semibold leading-8 text-accent-foreground">{verse}</p>}
        {footnote && <p className="mt-2 text-sm leading-7 text-muted-foreground">{footnote}</p>}
      </div>
    </div>
  );
}
