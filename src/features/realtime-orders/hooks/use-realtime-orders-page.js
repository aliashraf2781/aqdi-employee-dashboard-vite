import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTablePreferences } from '@/shared/hooks/use-table-preferences';
import {
  buildAdminOrdersUrl,
  exportOrdersToExcel,
  extractStandardPage,
  getRealtimeStatusChipStatuses,
  mapNewOrderRow,
  mapTableOrderRow,
  REALTIME_ORDERS_QUERY_KEY,
  useBatchPrintContracts,
  useContractStatuses,
  useOrderStatusFlow,
  useOrdersList,
  usePaginatedExport,
  usePrintOrder,
  useReceiveContract,
  useRowSelection,
} from '@/features/orders';
import { findSection, getSectionPermission, REALTIME_SECTIONS } from '../lib/realtime-sections';
import { useNewOrders } from './use-new-orders';
import { useRealtimeFilters } from './use-realtime-filters';
import { useRealtimePermissions } from './use-realtime-permissions';

const TABLE_STORAGE_KEY = 'realtime-orders-table-prefs';
const EXPORT_FILENAME = 'الطلبات-مباشر';
const ORDERS_ROUTE = '/home/orders';
const REALTIME_ROUTE = '/home/realtime-orders';

/**
 * State and actions of the realtime screen: the "new requests" strip, the filtered orders table,
 * selection, export, printing and the status-change flow. The page only lays the pieces out.
 */
export function useRealtimeOrdersPage() {
  const navigate = useNavigate();
  const permissions = useRealtimePermissions();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [newOrdersExpanded, setNewOrdersExpanded] = useState(false);

  const statuses = useContractStatuses();
  const { receivedStatusId, canceledStatusId, returnedStatusId, newStatusId } = statuses;
  const statusIds = useMemo(
    () => ({ received: receivedStatusId, canceled: canceledStatusId, returned: returnedStatusId }),
    [receivedStatusId, canceledStatusId, returnedStatusId],
  );
  const filters = useRealtimeFilters({ statusIds, canViewReceivedQueue: permissions.canViewReceivedQueue });

  const newOrders = useNewOrders({
    statusId: newStatusId,
    enabled: permissions.canViewNewRequests,
    autoRefresh,
  });
  const newRequests = useMemo(() => newOrders.items.map(mapNewOrderRow), [newOrders.items]);

  const list = useOrdersList({ params: filters.params, queryKey: REALTIME_ORDERS_QUERY_KEY, autoRefresh });
  const rows = useMemo(() => list.items.map(mapTableOrderRow), [list.items]);

  const selection = useRowSelection();
  const tablePreferences = useTablePreferences({ storageKey: TABLE_STORAGE_KEY });
  const batchPrint = useBatchPrintContracts();
  const { printOrder: printOrderById } = usePrintOrder();
  const receive = useReceiveContract();
  const statusFlow = useOrderStatusFlow({
    queryKey: [REALTIME_ORDERS_QUERY_KEY],
    canReturn: permissions.canReturn,
    requirePaymentForReturn: true,
  });

  const openOrder = useCallback(
    (order) => {
      const from = encodeURIComponent(REALTIME_ROUTE);
      navigate(`${ORDERS_ROUTE}/${order.id ?? order.uuid}?from=${from}`);
    },
    [navigate],
  );
  const printOrder = useCallback((order) => printOrderById(order?.id), [printOrderById]);

  // A selection only makes sense for the rows that were on screen when it was made.
  const clearSelection = selection.clear;
  useEffect(() => clearSelection(), [filters.params, clearSelection]);

  const exporter = usePaginatedExport({
    // The export walks every page itself, so paging params must not be part of it.
    buildUrl: (page) => buildAdminOrdersUrl({ ...filters.params, page, per_page: undefined }),
    extractPage: extractStandardPage,
    onExport: (orders) => exportOrdersToExcel(orders, { filename: EXPORT_FILENAME, showStatusColumn: true }),
  });

  const visibleSections = REALTIME_SECTIONS.filter(
    (section) => permissions.isAdmin || permissions.can(getSectionPermission(section.id), 'view'),
  );

  return {
    permissions,
    filters,
    autoRefresh,
    setAutoRefresh,
    newOrders: {
      requests: newRequests,
      total: newOrders.total,
      summary: newOrders.summary,
      isLoading: newOrders.isLoading,
      expanded: newOrdersExpanded,
      setExpanded: setNewOrdersExpanded,
    },
    receive: {
      receiveOrder: receive.mutate,
      receivingId: receive.isPending ? receive.variables?.id : null,
    },
    statusChips: getRealtimeStatusChipStatuses(statuses.activeItems, receivedStatusId),
    changeableStatuses: statuses.activeItems,
    visibleSections,
    activeSection: findSection(filters.activeSection),
    rows,
    pagination: list.pagination,
    isLoading: list.isLoading,
    selection,
    tablePreferences,
    batchPrint,
    exporter,
    statusFlow,
    openOrder,
    printOrder,
  };
}
