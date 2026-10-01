import { DataTable } from '@/shared/components/data-table';
import { cn } from '@/shared/lib/cn';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { TRACKED_EVENTS } from '@/features/marketing/lib/pixel-inventory';

const COLUMNS = [
  { key: 'event', header: 'الحدث', cell: (row) => <code dir="ltr">{row.event}</code> },
  { key: 'meaning', header: 'المعنى', cell: (row) => row.meaning },
  { key: 'value', header: 'القيمة المُسنَدة', cell: (row) => <span className={cn(row.highlight && 'font-bold text-success')}>{row.value}</span> },
  { key: 'platforms', header: 'المنصات', cell: (row) => row.platforms },
];

export function TrackedEventsCard() {
  return (
    <SectionCard title="الأحداث المتتبَّعة وقيمتها" className="mt-4">
      <DataTable columns={COLUMNS} rows={TRACKED_EVENTS} getRowKey={(row) => row.event} />
    </SectionCard>
  );
}
