import { RETURN_CONTRACT_STATUS_ID } from './contract-statuses';
import { extractRefundContractId, getOrderAdminApprovalStatus } from './refund-ids';

export const UNPAID_ORDER_RETURN_MESSAGE = 'لا يمكن رفع طلب استرجاع لطلب غير مدفوع';

const RETURN_REQUEST_EXISTS_MESSAGES = {
  pending: 'يوجد طلب استرجاع قيد المراجعة لهذا الطلب',
  approved: 'تمت الموافقة على طلب استرجاع لهذا الطلب',
  rejected: 'يوجد طلب استرجاع مرفوض لهذا الطلب',
  refunded: 'تم استرجاع مبلغ هذا الطلب بالفعل',
};

/** API uses `true` when the admin approved; `false`/null mean rejected or pending. */
export function isAdminRefundApproved(value) {
  return value === true || value === 1;
}

export function isReturnContractStatus(status) {
  if (!status) return false;
  if (Number(status.id) === RETURN_CONTRACT_STATUS_ID) return true;
  const name = String(status.name || '').trim();
  return name.includes('استرجاع') || name.includes('مسترجع');
}

/** `pending` | `approved` | `rejected` | `refunded` | null. */
export function getReturnRequestStatus(order) {
  return order?.return_request_status ?? order?.contract_summary?.return_request_status ?? null;
}

/** Authoritative "a return request exists": the explicit backend flag only, never derived. */
export function hasReturnRequest(order) {
  return order?.has_return_request === true || order?.contract_summary?.has_return_request === true;
}

export function getReturnRequestExistsMessage(order) {
  return RETURN_REQUEST_EXISTS_MESSAGES[getReturnRequestStatus(order)] || 'يوجد طلب استرجاع مسبقاً لهذا الطلب';
}

/** Refundable-contract record id for approve/reject actions, or null. */
export function getRefundContractId(order) {
  return order?.refund_contract_id ?? order?.contract_summary?.refund_contract_id ?? null;
}

/** True when the order/contract is explicitly marked paid. */
export function isOrderPaid(order) {
  if (!order) return false;
  const summary = order.contract_summary ?? {};
  const value = order.is_paid ?? summary.is_paid ?? order.payment_status ?? summary.payment_status;
  return value === true || value === 1 || value === '1' || value === 'paid';
}

/** True when the contract itself is finished, independent of payment. */
export function isOrderCompleted(order) {
  if (!order) return false;
  const summary = order.contract_summary ?? {};
  const flag = order.is_completed ?? summary.is_completed ?? order.completed ?? summary.completed;
  if (flag === true || flag === 1 || flag === '1' || flag === 'completed') return true;

  const name = String(
    order.status_name ??
      order.contract_status_name ??
      summary.contract_status_name ??
      order.status?.name ??
      order.status_label ??
      '',
  ).trim();
  return name.includes('مكتمل') || name.includes('منجز');
}

/** Refund and Ejar actions are only for a paid or completed contract. */
export function canOfferClosureActions(...orders) {
  return orders.some((order) => order && (isOrderPaid(order) || isOrderCompleted(order)));
}

/** Whether "رفع طلب استرجاع" can still be opened: paid and no request yet. */
export function canRequestOrderReturn(order) {
  return Boolean(order) && isOrderPaid(order) && !hasReturnRequest(order);
}

export function isReturnContractOrder(order) {
  if (order?.return_contract === true) return true;
  if (Number(order?.contract_status_id) === RETURN_CONTRACT_STATUS_ID) return true;
  const statusName = order?.status?.name ?? order?.contract_status_name ?? '';
  return isReturnContractStatus({ name: statusName });
}

/** `refund_amount` is 0 / "0.00" / null on orders without a return request. */
function hasPositiveRefundAmount(value) {
  if (value == null || value === '') return false;
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0;
}

/** A refund record only counts when it carries a real id or amount (not `{}` or `0`). */
function isMeaningfulRefundRecord(record) {
  if (record == null) return false;
  if (typeof record === 'number' || typeof record === 'string') {
    const key = String(record).trim();
    return key !== '' && key !== '0';
  }
  if (typeof record !== 'object') return false;
  if (record.id != null && record.id !== '' && String(record.id) !== '0') return true;
  return hasPositiveRefundAmount(record.refund_amount ?? record.amount);
}

export function hasExistingReturnRequest(order) {
  if (!order) return false;
  if (order.has_return_request != null || order.contract_summary?.has_return_request != null) {
    return hasReturnRequest(order);
  }
  if (isReturnContractOrder(order) || order.is_return_order === true) return true;

  const refundContractId = extractRefundContractId(order);
  if (refundContractId != null && refundContractId !== '' && String(refundContractId) !== '0') return true;
  if (hasPositiveRefundAmount(order.refund_amount)) return true;

  const nested =
    order.refundable_contract ??
    order.refund ??
    (Array.isArray(order.refundable_contracts) ? order.refundable_contracts[0] : null);
  return isMeaningfulRefundRecord(nested);
}

export function isCustomerRefundPending(order) {
  const value = order?.customer_refunded ?? order?.is_refunded ?? order?.refunded;
  return value === null || value === undefined;
}

function isCustomerRefundedFlag(row) {
  const value = row?.customer_refunded ?? row?.is_refunded ?? row?.refunded;
  return value === true || value === 1;
}

/** Which KPI bucket a return-order row belongs to: pending | approved | rejected. */
export function getReturnOrderApprovalKpiKey(row) {
  if (!row) return 'pending';
  if (isCustomerRefundedFlag(row)) return 'approved';

  const requestStatus = getReturnRequestStatus(row);
  if (requestStatus === 'rejected') return 'rejected';
  if (requestStatus === 'approved' || requestStatus === 'refunded') return 'approved';
  if (requestStatus === 'pending') return 'pending';

  const status = getOrderAdminApprovalStatus(row);
  if (isAdminRefundApproved(status)) return 'approved';
  if (status === false || status === 0) return 'rejected';
  return 'pending';
}

export function countReturnOrdersByApproval(rows = []) {
  const counts = { pending: 0, approved: 0, rejected: 0 };
  rows.forEach((row) => {
    counts[getReturnOrderApprovalKpiKey(row)] += 1;
  });
  return counts;
}
