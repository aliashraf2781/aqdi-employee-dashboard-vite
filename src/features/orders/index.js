/**
 * Public API of the orders feature.
 * Other features (realtime-orders, return-orders, ...) import order building blocks from here only.
 *
 * Reminder for realtime-orders: `/home/realtime-orders/:id` should redirect to
 * `/home/orders/:id?from=/home/realtime-orders`, the details page lives in this feature.
 */

// ---------------------------------------------------------------------------
// Sidebar badge counters
// ---------------------------------------------------------------------------
/** Number of orders still in the "new" status (badge of the realtime-orders nav item). */
export { useUnreceivedOrdersCount } from './hooks/use-order-badge-counts';
/** Number of contracts in the returned status (badge of the return-orders nav item). */
export { useReturnedOrdersCount } from './hooks/use-order-badge-counts';

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
/** Order details page (header, data groups, editors, dialogs). Mounted at /home/orders/:id. */
export { OrderDetailsPage } from './pages/order-details-page';

// ---------------------------------------------------------------------------
// Status: badge, change flow, statuses data
// ---------------------------------------------------------------------------
/** Colored status pill (API colors). `OrderRowStatusBadge` reads a row mapped with mapTableOrderRow. */
export { OrderStatusBadge, OrderRowStatusBadge } from './components/order-status-badge';
/** Whole "change status" flow: confirm dialog, extra-fields dialog and the return-request flow. Use with <OrderStatusFlowDialogs flow={flow} />. */
export { useOrderStatusFlow } from './hooks/use-order-status-flow';
export { OrderStatusFlowDialogs } from './components/status-flow/order-status-flow-dialogs';
/** Mutation that applies a contract status to an order. */
export { useChangeOrderStatus } from './hooks/use-change-order-status';
/** "Are you sure?" gate before a status change (decides between direct change and the extra-fields dialog). */
export { useConfirmOrderStatusChange } from './hooks/use-confirm-order-status-change';
export { ConfirmOrderStatusChangeDialog } from './components/status-flow/confirm-status-change-dialog';
/** Dialog asking for the extra inputs a status needs (status_case.fields). */
export { ChangeOrderStatusFieldsDialog } from './components/status-flow/status-fields-dialog';
/** Contract statuses and the ids of the well-known ones (new, received, returned, canceled). */
export { useContractStatuses } from './hooks/use-contract-statuses';
/** List/add/edit dialog of the contract statuses. */
export { ManageContractStatusesDialog } from './components/contract-statuses/manage-contract-statuses-dialog';
export {
  getAllOrdersExtraFilterStatuses,
  getRealtimeExtraFilterStatuses,
  getRealtimeStatusChipStatuses,
  NEW_CONTRACT_STATUS_ID,
  RETURN_CONTRACT_STATUS_ID,
  CANCELED_CONTRACT_STATUS_ID,
  RECEIVED_CONTRACT_STATUS_ID,
} from './lib/contract-statuses';
export { getStatusCaseFields, isSendContractDraftStatus, normalizeMenuStatus, statusRequiresExtraFields } from './lib/order-status-payload';
export { filterOrdersPageStatusItems, getDefaultOrdersPageStatusId } from './lib/orders-page-statuses';

// ---------------------------------------------------------------------------
// Order actions and their dialogs
// ---------------------------------------------------------------------------
/** Mutation: the logged-in employee receives (takes) an order. */
export { useReceiveContract } from './hooks/use-receive-contract';
/** Mutation: POST /admin/orders/{id} with any updatable fields. */
export { useUpdateOrder } from './hooks/use-update-order';
/** Return (refund) request flow dialog and the mutation behind it. */
export { ReturnRequestDialog } from './components/return-request/return-request-dialog';
export { useReturnRequest } from './hooks/use-return-request';
/** "Generate payment link for a WhatsApp customer" dialog and the dialog that shows a created link. */
export { WhatsAppPaymentLinkDialog } from './components/payment-link/whatsapp-payment-link-dialog';
export { PaymentLinkResultDialog } from './components/payment-link/payment-link-result-dialog';
export { useOrderPaymentLink } from './hooks/use-order-payment-link';
/** Dialogs of the details page that realtime-orders also offers from its rows. */
export { SendDraftDialog } from './components/order-actions/send-draft-dialog';
export { EjarDocumentationDialog } from './components/order-actions/ejar-documentation-dialog';
export { PropertyUpdateDialog } from './components/order-actions/property-update-dialog';
export { CorrectionRequestDialog } from './components/order-actions/correction-request-dialog';
/** SMS to the customer of an order (controlled dialog; build your own trigger button). */
export { SendOrderSmsDialog } from './components/order-actions/send-order-sms-dialog';
export { resolveOrderSmsPhone, resolveOrderSmsUserId, resolveSmsRecipient } from './lib/order-sms-recipient';
export { getOrderSmsTemplates, buildOrderPaymentUrl } from './lib/order-sms-templates';
export { useOrdersPermissions } from './hooks/use-orders-permissions';

