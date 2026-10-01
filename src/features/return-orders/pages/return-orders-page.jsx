import { useMemo } from 'react';
import { BatchActionsBar } from '@/shared/components/batch-actions-bar';
import { ControllableTable } from '@/shared/components/controllable-table';
import { makeSelectionColumn } from '@/shared/components/controllable-table/selection-column';
import { TableFooter } from '@/shared/components/table-footer';
import { ManageContractStatusesDialog, OrdersToolbar, WhatsAppPaymentLinkDialog, isDraftOrderRow } from '@/features/orders';
import { useOpenState } from '@/shared/hooks/use-open-state';
import { RefundApprovedDialog } from '../components/refund-approved-dialog';
import { buildReturnOrderColumns } from '../components/return-order-columns';
import { ReturnOrdersKpis } from '../components/return-orders-kpis';
import { useReturnOrdersPage } from '../hooks/use-return-orders-page';

const DEFAULT_SORT = { id: 'receivedSince', direction: 'asc' };

/** الطلبات المسترجعة: returned orders with the admin approval of each refund. */
export function ReturnOrdersPage() {
  const page = useReturnOrdersPage();
  const { permissions, filters, selection, tablePreferences } = page;
  const paymentLink = useOpenState();
  const manageStatuses = useOpenState();
  const canManageStatuses = permissions.canAddStatus || permissions.canEditStatus;

  const columns = useMemo(
    () => [
      makeSelectionColumn({
        rows: page.rows,
        selectedIds: selection.selectedIds,
        onToggleRow: selection.toggle,
        onToggleAll: selection.toggleMany,
      }),
      ...buildReturnOrderColumns({
        onView: page.openOrder,
        onPrint: page.printOrder,
        refundsLookup: page.refundsLookup,
        refundItems: page.refundItems,
        onApproved: page.setApprovedRefund,
      }),
    ],
    [page.rows, page.openOrder, page.printOrder, page.refundsLookup, page.refundItems, page.setApprovedRefund, selection],
  );

  return (
    <div className="flex flex-col gap-4">
      <OrdersToolbar
        title="الطلبات المسترجعة"
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
        onManageStatuses={canManageStatuses ? manageStatuses.show : undefined}
        onOpenPaymentLink={paymentLink.show}
      />

      <ReturnOrdersKpis rows={page.rows} counts={page.kpiCounts} />

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
        emptyMessage="لا توجد طلبات مسترجعة مطابقة للبحث"
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

      <WhatsAppPaymentLinkDialog open={paymentLink.open} onOpenChange={paymentLink.setOpen} />
      <ManageContractStatusesDialog
        open={manageStatuses.open}
        onOpenChange={manageStatuses.setOpen}
        canCreate={permissions.canAddStatus}
        canEdit={permissions.canEditStatus}
      />
      <RefundApprovedDialog open={Boolean(page.approvedRefund)} onOpenChange={page.closeApprovedDialog} refund={page.approvedRefund} />
    </div>
  );
}
