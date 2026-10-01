const sum = (items, selector) => items.reduce((total, item) => total + (selector(item) ?? 0), 0);

function average(items, selector) {
  const values = items.map(selector).filter((value) => typeof value === 'number');
  return values.length > 0 ? values.reduce((total, value) => total + value, 0) / values.length : null;
}

/** Value of one KPI card ("received", "completed", ...) on an employee row. */
export function cardValue(item, key) {
  return item.cards?.find((card) => card.key === key)?.value ?? 0;
}

/** Totals for the KPI row: the server summary wins, otherwise we add up the employee rows. */
export function summarizeEmployees(items, summary) {
  const total = (summaryKey, cardKey) => summary?.[summaryKey] ?? sum(items, (item) => cardValue(item, cardKey));

  return {
    count: items.length,
    received: total('received_total', 'received'),
    completed: total('completed_total', 'completed'),
    assigned: total('assigned_total', 'assigned'),
    returned: total('returned_total', 'returned'),
    late: total('late_over_24h_total', 'late_over_24h'),
    avgReceiveMinutes: summary?.avg_receive_work_minutes ?? average(items, (item) => item.avg_receive?.value),
    avgProcessMinutes: summary?.avg_process_minutes ?? average(items, (item) => item.avg_process?.value),
    revenue: summary?.revenue_sar_total ?? sum(items, (item) => item.revenue?.value),
  };
}
