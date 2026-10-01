function buildIdLabel(order) {
  if (order?.uuid) return `#${order.uuid}`;
  if (order?.id != null) return `#${order.id}`;
  return '';
}

/** Turns an unreceived order from the API into a row of the "recent activity" list. */
export function mapOrderToActivity(order, hrefBase) {
  return {
    id: order?.id ?? order?.uuid,
    title: order?.contract_type ? `طلب ${order.contract_type} جديد` : 'طلب جديد بانتظار الاستلام',
    subtitle: [buildIdLabel(order), 'بانتظار الاستلام'].filter(Boolean).join(' · '),
    href: order?.id != null ? `${hrefBase}/${order.id}` : null,
    createdAt: order?.created_at || order?.updated_at || null,
  };
}
