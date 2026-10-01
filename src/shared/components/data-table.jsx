import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/page-loader';
import { cn } from '@/shared/lib/cn';

/**
 * Presentational table driven by a `columns` array:
 *   { key: 'name', header: 'الاسم', cell: (row) => row.name, className? }
 * It owns loading and empty states so list pages stay short.
 */
export function DataTable({ columns, rows, isLoading, getRowKey = (row) => row.id, emptyMessage }) {
  if (isLoading) return <PageLoader />;
  if (!rows?.length) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-start text-sm">
        <thead className="bg-surface-muted text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cn('px-4 py-3 text-start font-medium', column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="hover:bg-accent/50">
              {columns.map((column) => (
                <td key={column.key} className={cn('px-4 py-3', column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
