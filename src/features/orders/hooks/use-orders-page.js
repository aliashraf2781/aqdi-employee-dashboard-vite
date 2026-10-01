import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRowSelection } from '@/shared/hooks/use-row-selection';
import { useTablePreferences } from '@/shared/hooks/use-table-preferences';
import { buildAdminOrdersUrl, extractStandardPage } from '../api/orders-api';
import { exportOrdersToExcel } from '../lib/orders-export';
import { getAllOrdersExtraFilterStatuses } from '../lib/contract-statuses';
import { mapTableOrderRow } from '../lib/map-order-row';
import { ALL_ORDERS_QUERY_KEY } from '../lib/order-query-keys';
import { ALL_ORDERS_FILTER_PILLS, PILL_PERMISSIONS, STATUS_PILLS } from '../lib/orders-filters';
import { useContractStatuses } from './use-contract-statuses';
import { useBatchPrintContracts } from './use-batch-print-contracts';
import { useOrdersList } from './use-orders-list';
import { useOrdersListFilters } from './use-orders-list-filters';
import { useOrdersPermissions } from './use-orders-permissions';
import { usePaginatedExport } from './use-paginated-export';
import { usePrintOrder } from './use-print-order';

const TABLE_STORAGE_KEY = 'all-orders-table-prefs';

/**
 * State and actions of the all-orders table: filters, rows, selection, table preferences,
 * export and printing. The page only lays the pieces out.
 */
export function useOrdersPage({ lockedFilter = null, exportFilename = 'جميع-الطلبات' } = {}) {
  const navigate = useNavigate();
  const permissions = useOrdersPermissions();
  const { activeItems: statuses, returnedStatusId, canceledStatusId } = useContractStatuses();
  const filters = useOrdersListFilters({ canceledStatusId, returnedStatusId, lockedFilter });
  const list = useOrdersList({ params: filters.params, queryKey: ALL_ORDERS_QUERY_KEY });
  const selection = useRowSelection();
  const tablePreferences = useTablePreferences({ storageKey: TABLE_STORAGE_KEY });
  const batchPrint = useBatchPrintContracts();
  const { printOrder: printOrderById } = usePrintOrder();

  const openOrder = useCallback((order) => navigate(String(order.id ?? order.uuid)), [navigate]);
  const printOrder = useCallback((order) => printOrderById(order?.id), [printOrderById]);

  // A selection only makes sense for the rows that were on screen when it was made.
  const clearSelection = selection.clear;
  useEffect(() => clearSelection(), [filters.params, clearSelection]);

  const rows = useMemo(() => list.items.map(mapTableOrderRow), [list.items]);
  const extraStatuses = useMemo(
    () => (lockedFilter ? [] : getAllOrdersExtraFilterStatuses(statuses)),
    [statuses, lockedFilter],
  );
  const visiblePills = ALL_ORDERS_FILTER_PILLS.filter((pill) => {
    if (lockedFilter && STATUS_PILLS.includes(pill.id)) return false;
    return permissions.isAdmin || permissions.can(PILL_PERMISSIONS[pill.id], 'view');
  });

  const exportParams = useMemo(() => {
    // The export walks every page itself, so paging params must not be part of it.
    const params = { ...filters.params };
    delete params.page;
    delete params.per_page;
    return params;
  }, [filters.params]);

  const exporter = usePaginatedExport({
    buildUrl: (page) => buildAdminOrdersUrl({ ...exportParams, page }),
    extractPage: extractStandardPage,
    onExport: (orders) => exportOrdersToExcel(orders, { filename: exportFilename, showStatusColumn: true }),
  });

  return {
    permissions,
    filters,
    visiblePills,
    extraStatuses,
    rows,
    pagination: list.pagination,
    isLoading: list.isLoading,
    selection,
    tablePreferences,
    batchPrint,
    exporter,
    openOrder,
    printOrder,
  };
}
