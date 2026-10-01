import {
  extractRefundContractId,
  getOrderAdminApprovalStatus,
  getOrderUuid,
  getRefundItemActionKey,
  hasExistingReturnRequest,
  isAdminRefundApproved,
} from '@/features/orders';
import {
  buildReturnOrderRefundFromRow,
  mergeRefundWithOrderRow,
  normalizeRefundContract,
  normalizeRefundFromOrder,
} from './refund-normalize';

const MISSING = '—';

const hasValue = (value) => value != null && value !== '';
const sameText = (a, b) => hasValue(a) && hasValue(b) && String(a) === String(b);
const usableUuid = (uuid) => hasValue(uuid) && uuid !== MISSING;

/** Keys under which one refund is stored in the lookup, so an order can find it by any of its identifiers. */
function lookupKeysOf(refund, rawItem) {
  const contract = rawItem?.contract ?? {};
  return [
    refund.refundId,
    refund.contractId,
    contract.id,
    refund.orderUuid,
    contract.uuid,
    refund.userMobile,
    refund.draftContractNumber,
  ].filter(hasValue);
}

/** Map of every known identifier (uuid, ids, mobile, draft number) to the normalized refund. */
export function buildRefundsLookup(refundItems) {
  const lookup = new Map();
  const items = Array.isArray(refundItems) ? refundItems : [];

  for (const item of items) {
    const refund = normalizeRefundContract(item);
    if (!refund?.refundId) continue;
    for (const key of lookupKeysOf(refund, item)) {
      lookup.set(key, refund);
      lookup.set(String(key), refund);
    }
  }
  return lookup;
}

function orderLookupKeys(order) {
  return [
    order.uuid,
    order.id,
    order.contract_id,
    order.refund_id,
    order.refundable_contract_id,
    order.draft_contract_number,
    extractRefundContractId(order),
  ]
    .filter(hasValue)
    .flatMap((key) => [key, String(key)]);
}

function refundBelongsToOrder(refund, order) {
  const contract = refund.raw?.contract ?? {};
  return (
    sameText(refund.orderUuid, order.uuid) ||
    sameText(contract.uuid, order.uuid) ||
    sameText(refund.contractId, order.id) ||
    sameText(refund.contractId, order.contract_id) ||
    sameText(contract.id, order.id) ||
    sameText(refund.userMobile, order.user_mobile)
  );
}

/** The refund of `order` in the lookup: first by exact identifier, then by scanning for a match. */
export function findRefundInLookup(order, refundsLookup) {
  if (!order || !refundsLookup?.size) return null;

  for (const key of orderLookupKeys(order)) {
    const found = refundsLookup.get(key);
    if (found?.refundId) return found;
  }
  for (const refund of refundsLookup.values()) {
    if (refundBelongsToOrder(refund, order)) return refund;
  }
  return null;
}

/** True when a raw refund item of the API is the refund of this order. */
export function refundItemMatchesOrder(order, item) {
  if (!order || !item) return false;

  const contract = item.contract ?? {};
  const itemUuid = contract.uuid ?? item.contract_uuid ?? item.uuid;
  const itemContractId = item.contract_id ?? contract.id;
  const orderContractId = order.contract_id ?? order.id ?? order.contract_summary?.id;
  const draft = order.draft_contract_number ?? order.contract_summary?.draft_contract_number;
  const itemDraft = item.draft_contract_number ?? contract.draft_contract_number;

  if (sameText(order.uuid ?? order.contract_summary?.uuid, itemUuid)) return true;
  if (sameText(orderContractId, itemContractId)) return true;
  if (sameText(draft, itemDraft)) return true;

  // Same customer and same amount is the last resort when no identifier matches.
  const mobile = order.user_mobile ?? order.user?.mobile ?? order.contract_summary?.user_mobile;
  const itemMobile = contract.user?.phone ?? contract.user_mobile ?? item.user_mobile ?? item.customer_mobile;
  return (
    sameText(mobile, itemMobile) &&
    order.refund_amount != null &&
    item.refund_amount != null &&
    Number(order.refund_amount) === Number(item.refund_amount)
  );
}

