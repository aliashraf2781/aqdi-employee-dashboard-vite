import { PageSizeSelect } from '@/shared/components/page-size-select';
import { Pagination } from '@/shared/components/pagination';

/** "Showing 1-20 of 130" + rows-per-page + previous/next, shown under a server-paged table. */
export function TableFooter({ pagination, page, perPage, onPageChange, onPerPageChange, unitLabel = 'طلب' }) {
  const total = pagination?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-medium text-muted-foreground">
        عرض <span className="font-bold tabular-nums text-primary">{from}-{to}</span> من{' '}
        <span className="font-bold tabular-nums">{total}</span> {unitLabel}
      </p>
      <div className="flex items-center gap-3">
        <PageSizeSelect value={perPage} onChange={onPerPageChange} />
        <Pagination page={page} lastPage={pagination?.last_page} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