// ---------------------------------------------------------------------------
// Lists: data, filters, table pieces
// ---------------------------------------------------------------------------
/** One page of GET /admin/orders with keep-previous-data and optional polling. */
export { useOrdersList } from './hooks/use-orders-list';
export { fetchAdminOrders, fetchAllPages, fetchOrder, fetchOrdersTotalByStatus, extractStandardPage, buildAdminOrdersUrl } from './api/orders-api';
export { buildAdminOrdersParams, extractOrdersPayload } from './lib/admin-orders-query';
/** Search/filter/paging state of an orders table and the API params built from it. */
export { useOrdersListFilters } from './hooks/use-orders-list-filters';
/** Everything an orders table needs (filters, rows, selection, table prefs, export, print). `lockedFilter` fixes a pill, e.g. 'returned'. */
export { useOrdersPage } from './hooks/use-orders-page';
export { ALL_ORDERS_FILTER_PILLS, CONTRACT_TYPE_OPTIONS, resolveListFilters, toggleFilterPill } from './lib/orders-filters';
export { OrdersToolbar } from './components/orders-list/orders-toolbar';
export { FilterPills } from './components/orders-list/filter-pills';
export { MoreFiltersPopover } from './components/orders-list/more-filters-popover';
export { OrderActionsMenu } from './components/orders-list/order-actions-menu';
export { OrderNumberCell, PaymentCell, ReceivedByCell, ReceivedSinceCell } from './components/orders-list/order-table-cells';
export { buildOrderColumns } from './components/orders-list/order-columns';
/** Row shapes: table rows and "new requests" cards. */
export { getContractTypeKey, getWaitingMinutes, mapNewOrderRow, mapTableOrderRow } from './lib/map-order-row';
export { isDraftOrderRow } from './lib/draft-order';
export { formatRelativeShort, formatRelativeTimeAr } from './lib/format-relative-time';
/** Row selection state for tables (also available as @/shared/hooks/use-row-selection). */
export { useRowSelection } from '@/shared/hooks/use-row-selection';

// ---------------------------------------------------------------------------
// Print and export
// ---------------------------------------------------------------------------
/** Print one order's contract from its id, or many selected contracts as one document. */
export { usePrintOrder } from './hooks/use-print-order';
export { useBatchPrintContracts } from './hooks/use-batch-print-contracts';
export { buildBatchContractPrintHtml, buildContractPrintHtml, printOrderContract, printOrderContracts } from './lib/contract-print';
/** Export button state: walks every page of a list and hands the rows to an exporter. */
export { usePaginatedExport } from './hooks/use-paginated-export';
export { exportOrdersToExcel, exportReturnOrdersToExcel, mapOrderToExportRow, mapReturnOrderToExportRow } from './lib/orders-export';

// ---------------------------------------------------------------------------
// Refund / return helpers (pure)
// ---------------------------------------------------------------------------
export {
  canOfferClosureActions,
  canRequestOrderReturn,
  countReturnOrdersByApproval,
  getRefundContractId,
  getReturnOrderApprovalKpiKey,
  getReturnRequestExistsMessage,
  getReturnRequestStatus,
  hasExistingReturnRequest,
  hasReturnRequest,
  isAdminRefundApproved,
  isCustomerRefundPending,
  isOrderCompleted,
  isOrderPaid,
  isReturnContractOrder,
  isReturnContractStatus,
  UNPAID_ORDER_RETURN_MESSAGE,
} from './lib/refund-status';
export { extractRefundContractId, getOrderAdminApprovalStatus, getOrderUuid, getRefundItemActionKey, resolveRefundableContractId } from './lib/refund-ids';
export { normalizeOrderForReturnRequest } from './lib/return-request-order';
export { postReturnContractStatusForOrder, postOrderStatus } from './api/order-status-api';
export { createReturnRequest } from './api/return-request-api';
export { ACCEPT_RETURN_CONTRACT_FIELD, collectOrderIdentifierCandidates } from './lib/order-status-payload';

// ---------------------------------------------------------------------------
// Order data helpers (details payload)
// ---------------------------------------------------------------------------
export { mapOrderDetailView } from './lib/order-detail-view';
export {
  getOrderAddressStep,
  getOrderDeedStep,
  getOrderEndowmentNazir,
  getOrderFinancialStep,
  getOrderLegalAgent,
  getOrderOwnerStep,
  getOrderTenantStep,
  getOrderUnits,
  getOrderUnitsCount,
  getOrderUnitsStep,
  hasEndowmentNazir,
  hasLegalAgent,
  normalizeContractTypeKey,
  pickAgentRelatedField,
  resolveOrderContractTypeKey,
} from './lib/order-detail-steps';
export { buildWhatsAppUrl, getOrderClientPhone, getOrderContractUuid, getOrderId, normalizeWhatsAppPhone } from './lib/order-contact';
export { getInstrumentTypeLabel } from './lib/instrument-types';
export { getContractTypeLabel } from './lib/contract-periods';
export { absolutizeMediaUrl, downloadMedia } from './lib/media-url';
export { getSaudiMobileError, isSaudiMobile, sanitizeSaudiContactInput } from './lib/saudi-contact';
export { fetchContractPaymentLink, fetchContractPaidPaymentLink } from './api/contract-paid-api';
export { normalizePaymentLinkPayload } from './lib/payment-link';

// ---------------------------------------------------------------------------
// Query keys and cache invalidation
// ---------------------------------------------------------------------------
/** Query key roots of the order screens, and helpers that refresh every order list/counter after a change. */
export {
  ALL_ORDERS_QUERY_KEY,
  REALTIME_ORDERS_QUERY_KEY,
  REALTIME_NEW_ORDERS_QUERY_KEY,
  SINGLE_ORDER_QUERY_KEY,
  CONTRACT_STATUSES_QUERY_KEY,
  CONTRACT_STATUSES_ACTIVE_QUERY_KEY,
  UNRECEIVED_ORDERS_TOTAL_QUERY_KEY,
  RETURNED_ORDERS_TOTAL_QUERY_KEY,
  invalidateOrdersCaches,
  invalidateRefundCaches,
  invalidateContractStatusCaches,
  invalidateDraftOrdersCaches,
} from './lib/order-query-keys';
