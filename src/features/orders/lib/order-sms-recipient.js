const toPositiveId = (value) => {
  const numeric = Number(value);
  return value != null && value !== '' && Number.isFinite(numeric) && numeric > 0 ? numeric : null;
};

/** The customer's user id, from the several shapes of orders, refunds and contracts. */
export function resolveOrderSmsUserId(order) {
  if (!order) return null;
  const summary = order.contract_summary;

  const candidates = [
    order.user_id,
    order.userId,
    order.customer_id,
    order.customerId,
    order.customer_user_id,
    order.customerUserId,
    order.user?.id,
    order.user?.user_id,
    order.customer?.id,
    order.customer?.user_id,
    order.raw?.user_id,
    order.raw?.user?.id,
    order.raw?.customer_id,
    order.raw?.customer?.id,
    summary?.user_id,
    summary?.user?.id,
    order.contract?.user_id,
    order.contract?.user?.id,
    order.contract_paid?.user_id,
  ];

  for (const candidate of candidates) {
    const id = toPositiveId(candidate);
    if (id != null) return id;
  }
  return null;
}

/** The customer's phone number, from the several shapes of orders, refunds and contracts. */
export function resolveOrderSmsPhone(order) {
  if (!order) return '';
  const summary = order.contract_summary ?? {};

  const candidates = [
    order.user_mobile,
    order.customer_mobile,
    order.userMobile,
    order.customerMobile,
    order.user?.mobile,
    order.user?.phone,
    order.customer?.mobile,
    order.customer?.phone,
    order.phone,
    order.mobile,
    summary.property_owner_mobile,
    summary.user_mobile,
    summary.user?.mobile,
    summary.customer_mobile,
    order.raw?.customer_mobile,
    order.raw?.user_mobile,
    order.raw?.phone,
    order.raw?.mobile,
  ];

  const found = candidates.map((candidate) => (candidate == null ? '' : String(candidate).trim())).find(Boolean);
  return found ?? '';
}

/** Who the SMS goes to: the user id when known, otherwise the phone number; null when neither exists. */
export function resolveSmsRecipient(order) {
  const userId = resolveOrderSmsUserId(order);
  if (userId != null) return { user_id: userId };
  const phone = resolveOrderSmsPhone(order);
  return phone ? { mobile: phone } : null;
}
