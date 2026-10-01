/** Refundable-contract row id from the different nested order/refund payload shapes. */
export function extractRefundContractId(source) {
  if (!source) return null;

  const summary = source.contract_summary ?? {};
  const firstOf = (list) => (Array.isArray(list) ? list[0] : null);
  const nested =
    source.refundable_contract ??
    source.refund ??
    summary.refundable_contract ??
    summary.refund ??
    firstOf(source.refundable_contracts) ??
    firstOf(summary.refundable_contracts);

  const candidates = [
    source._resolvedRefundContractId,
    source.refund_id,
    source.refundable_contract_id,
    source.refundable_contracts_id,
    source.refund_contract_id,
    source.refundable_contract?.id,
    source.refund?.id,
    nested?.id,
    summary.refundable_contract_id,
    summary.refund_id,
    firstOf(source.refundable_contracts)?.id,
  ];

  const found = candidates.find((id) => id != null && id !== '');
  if (found != null) return found;

  const isPrimitive = (value) => typeof value === 'number' || typeof value === 'string';
  return isPrimitive(source.refundable_contract) ? source.refundable_contract : null;
}

/** Order uuid used in POST /admin/analytics/refunds/contracts/{uuid}. */
export function getOrderUuid(order) {
  if (!order) return null;
  return (
    order.uuid ??
    order.contract_uuid ??
    order.contract_summary?.uuid ??
    order.contract?.uuid ??
    order.order_uuid ??
    order.order_number ??
    null
  );
}

export function getRefundItemActionKey(item) {
  if (!item) return null;
  const contract = item.contract ?? {};
  return contract.uuid ?? item.contract_uuid ?? item.uuid ?? item.order_number ?? null;
}

/** Id sent as `contract_id` when raising a return request. */
export function resolveRefundableContractId(order, orderId) {
  return order?.uuid ?? order?.contract_summary?.uuid ?? orderId ?? order?.id ?? order?.contract_id ?? null;
}

/**
 * Admin decision on a refund: true = approved, false = rejected, null = still pending.
 * `management_approval` is authoritative when present; `approved: null` means pending
 * and must not fall back to a stale `admin_confirmed`.
 */
export function getOrderAdminApprovalStatus(order) {
  const nested =
    order?.refundable_contract ??
    order?.refund ??
    (Array.isArray(order?.refundable_contracts) ? order.refundable_contracts[0] : null);

  const managementApproval = order?.management_approval ?? nested?.management_approval ?? null;
  if (managementApproval && typeof managementApproval === 'object' && 'approved' in managementApproval) {
    return managementApproval.approved ?? null;
  }

  return (
    nested?.admin_confirmed ??
    order?.admin_confirmed ??
    order?.accept_retrun_contract ??
    order?.accept_return_contract ??
    null
  );
}
