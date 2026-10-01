import { PublishStatusBadge } from '@/features/marketing/components/shared/chips';
import { SectionCard } from '@/features/marketing/components/shared/section-card';

/** Articles still being prepared (drafts and scheduled ones). */
export function EditorialQueue({ items }) {
  if (items.length === 0) return null;

  return (
    <SectionCard title="التقويم التحريري — قيد الإعداد" className="mt-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-border bg-surface p-3">
            <div className="text-xs text-muted-foreground">{item.scheduled_at || 'غير مجدول'}</div>
            <div className="mt-1 text-sm font-bold text-foreground">{item.title}</div>
            <div className="mt-2 flex items-center gap-2">
              <PublishStatusBadge status={item.status_label_ar || item.status} />
              {item.category_label_ar && <span className="text-xs text-muted-foreground">{item.category_label_ar}</span>}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
