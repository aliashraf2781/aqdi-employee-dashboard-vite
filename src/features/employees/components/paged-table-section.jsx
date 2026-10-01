import { Badge } from '@/shared/components/badge';
import { DataTable } from '@/shared/components/data-table';
import { Pagination } from '@/shared/components/pagination';
import { useClientPagination } from '@/features/employees/hooks/use-client-pagination';

/** Titled table whose rows are already loaded; pages them on the client. */
export function PagedTableSection({ title, rows, columns, emptyMessage, getRowKey }) {
  const { pageItems, page, lastPage, total, setPage } = useClientPagination(rows);

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        {total > 0 && <Badge tone="success">{total}</Badge>}
      </div>
      <DataTable columns={columns} rows={pageItems} emptyMessage={emptyMessage} getRowKey={getRowKey} />
      <Pagination page={page} lastPage={lastPage} onPageChange={setPage} />
    </section>
  );
}
