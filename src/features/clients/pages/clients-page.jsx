import { useState } from 'react';
import { EmptyState } from '@/shared/components/empty-state';
import { PageHeader } from '@/shared/components/page-header';
import { Pagination } from '@/shared/components/pagination';
import { ClientsFilters } from '@/features/clients/components/clients-filters';
import { ClientsResultsBar } from '@/features/clients/components/clients-results-bar';
import { ClientsSummaryCards } from '@/features/clients/components/clients-summary-cards';
import { ClientsTable } from '@/features/clients/components/clients-table';
import { useClientsList } from '@/features/clients/hooks/use-clients-list';
import { useClientsListState } from '@/features/clients/hooks/use-clients-list-state';
import { useExportClients } from '@/features/clients/hooks/use-export-clients';
import { sortByJoinedDate } from '@/features/clients/lib/client-details-format';
import { describeRange } from '@/features/clients/lib/pagination';

export function ClientsPage() {
  const state = useClientsListState();
  const [sortDirection, setSortDirection] = useState('desc');
  const exportClients = useExportClients();

  const { rows, meta, summary, isLoading, isFetching, isError } = useClientsList({
    ...state.apiFilters,
    page: state.page,
    perPage: state.filters.pageSize,
  });

  const toggleSortDirection = () => setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'));
  const range = describeRange(state.page, state.filters.pageSize, meta.total);

  return (
    <>
      <PageHeader title="العملاء" description="كل عملاء عقدي - اضغط «عرض» لملف العميل الكامل" />

      <ClientsSummaryCards summary={summary} />

      <ClientsFilters
        searchInput={state.searchInput}
        onSearchChange={state.setSearchInput}
        filters={state.filters}
        onFilterChange={state.changeFilter}
        onExport={() => exportClients.mutate(state.apiFilters)}
        isExporting={exportClients.isPending}
      />

      <ClientsResultsBar
        range={range}
        total={meta.total}
        isFetching={isFetching}
        pageSize={state.filters.pageSize}
        onPageSizeChange={(size) => state.changeFilter('pageSize', size)}
      />

      {isError ? (
        <EmptyState message="تعذر تحميل قائمة العملاء من الخادم" />
      ) : (
        <ClientsTable
          rows={sortByJoinedDate(rows, sortDirection)}
          isLoading={isLoading}
          sortDirection={sortDirection}
          onToggleSort={toggleSortDirection}
        />
      )}

      <Pagination page={state.page} lastPage={meta.lastPage} onPageChange={state.setPage} />
    </>
  );
}
