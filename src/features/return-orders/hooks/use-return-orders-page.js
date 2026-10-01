import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ALL_ORDERS_QUERY_KEY,
  buildAdminOrdersUrl,
  extractStandardPage,
  invalidateRefundCaches,
  mapTableOrderRow,
  usePaginatedExport,
  useOrdersPage,
} from '@/features/orders';
import { enrichOrderWithRefundApproval } from '../lib/enrich-return-row';
import { exportRefundsToExcel } from '../lib/refund-export';
import { resolveKpiCounts } from '../lib/kpi-counts';
import { ensureReturnOrderRefund } from '../lib/refund-lookup';
import { orderDetailsPath } from '../lib/return-order-paths';
import { useRefundContracts } from './use-refund-contracts';

const EXPORT_FILENAME = 'الطلبات-المسترجعة';

/**
 * State and actions of the return-orders screen: the orders table locked to the returned status,
 * every row enriched with its refund approval, the KPI counters, the export and the
 * "refund approved" dialog.
 */
export function useReturnOrdersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const base = useOrdersPage({ lockedFilter: 'returned', exportFilename: EXPORT_FILENAME });
  const { refundContracts, refundsLookup, refundsSummary } = useRefundContracts();
  const [approvedRefund, setApprovedRefund] = useState(null);

  const rows = useMemo(() => base.rows.map((row) => enrichOrderWithRefundApproval(row, refundsLookup)), [base.rows, refundsLookup]);
  const kpiCounts = useMemo(
    () => resolveKpiCounts({ refundsSummary, refundContracts, tableOrders: rows }),
    [refundsSummary, refundContracts, rows],
  );

  const openOrder = useCallback((order) => navigate(orderDetailsPath(order)), [navigate]);

  const exporter = usePaginatedExport({
    buildUrl: (page) => buildAdminOrdersUrl({ ...base.exportParams, page }),
    extractPage: extractStandardPage,
    onExport: (orders) => {
      const withRefunds = orders.map(mapTableOrderRow).map((order) => ensureReturnOrderRefund(order, refundsLookup)).filter(Boolean);
      return exportRefundsToExcel(withRefunds, { filename: EXPORT_FILENAME });
    },
  });

  const closeApprovedDialog = (open) => {
    if (open) return;
    setApprovedRefund(null);
    invalidateRefundCaches(queryClient, { queryKey: [ALL_ORDERS_QUERY_KEY] });
  };

  return { ...base, rows, kpiCounts, refundsLookup, refundItems: refundContracts, openOrder, exporter, approvedRefund, setApprovedRefund, closeApprovedDialog };
}
