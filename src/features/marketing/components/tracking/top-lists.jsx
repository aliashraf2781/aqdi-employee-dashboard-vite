import { ColorChip, KeywordStatus, RankChip } from '@/features/marketing/components/shared/chips';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { formatInt } from '@/features/marketing/lib/format';

function TopList({ title, rows, emptyText, renderRow }) {
  const hasRows = Array.isArray(rows) && rows.length > 0;

  return (
    <SectionCard title={title}>
      {hasRows ? (
        <ul className="flex flex-col divide-y divide-border">
          {rows.map((row, index) => (
            <li key={index} className="flex items-center justify-between gap-3 py-2 text-sm">
              {renderRow(row)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      )}
    </SectionCard>
  );
}

/** The three "top" widgets of the overview: campaigns by orders, most visited pages, best Google keywords. */
export function OverviewTopLists({ data }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <TopList
        title="أكثر الحملات تحقيقًا للطلبات"
        rows={data?.top_campaigns}
        emptyText="لا توجد حملات بها طلبات."
        renderRow={(item) => (
          <>
            <span className="flex items-center gap-2">
              {item.campaign} <ColorChip label={item.label_ar} color={item.color} />
            </span>
            <b>{formatInt(item.orders)} طلب</b>
          </>
        )}
      />

      <TopList
        title="أكثر الصفحات والمقالات زيارة"
        rows={data?.top_pages}
        emptyText="اربط Search Console لعرض الصفحات الأكثر زيارة."
        renderRow={(item) => (
          <>
            <span className="min-w-0">
              {item.title}
              {item.type_label_ar && <span className="ms-2 text-xs text-muted-foreground">{item.type_label_ar}</span>}
              {item.path && (
                <span dir="ltr" className="block truncate text-start text-xs text-muted-foreground">
                  {item.path}
                </span>
              )}
            </span>
            <b>{formatInt(item.visits)}</b>
          </>
        )}
      />

      <TopList
        title="أهم الكلمات في Google"
        rows={data?.top_keywords}
        emptyText="اربط Search Console لعرض ترتيب الكلمات."
        renderRow={(item) => (
          <>
            <span className="flex items-center gap-2">
              {item.rank != null && <RankChip rank={item.rank} tone="good" />}
              {item.keyword}
            </span>
            <KeywordStatus status={item.status} label={item.status_label_ar} />
          </>
        )}
      />
    </div>
  );
}
