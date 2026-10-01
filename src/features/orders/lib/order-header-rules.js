import { getOrderAdminApprovalStatus } from './refund-ids';
import {
  canOfferClosureActions,
  getReturnRequestStatus,
  hasReturnRequest,
  isAdminRefundApproved,
  isReturnContractStatus,
} from './refund-status';

/** The action buttons under the order header, in display order. */
export const HEADER_ACTIONS = {
  VIEW_FILE: 'view_file',
  PROPERTY_UPDATE: 'property_update',
  SEND_DRAFT: 'send_draft',
  MISSING_ATTACHMENT: 'missing_attachment',
  REFUND: 'refund',
  EJAR_DOCUMENTATION: 'ejar_documentation',
  PAY_LINK: 'pay_link',
};

const statusText = (status) => String(status?.name ?? status?.label ?? '').trim();

export function isDocumentedStatus(status) {
  return statusText(status).includes('تم التوثيق');
}

/** Statuses that mean "documented in Ejar" (the status itself or its Ejar wording). */
export function isEjarDocumentationStatus(status) {
  const name = statusText(status);
  return Boolean(name) && (name.includes('تم التوثيق') || name.includes('توثيق العقد') || name.includes('موثق'));
}

export function hasPropertyUpdate(order) {
  const method = order?.extras?.deed_addition_method ?? order?.deed_addition_method;
  return method != null && String(method).trim() !== '';
}

function isOrderAlreadyRefunded(order) {
  const summary = order?.contract_summary ?? {};
  const flag =
    order?.customer_refunded ??
    order?.is_refunded ??
    order?.refunded ??
    summary.customer_refunded ??
    summary.is_refunded ??
    summary.refunded;
  return [true, 1, '1'].includes(flag) || getReturnRequestStatus(order) === 'refunded';
}

/** A return request that was already approved, rejected or refunded cannot be raised again. */
export function isReturnRequestDecided(order) {
  if (!order) return false;
  if (isOrderAlreadyRefunded(order)) return true;

  const status = String(getReturnRequestStatus(order) ?? '').toLowerCase();
  if (['approved', 'rejected', 'refunded'].includes(status)) return true;
  if (!hasReturnRequest(order)) return false;

  const approval = getOrderAdminApprovalStatus(order);
  return isAdminRefundApproved(approval) || approval === false || approval === 0;
}

export function canOfferPaymentLink(view) {
  if (view?.is_paid) return false;
  return !isEjarDocumentationStatus({ name: view?.status_name });
}

/** Which action buttons the header shows for this order (`view`: the mapped order, `orderData`: the API order). */
export function getVisibleHeaderActions(view, orderData) {
  const closureAllowed = canOfferClosureActions(view, orderData);

  return Object.values(HEADER_ACTIONS).filter((action) => {
    if (action === HEADER_ACTIONS.PAY_LINK) return canOfferPaymentLink(view);
    if (action === HEADER_ACTIONS.REFUND && isReturnRequestDecided(orderData ?? view)) return false;
    if (action === HEADER_ACTIONS.REFUND || action === HEADER_ACTIONS.EJAR_DOCUMENTATION) return closureAllowed;
    return true;
  });
}

/** Statuses the header menu may offer: no "return"/"documented" ones for unpaid orders, no "return" once decided. */
export function getSelectableStatuses(statuses, view, orderData) {
  const closureAllowed = canOfferClosureActions(view, orderData);
  const hideReturn = isReturnRequestDecided(orderData ?? view);

  return statuses.filter((status) => {
    if (hideReturn && isReturnContractStatus(status)) return false;
    if (closureAllowed) return true;
    return !isReturnContractStatus(status) && !isEjarDocumentationStatus(status);
  });
}
