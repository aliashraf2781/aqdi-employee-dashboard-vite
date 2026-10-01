/** The message the employee sends to the customer after the admin approved the refund. */
export function buildRefundApprovedCustomerMessage(refund) {
  const amount = refund?.refundAmount ?? '—';
  const reference = refund?.referenceNumber ?? '—';
  const orderNumber = refund?.orderUuid ?? '—';

  return `عميلنا العزيز،

نود إبلاغكم بأنه تم استرجاع المبلغ بنجاح
المبلغ: ${amount}
الرقم المرجعي: ${reference}
رقم الطلب: ${orderNumber}

شكراً لتفهمكم.`;
}
