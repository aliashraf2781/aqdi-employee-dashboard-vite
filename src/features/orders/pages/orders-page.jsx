import { useMemo, useState } from 'react';
import { BatchActionsBar } from '@/shared/components/batch-actions-bar';
import { ControllableTable } from '@/shared/components/controllable-table';
import { makeSelectionColumn } from '@/shared/components/controllable-table/selection-column';
import { TableFooter } from '@/shared/components/table-footer';
import { ManageContractStatusesDialog } from '../components/contract-statuses/manage-contract-statuses-dialog';
import { buildOrderColumns } from '../components/orders-list/order-columns';
import { OrdersToolbar } from '../components/orders-list/orders-toolbar';
import { WhatsAppPaymentLinkDialog } from '../components/payment-link/whatsapp-payment-link-dialog';
import { useOrdersPage } from '../hooks/use-orders-page';
import { isDraftOrderRow } from '../lib/draft-order';

const DEFAULT_SORT = { id: 'receivedSince', direction: 'asc' };

/** جميع الطلبات: filterable, selectable table of every order. */
export function OrdersPage() {
  const page = useOrdersPage();
  const { permissions, filters, selection, tablePreferences } = page;
  const [paymentLinkOpen, setPaymentLinkOpen] = useState(false);
  const [manageStatusesOpen, setManageStatusesOpen] = useState(false);
  const canManageStatuses = permissions.canAddStatus || permissions.canEditStatus;

  const columns = useMemo(
    () => [
      makeSelectionColumn({
        rows: page.rows,
        selectedIds: selection.selectedIds,
        onToggleRow: selection.toggle,
        onToggleAll: selection.toggleMany,
      }),
      ...buildOrderColumns({ onView: page.openOrder, onPrint: page.printOrder }),
    ],
    [page.rows, page.openOrder, page.printOrder, selection.selectedIds, selection.toggle, selection.toggleMany],
  );

  return (
    <div className="flex flex-col gap-4">
      <OrdersToolbar
        title="جميع الطلبات"
        search={{ value: filters.searchQuery, onChange: filters.setSearchQuery }}
        filters={{
          pills: page.visiblePills,
          activeFilters: filters.activeFilters,
          onTogglePill: filters.toggleFilter,
          extraStatuses: page.extraStatuses,
          extraStatusId: filters.extraStatusId,
          onExtraStatusChange: filters.changeExtraStatus,
          contractType: filters.contractType,
          onContractTypeChange: filters.setContractType,
        }}
        table={{ columns, ...tablePreferences }}
        onExport={permissions.canExport ? page.exporter.handleExport : undefined}
        isExporting={page.exporter.isExporting}
        onManageStatuses={canManageStatuses ? () => setManageStatusesOpen(true) : undefined}
        onOpenPaymentLink={() => setPaymentLinkOpen(true)}
      />

      <BatchActionsBar
        count={selection.selectedCount}
        onPrint={() => page.batchPrint.batchPrint(selection.selectedArray)}
        onClear={selection.clear}
        isPrinting={page.batchPrint.isBatchPrinting}
      />

      <ControllableTable
        columns={columns}
        rows={page.rows}
        isLoading={page.isLoading}
        density={tablePreferences.density}
        isColumnVisible={tablePreferences.isColumnVisible}
        emptyMessage="لا توجد طلبات مطابقة للبحث"
        onRowClick={page.openOrder}
        getRowHighlight={isDraftOrderRow}
        defaultSort={DEFAULT_SORT}
      />

      <TableFooter
        pagination={page.pagination}
        page={filters.page}
        perPage={filters.perPage}
        onPageChange={filters.setPage}
        onPerPageChange={filters.setPerPage}
      />

      <WhatsAppPaymentLinkDialog open={paymentLinkOpen} onOpenChange={setPaymentLinkOpen} />
      <ManageContractStatusesDialog
        open={manageStatusesOpen}
        onOpenChange={setManageStatusesOpen}
        canCreate={permissions.canAddStatus}
        canEdit={permissions.canEditStatus}
      />
    </div>
  );
}
