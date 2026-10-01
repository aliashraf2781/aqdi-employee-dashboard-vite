import { ManageContractStatusesDialog, OrderStatusFlowDialogs, WhatsAppPaymentLinkDialog } from '@/features/orders';
import { BatchActionsBar } from '@/shared/components/batch-actions-bar';
import { TableFooter } from '@/shared/components/table-footer';
import { useOpenState } from '@/shared/hooks/use-open-state';
import { NewRequestsSection } from '../components/new-requests-section';
import { PaymentsDialog } from '../components/payments-dialog';
import { RealtimeOrdersTable } from '../components/realtime-orders-table';
import { RealtimeToolbar } from '../components/realtime-toolbar';
import { SectionHead } from '../components/section-head';
import { StatusFilterBar } from '../components/status-filter-bar';
import { useRealtimeColumns } from '../hooks/use-realtime-columns';
import { useRealtimeOrdersPage } from '../hooks/use-realtime-orders-page';

/** الطلبات مباشر: new orders waiting to be received, and the live table of received orders. */
export function RealtimeOrdersPage() {
  const page = useRealtimeOrdersPage();
  const { permissions, filters, selection, tablePreferences } = page;
  const columns = useRealtimeColumns(page);
  const paymentLinkDialog = useOpenState();
  const manageStatusesDialog = useOpenState();
  const paymentsDialog = useOpenState();

  const isSectionOpen = Boolean(page.activeSection);
  const total = page.pagination?.total;

  return (
    <div className="flex flex-col gap-4">
      <RealtimeToolbar
        search={{ value: filters.searchQuery, onChange: filters.setSearchQuery }}
        filters={{
          pills: page.visibleSections,
          activeFilters: filters.activeSection ? [filters.activeSection] : [],
          onTogglePill: filters.toggleSection,
          open: filters.filtersOpen && !isSectionOpen,
          onToggleOpen: filters.toggleFiltersOpen,
          hasActive: filters.hasInlineFilters,
        }}
        table={{ columns, ...tablePreferences }}
        onExport={permissions.canExport ? page.exporter.handleExport : undefined}
        isExporting={page.exporter.isExporting}
        onManageStatuses={permissions.canManageStatuses ? manageStatusesDialog.show : undefined}
        onOpenPayments={paymentsDialog.show}
        onOpenPaymentLink={paymentLinkDialog.show}
      />

      <SectionHead section={page.activeSection} count={total ?? page.rows.length} onClose={filters.closeSection} />

      {permissions.canViewNewRequests && !isSectionOpen && (
        <NewRequestsSection
          newOrders={page.newOrders}
          receive={page.receive}
          canReceive={permissions.canReceive}
          autoRefresh={page.autoRefresh}
          onAutoRefreshChange={page.setAutoRefresh}
        />
      )}

      {filters.filtersOpen && !isSectionOpen && (
        <StatusFilterBar
          statusChips={page.statusChips}
          statusId={filters.extraStatusId}
          onStatusChange={filters.changeExtraStatus}
          contractType={filters.contractType}
          onContractTypeChange={filters.setContractType}
          totalCount={total}
        />
      )}

      <BatchActionsBar
        count={selection.selectedCount}
        onPrint={() => page.batchPrint.batchPrint(selection.selectedArray)}
        onClear={selection.clear}
        isPrinting={page.batchPrint.isBatchPrinting}
      />

      <RealtimeOrdersTable columns={columns} page={page} />

      {Boolean(total) && (
        <TableFooter
          pagination={page.pagination}
          page={filters.page}
          perPage={filters.perPage}
          onPageChange={filters.setPage}
          onPerPageChange={filters.setPerPage}
        />
      )}

      <OrderStatusFlowDialogs flow={page.statusFlow} />
      <WhatsAppPaymentLinkDialog open={paymentLinkDialog.open} onOpenChange={paymentLinkDialog.setOpen} />
      <PaymentsDialog open={paymentsDialog.open} onOpenChange={paymentsDialog.setOpen} />
      <ManageContractStatusesDialog
        open={manageStatusesDialog.open}
        onOpenChange={manageStatusesDialog.setOpen}
        canCreate={permissions.canAddStatus}
        canEdit={permissions.canEditStatus}
      />
    </div>
  );
}
