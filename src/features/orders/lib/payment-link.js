function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

const isTruthyFlag = (value) => value === true || value === 1;

/** Returns the first value that is not null/undefined, looking at root, `data` and `record` in that order. */
function pickField(layers, ...names) {
  for (const layer of layers) {
    for (const name of names) {
      if (layer[name] != null) return layer[name];
    }
  }
  return null;
}

/**
 * Payment-gateway payloads may put payment fields on the root and/or under
 * `data` / `record`. Reads each field from whichever level has it.
 */
export function normalizePaymentLinkPayload(body, { fallbackUuid } = {}) {
  const root = asObject(body);
  const nested = asObject(root.data);
  const record = asObject(nested.record ?? root.record);
  const layers = [root, nested, record];

  const alreadyPaid =
    root.already_paid === true ||
    nested.already_paid === true ||
    layers.some((layer) => isTruthyFlag(layer.is_paid));

  return {
    paymentUrl: pickField(layers, 'payment_url', 'Payment_url'),
    alreadyPaid,
    message: pickField(layers, 'message'),
    contractUuid: pickField(layers, 'contract_uuid') ?? fallbackUuid ?? null,
    contractId: root.contract_id ?? nested.contract_id ?? record.id ?? null,
    cartAmount: pickField(layers, 'cart_amount') ?? record.amount ?? null,
    payment: pickField(layers, 'payment'),
    paymentSuccessUrl: root.payment_success_url ?? nested.payment_success_url ?? null,
    paymentErrorUrl: root.payment_error_url ?? nested.payment_error_url ?? null,
    isPaid: alreadyPaid,
    success: root.success === true || root.success === 1 || nested.success === true,
  };
}

/** Throws when the gateway answered without a link and the contract is not already paid. */
export function assertPaymentLinkResult(result, response) {
  if (result.alreadyPaid || result.paymentUrl) return result;

  const error = new Error(response?.data?.gateway_error || response?.data?.message || 'لم يتم إرجاع رابط الدفع');
  error.response = response;
  throw error;
}

/** What the "payment link created" dialog needs from a create-payment-link response. */
export function extractPaymentFromResponse(body) {
  const normalized = normalizePaymentLinkPayload(body);
  return {
    paymentUrl: normalized.paymentUrl,
    alreadyPaid: normalized.alreadyPaid,
    message: normalized.message,
    cartAmount: normalized.cartAmount,
    contractUuid: normalized.contractUuid,
    payment: normalized.payment,
  };
}
