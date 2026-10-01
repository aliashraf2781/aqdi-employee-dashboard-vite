import { useMemo, useState } from 'react';
import { compareValues } from '@/shared/lib/compare-values';
import { cn } from '@/shared/lib/cn';
import { PageLoader } from '@/shared/components/page-loader';
import { EmptyState } from '@/shared/components/empty-state';
import { SortableHeader } from './sortable-header';
import { DEFAULT_TABLE_DENSITY, DENSITY_CELL_CLASS, DENSITY_TEXT_CLASS } from './density';

const STICKY_CLASS = { start: 'sticky start-0 z-10', end: 'sticky end-0 z-10' };

function resolveStickySide(sticky) {
  if (sticky === 'end') return 'end';
  return sticky ? 'start' : null;
}

/**
 * Table with the extras the orders screens need: column visibility, density,
 * sticky first/last columns, optional client-side sorting and row highlight.
 *
 * Column shape: { id, label, cell(row), hideable?, sticky?: 'start'|'end', stopRowClick?,
 *                 sortable?, getSortValue?(row), defaultSortDir?, header?(), headerClassName?, cellClassName? }
 */
export function ControllableTable({
  columns,
  rows,
  isLoading = false,
  density = DEFAULT_TABLE_DENSITY,
  isColumnVisible = () => true,
  getRowKey = (row, index) => row?.id ?? index,
  onRowClick,
  getRowHighlight,
  emptyMessage,
  defaultSort,
}) {
  const [sort, setSort] = useState({ id: defaultSort?.id ?? null, direction: defaultSort?.direction ?? 'asc' });
  const visibleColumns = columns.filter(isColumnVisible);

  const sortedRows = useMemo(() => {
    const column = columns.find((item) => item.id === sort.id);
    if (!column?.sortable || !column.getSortValue) return rows;
    return [...rows].sort((a, b) => compareValues(column.getSortValue(a), column.getSortValue(b), sort.direction));
  }, [columns, rows, sort]);

  const toggleSort = (column) => {
    setSort((previous) => {
      if (previous.id !== column.id) return { id: column.id, direction: column.defaultSortDir ?? 'asc' };
      return { id: column.id, direction: previous.direction === 'asc' ? 'desc' : 'asc' };
    });
  };

  if (isLoading) return <PageLoader />;
  if (!sortedRows.length) return <EmptyState message={emptyMessage} />;

  const cellPadding = DENSITY_CELL_CLASS[density] ?? DENSITY_CELL_CLASS[DEFAULT_TABLE_DENSITY];
  const textSize = DENSITY_TEXT_CLASS[density] ?? DENSITY_TEXT_CLASS[DEFAULT_TABLE_DENSITY];

  const renderHeader = (column) => {
    if (column.sortable) {
      return (
        <SortableHeader
          label={column.label}
          active={sort.id === column.id}
          direction={sort.direction}
          onClick={() => toggleSort(column)}
        />
      );
    }
    return column.header ? column.header() : column.label;
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border bg-surface">
      {/* border-separate keeps sticky cells working */}
      <table className="w-full border-separate border-spacing-0 text-start">
        <thead>
          <tr>
            {visibleColumns.map((column) => (
              <th
                key={column.id}
                className={cn(
                  'whitespace-nowrap border-b border-border bg-surface-muted text-start font-semibold text-muted-foreground',
                  cellPadding,
                  textSize,
                  STICKY_CLASS[resolveStickySide(column.sticky)],
                  column.headerClassName,
                )}
              >
                {renderHeader(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, index) => {
            const highlighted = getRowHighlight?.(row);
            const rowBackground = highlighted ? 'bg-warning-soft' : 'bg-surface';
            return (
              <tr
                key={getRowKey(row, index)}
                onClick={() => onRowClick?.(row)}
                className={cn('group transition-colors hover:bg-accent', rowBackground, onRowClick && 'cursor-pointer')}
              >
                {visibleColumns.map((column) => (
                  <td
                    key={column.id}
                    onClick={column.stopRowClick ? (event) => event.stopPropagation() : undefined}
                    className={cn(
                      'border-b border-border',
                      cellPadding,
                      textSize,
                      STICKY_CLASS[resolveStickySide(column.sticky)],
                      column.sticky && `${rowBackground} group-hover:bg-accent`,
                      column.cellClassName,
                    )}
                  >
                    {column.cell(row, index)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
