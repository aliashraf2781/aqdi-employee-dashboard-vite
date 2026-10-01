import { Badge } from '@/shared/components/badge';
import { cn } from '@/shared/lib/cn';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { AD_PIXELS, ANALYTICS_SOURCES } from '@/features/marketing/lib/pixel-inventory';

const ALL_SOURCES = [...AD_PIXELS, ...ANALYTICS_SOURCES];

function PixelCard({ item }) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4', !item.connected && 'opacity-70')}>
      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
        <span className={cn('size-2 rounded-full', item.connected ? 'bg-success' : 'bg-neutral')} />
        {item.name}
      </div>
      <div dir="ltr" className="mt-2 text-start text-xs text-muted-foreground">
        {item.id ? `ID: ${item.id}` : 'غير مربوط'}
      </div>
      {item.events?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.events.map((event) => (
            <Badge key={event}>{event}</Badge>
          ))}
        </div>
      )}
      {item.connected && item.lastEvent && <div className="mt-2 text-xs text-muted-foreground">{item.lastEvent}</div>}
    </div>
  );
}

/** Static inventory of pixels and analytics tools. Demo only: there is no backend for it yet. */
export function PixelInventoryCard() {
  return (
    <SectionCard title="بكسلات الإعلانات ومصادر التحليلات" className="mt-4">
      <p className="mb-3 text-xs text-muted-foreground">هذه القائمة عرض توضيحي — لا يوجد بعد مسار خادم لإدارة البكسلات وربطها.</p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ALL_SOURCES.map((item) => (
          <PixelCard key={item.name} item={item} />
        ))}
      </div>
    </SectionCard>
  );
}
