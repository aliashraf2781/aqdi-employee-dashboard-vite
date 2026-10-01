const PAYMENT_BASE_URL = 'https://aqdi.sa/pay';

export function buildOrderPaymentUrl(uuid) {
  const id = String(uuid ?? '').trim();
  return id ? `${PAYMENT_BASE_URL}/${id}` : '';
}

/** Ready-made SMS / WhatsApp texts offered in the order actions menu. */
export function getOrderSmsTemplates(uuid) {
  const id = String(uuid ?? '').trim() || '—';
  const payUrl = buildOrderPaymentUrl(id);

  return [
    {
      id: 'pay_reminder',
      label: 'تذكير بسداد رسوم التوثيق',
      body: `مرحبًا، نذكركم بسداد رسوم توثيق العقد رقم ${id} لإتمام التوثيق في إيجار. رابط الدفع: ${payUrl}`,
    },
    {
      id: 'missing_doc',
      label: 'طلب إرفاق مستند ناقص',
      body: `مرحبًا، لإكمال طلبكم رقم ${id} نحتاج إرفاق المستند الناقص. يمكنكم الرفع من نفس رابط الطلب.`,
    },
    {
      id: 'draft_ready',
      label: 'مسودة العقد جاهزة للمراجعة',
      body: `مرحبًا، مسودة عقدكم رقم ${id} جاهزة للمراجعة. بعد موافقتكم يمكنكم إتمام الدفع مباشرة.`,
    },
  ];
}
