import { extractRefundContractId, getOrderAdminApprovalStatus } from '@/features/orders';

const MISSING = '—';

/** A refund contract of the analytics endpoint, flattened to the shape the screen reads. */
export function normalizeRefundContract(item) {
  if (!item) return null;

  const contract = item.contract ?? {};
  const refundRecordId = extractRefundContractId(item) ?? item.id;
  const orderUuid = contract.uuid ?? item.contract_uuid ?? item.uuid ?? item.order_number ?? MISSING;
  const paymentAmount = contract.amount_payment ?? item.amount_payment ?? item.payment_amount;

  return {
    id: refundRecordId,
    refundId: orderUuid !== MISSING ? orderUuid : refundRecordId,
    orderUuid,
    userMobile: contract.user?.phone ?? contract.user_mobile ?? item.user_mobile ?? item.customer_mobile ?? '',
    contractType: contract.contract_type ?? item.contract_type ?? MISSING,
    contractTypeKey: contract.contract_type_key ?? item.contract_type_key,
    amountPayment: paymentAmount,
    isPaid: contract.is_paid ?? item.is_paid ?? (paymentAmount != null && paymentAmount !== ''),
    paymentLabelAr: contract.payment_label_ar ?? item.payment_label_ar ?? item.refunded_status?.label_ar,
    refundAmount: item.refund_amount,
    adminConfirmed: item.management_approval?.approved ?? item.admin_confirmed ?? null,
    customerRefunded: item.customer_refunded ?? item.is_refunded ?? item.refunded,
    employeeName:
      contract.employee?.name ?? item.requester?.name ?? item.employee_name ?? item.raised_by_name ?? item.raised_by ?? MISSING,
    statusName: contract.status?.name ?? item.contract_status?.name ?? item.contract_status_name ?? item.status?.name ?? item.status_name,
    statusColor: contract.status?.color ?? item.contract_status?.color ?? item.status?.color,
    referenceNumber: item.reference_number ?? item.refund_reference,
    notes: item.notes,
    createdAt: item.created_at ?? contract.created_at,
    updatedAt: item.updated_at ?? contract.updated_at,
    contractId: item.contract_id ?? contract.id ?? null,
    draftContractNumber: item.draft_contract_number,
    returnContract: item.return_contract === true || item.is_return_order === true,
    raw: item,
  };
}

/** Treats an order row as a refund contract, using the refund fields the row itself carries. */
function normalizeOrderAsRefund(order, refundId) {
  return normalizeRefundContract({
    ...order,
    id: refundId,
    contract_id: order.contract_id ?? order.id,
    refund_amount: order.refund_amount,
    admin_confirmed: getOrderAdminApprovalStatus(order),
    reference_number: order.refund_reference ?? order.reference_number,
    contract: order,
    return_contract: true,
  });
}

/** The refund embedded in a return-orders list item, when the API nested one. */
export function normalizeRefundFromOrder(order) {
  if (!order) return null;

  const nested = order.refundable_contract ?? order.refund ?? (Array.isArray(order.refundable_contracts) ? order.refundable_contracts[0] : null);
  if (nested) {
    const normalized = normalizeRefundContract(nested);
    if (normalized?.refundId) return normalized;
  }

  const refundId = extractRefundContractId(order);
  return refundId ? normalizeOrderAsRefund(order, refundId) : null;
}

/** Fills the gaps of a refund with what the order row knows. */
export function mergeRefundWithOrderRow(refund, order) {
  if (!refund) return null;

  const hasEmployee = refund.employeeName && refund.employeeName !== MISSING;
  const hasContractType = refund.contractType && refund.contractType !== MISSING;

  return {
    ...refund,
    refundAmount: refund.refundAmount ?? order?.refund_amount,
    adminConfirmed: refund.adminConfirmed ?? getOrderAdminApprovalStatus(order),
    orderUuid: refund.orderUuid && refund.orderUuid !== MISSING ? refund.orderUuid : order?.uuid,
    userMobile: refund.userMobile || order?.user_mobile || '',
    contractType: hasContractType ? refund.contractType : order?.contract_type,
    employeeName: hasEmployee ? refund.employeeName : (order?.employee_name ?? order?.accept_retrun_contract_employee?.name),
    draftContractNumber: refund.draftContractNumber ?? order?.draft_contract_number,
    returnContract: true,
  };
}

/** A refund built only from a return-orders table row (null while the row has no refund id). */
export function buildReturnOrderRefundFromRow(order) {
  const refundId = extractRefundContractId(order);
  if (!refundId || !order) return null;
  return mergeRefundWithOrderRow(normalizeOrderAsRefund(order, refundId), order);
}

function resolveReturnRequestStatusFromRefund(item, approved) {
  const isRefunded = item.is_refunded === true || item.is_refunded === 1;
  const status = item.return_request_status ?? null;

  if (isRefunded || approved === true || approved === 1) return 'approved';
  if (approved === false || approved === 0) return 'rejected';
  if (status == null) return 'pending';
  return status === 'refunded' ? 'approved' : status;
}

/** A refund contract of the analytics endpoint, shaped like an order row (used for KPI counting). */
export function mapAnalyticsRefundContractToOrderRow(item) {
  if (!item) return null;

  const approved = item.management_approval?.approved ?? item.admin_confirmed ?? null;
  const paymentAmount = item.payment_amount ?? item.amount_payment ?? null;
  const contractUuid = item.contract_uuid ?? item.order_number ?? item.uuid ?? null;
  const mobile = item.customer_mobile ?? item.user_mobile ?? '';

  return {
    id: item.contract_id ?? item.id,
    uuid: contractUuid,
    contract_uuid: contractUuid,
    user_mobile: mobile,
    customer_mobile: mobile,
    customer_name: item.customer_name ?? null,
    contract_type: item.contract_type ?? MISSING,
    contract_type_key: item.contract_type_key ?? null,
    instrument_type: item.instrument_type ?? null,
    amount_payment: paymentAmount,
    is_paid: paymentAmount != null && paymentAmount !== '',
    payment_label_ar: item.payment_label_ar ?? null,
    refund_amount: item.refund_amount,
    is_refunded: item.is_refunded,
    customer_refunded: item.is_refunded,
    refunded: item.is_refunded,
    refunded_status: item.refunded_status ?? null,
    return_request_status: resolveReturnRequestStatusFromRefund(item, approved),
    employee_name: item.requester?.name ?? item.employee_name ?? MISSING,
    requester: item.requester ?? null,
    user_id: item.user_id ?? item.customer_id ?? item.user?.id ?? null,
    user: item.user ?? null,
    admin_confirmed: approved,
    management_approval: item.management_approval ?? null,
    refund_id: item.id,
    refundable_contract_id: item.id,
    draft_contract_number: item.draft_contract_number ?? null,
    contract_id: item.contract_id ?? null,
    notes: item.notes ?? null,
    status: item.contract_status ?? { id: item.contract_status_id, name: item.contract_status_name },
    contract_status_id: item.contract_status_id ?? null,
    contract_status_name: item.contract_status_name ?? null,
    is_return_order: item.is_return_order === true,
    has_draft_contract: item.has_draft_contract === true,
    created_at: item.created_at ?? null,
    raw: item,
  };
}