/** The raw refund item of `order`; when several match, the one still waiting for approval wins. */
export function findRefundItemForOrder(order, refundItems) {
  if (!order || !Array.isArray(refundItems)) return null;

  const matches = refundItems.filter((item) => refundItemMatchesOrder(order, item));
  if (matches.length <= 1) return matches[0] ?? null;

  const pending = matches.filter((item) => !isAdminRefundApproved(item.admin_confirmed));
  return pending.length === 1 ? pending[0] : matches[0];
}

function resolveRefundForOrder(order, refundsLookup) {
  const fromOrder = normalizeRefundFromOrder(order);
  return fromOrder?.refundId ? fromOrder : findRefundInLookup(order, refundsLookup);
}

/** The refund of a return-orders row (null when neither the row nor the lookup knows one). */
export function resolveReturnOrderRefund(order, refundsLookup) {
  const resolved = resolveRefundForOrder(order, refundsLookup);
  if (resolved?.refundId) return mergeRefundWithOrderRow(resolved, order);

  return buildReturnOrderRefundFromRow(order);
}

/**
 * Key for POST /admin/analytics/refunds/contracts/{key}. The numeric refund record id is the most
 * reliable; the contract uuid is the fallback.
 */
export function resolveRefundIdForAction(order, refund, refundsLookup) {
  const recordId =
    refund?.id ??
    refund?.refundRecordId ??
    extractRefundContractId(order) ??
    findRefundInLookup(order, refundsLookup)?.id ??
    resolveReturnOrderRefund(order, refundsLookup)?.id ??
    null;
  if (hasValue(recordId)) return String(recordId);

  if (usableUuid(refund?.orderUuid)) return String(refund.orderUuid);

  const orderUuid = getOrderUuid(order);
  if (orderUuid) return String(orderUuid);

  const fromLookup = findRefundInLookup(order, refundsLookup);
  if (usableUuid(fromLookup?.orderUuid)) return String(fromLookup.orderUuid);

  const resolved = resolveReturnOrderRefund(order, refundsLookup);
  return usableUuid(resolved?.orderUuid) ? String(resolved.orderUuid) : null;
}

/** Like resolveRefundIdForAction, then also looks through the raw refund items before settling for the uuid. */
export function resolveRefundActionKey(order, refund, refundsLookup, allRefunds = []) {
  const direct = resolveRefundIdForAction(order, refund, refundsLookup);
  if (direct) return direct;

  const found = findRefundItemForOrder(order, allRefunds);
  const key = found?.id ?? getRefundItemActionKey(found);
  if (hasValue(key)) return String(key);

  const orderUuid = getOrderUuid(order);
  return orderUuid ? String(orderUuid) : null;
}

/** The refund shown on a return-orders row. Always returns something for a real row. */
export function ensureReturnOrderRefund(order, refundsLookup) {
  const resolved = resolveReturnOrderRefund(order, refundsLookup);
  if (resolved) {
    const refundId = resolveRefundIdForAction(order, resolved, refundsLookup);
    return { ...resolved, refundId: refundId ?? resolved.refundId };
  }
  if (!order) return null;

  return mergeRefundWithOrderRow(
    {
      refundId: resolveRefundIdForAction(order, null, refundsLookup),
      orderUuid: order.uuid ?? MISSING,
      userMobile: order.user_mobile ?? '',
      contractType: order.contract_type ?? MISSING,
      refundAmount: order.refund_amount,
      adminConfirmed: getOrderAdminApprovalStatus(order),
      amountPayment: order.amount_payment,
      isPaid: order.is_paid,
      paymentLabelAr: order.payment_label_ar,
      employeeName: order.employee_name ?? MISSING,
      draftContractNumber: order.draft_contract_number,
      contractId: order.contract_id ?? order.id,
      returnContract: true,
      raw: order,
    },
    order,
  );
}

/** The admin may approve or reject only while a return request exists and the customer is not yet refunded. */
export function canShowReturnOrderApproval(order, refund) {
  if (!resolveRefundIdForAction(order, refund)) return false;
  if (!hasExistingReturnRequest(order)) return false;

  const customerRefunded = order?.customer_refunded ?? order?.is_refunded ?? order?.refunded;
  return customerRefunded !== true && customerRefunded !== 1;
}
