/**
 * Shapes a table row or a single-order payload into what the return-request
 * dialog expects (id, uuid, payment, status and refund fields at the top level).
 */
export function normalizeOrderForReturnRequest(order, orderId) {
  if (!order) return { id: orderId, contract_id: orderId };
  const summary = order.contract_summary ?? {};

  // Table rows already carry top-level fields.
  if (order.uuid || order.user_mobile) {
    const hasStatusParts = order.contract_status_name || order.contract_status_id;
    return {
      ...order,
      contract_id: order.contract_id ?? order.id ?? orderId,
      id: order.id ?? orderId,
      is_paid: order.is_paid ?? summary.is_paid,
      payment_status: order.payment_status ?? summary.payment_status,
      has_return_request: order.has_return_request ?? summary.has_return_request,
      return_request_status: order.return_request_status ?? summary.return_request_status ?? null,
      refund_contract_id: order.refund_contract_id ?? summary.refund_contract_id ?? null,
      status:
        order.status ??
        (hasStatusParts
          ? {
              id: order.contract_status_id,
              name: order.contract_status_name,
              color: order.contract_status_color,
            }
          : undefined),
    };
  }

  // Single-order payloads keep most fields under contract_summary.
  return {
    id: order.id ?? summary.id ?? orderId,
    contract_id: summary.id ?? order.contract_id ?? orderId,
    uuid: order.uuid ?? summary.uuid,
    user_mobile: order.user?.mobile ?? order.user_mobile,
    contract_type: summary.contract_type ?? order.contract_type,
    contract_type_key: summary.contract_type_key ?? order.contract_type_key,
    is_paid: summary.is_paid ?? order.is_paid,
    amount_payment: summary.amount_payment ?? order.amount_payment,
    payment_label_ar: summary.payment_label_ar ?? order.payment_label_ar,
    updated_at: order.updated_at ?? summary.updated_at,
    created_at: order.created_at ?? summary.created_at,
    employee_name: summary.employee_name ?? order.employee_name,
    status: summary.status ??
      order.status ?? {
        id: summary.contract_status_id ?? order.contract_status_id,
        name: summary.contract_status_name,
        color: summary.contract_status_color,
      },
    return_contract: order.return_contract ?? summary.return_contract,
    has_return_request: order.has_return_request ?? summary.has_return_request,
    return_request_status: order.return_request_status ?? summary.return_request_status ?? null,
    refund_contract_id: order.refund_contract_id ?? summary.refund_contract_id ?? null,
    customer_refunded: order.customer_refunded,
    refund_id: order.refund_id,
    refundable_contract_id: order.refundable_contract_id,
    refundable_contract: order.refundable_contract,
    refund: order.refund,
    refundable_contracts: order.refundable_contracts,
    is_refunded: order.is_refunded,
    refunded: order.refunded,
  };
}
