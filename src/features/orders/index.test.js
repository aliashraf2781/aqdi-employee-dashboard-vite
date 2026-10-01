import { describe, expect, it } from 'vitest';
import * as orders from './index';

// The realtime-orders and return-orders features import these names; renaming one is a breaking change.
const PUBLIC_API = [
  'useUnreceivedOrdersCount',
  'useReturnedOrdersCount',
  'OrderDetailsPage',
  'OrderStatusBadge',
  'useOrderStatusFlow',
  'OrderStatusFlowDialogs',
  'useChangeOrderStatus',
  'useConfirmOrderStatusChange',
  'useContractStatuses',
  'ManageContractStatusesDialog',
  'useReceiveContract',
  'useUpdateOrder',
  'ReturnRequestDialog',
  'useReturnRequest',
  'WhatsAppPaymentLinkDialog',
  'SendOrderSmsDialog',
  'useOrdersList',
  'useOrdersListFilters',
  'useOrdersPage',
  'OrdersToolbar',
  'OrderActionsMenu',
  'mapTableOrderRow',
  'mapNewOrderRow',
  'useRowSelection',
  'usePrintOrder',
  'useBatchPrintContracts',
  'printOrderContract',
  'usePaginatedExport',
  'exportOrdersToExcel',
  'isOrderPaid',
  'normalizeOrderForReturnRequest',
  'mapOrderDetailView',
  'getOrderTenantStep',
  'invalidateOrdersCaches',
  'invalidateRefundCaches',
  'ALL_ORDERS_QUERY_KEY',
];

describe('orders public api', () => {
  it.each(PUBLIC_API)('exports %s', (name) => {
    expect(orders[name], name).toBeDefined();
  });

  it('exports no undefined values', () => {
    const missing = Object.entries(orders).filter(([, value]) => value === undefined).map(([name]) => name);
    expect(missing).toEqual([]);
  });
});
