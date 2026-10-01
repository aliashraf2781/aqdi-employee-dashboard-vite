import { DataTable } from '@/shared/components/data-table';
import { CompetitionBadge, KeywordStatus, RankChip } from '@/features/marketing/components/shared/chips';
import { DASH, formatInt, formatMoney } from '@/features/marketing/lib/format';

function buildColumns(currency) {
  return [
    {
      key: 'keyword',
      header: 'الكلمة / الصفحة',
      cell: (row) => (
        <>
          <div className="font-bold text-foreground">{row.keyword}</div>
          {row.page_path && (
            <div dir="ltr" className="text-start text-xs text-muted-foreground">
              {row.page_path}
            </div>
          )}
        </>
      ),
    },
    { key: 'rank', header: 'الترتيب الحالي', cell: (row) => <RankChip rank={row.current_rank} tone={row.rank_tone} /> },
    { key: 'previous', header: 'السابق', cell: (row) => (row.previous_rank == null ? DASH : row.previous_rank) },
    { key: 'volume', header: 'بحث/شهر', cell: (row) => formatInt(row.search_volume) },
    { key: 'competition', header: 'المنافسة', cell: (row) => <CompetitionBadge competition={row.competition} label={row.competition_label_ar} /> },
    { key: 'status', header: 'الحالة', cell: (row) => <KeywordStatus status={row.status} label={row.status_label_ar} /> },
    { key: 'revenue', header: 'الإيراد', cell: (row) => formatMoney(row.revenue, currency) },
  ];
}

export function KeywordsTable({ items, currency }) {
  return (
    <DataTable
      columns={buildColumns(currency)}
      rows={items}
      getRowKey={(row) => `${row.keyword}-${row.page_path}`}
      emptyMessage="لا توجد كلمات مفتاحية لهذه الفترة."
    />
  );
}
