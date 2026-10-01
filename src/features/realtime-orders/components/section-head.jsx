import { ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { SECTION_NOTE } from '../lib/realtime-sections';

const SECTION_TONE = {
  authenticated: { title: 'text-success', count: 'bg-success-soft text-success' },
  canceled: { title: 'text-danger', count: 'bg-danger-soft text-danger' },
  returned: { title: 'text-refunded', count: 'bg-refunded-soft text-refunded' },
  incomplete: { title: 'text-warning', count: 'bg-warning-soft text-warning' },
};

/** Header shown while a quick filter is open: back button, section title and its count. */
export function SectionHead({ section, count, onClose }) {
  if (!section) return null;
  const tone = SECTION_TONE[section.id] ?? SECTION_TONE.returned;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3.5 py-2.5">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-bold transition-colors hover:bg-accent"
      >
        <ArrowRight className="size-3.5" />
        الطلبات مباشر
      </button>

      <div className="flex min-w-0 items-center gap-2.5">
        <b className={cn('truncate text-base font-extrabold', tone.title)}>{section.sectionTitle}</b>
        <span className={cn('inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-extrabold tabular-nums', tone.count)}>
          {count ?? 0}
        </span>
      </div>

      <span className="ms-auto hidden shrink-0 text-xs font-bold text-muted-foreground sm:inline">{SECTION_NOTE}</span>
    </div>
  );
}
