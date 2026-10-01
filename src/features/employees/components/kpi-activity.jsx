import { Card } from '@/shared/components/card';

export function KpiActivity({ activity }) {
  const items = activity?.items ?? [];

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-foreground">{activity?.label_ar ?? 'آخر التحركات'}</h3>
      <Card className="p-0">
        {items.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">لا تحركات مسجلة بعد</p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item, index) => (
              <li key={`${item.contract_id}-${item.occurred_at}-${index}`} className="flex flex-col gap-1 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">{item.occurred_at_label}</span>
                </div>
                {item.details && <p className="text-xs text-muted-foreground">{item.details}</p>}
                {item.contract_number && <p className="text-xs text-muted-foreground">{item.contract_number}</p>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
