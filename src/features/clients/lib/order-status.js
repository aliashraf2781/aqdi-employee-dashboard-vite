/**
 * Buckets a client's contract into one of the filter tabs of the orders table.
 * The API has no canonical status enum, so this relies on the same Arabic
 * substrings the orders screens use.
 */

export const ORDER_FILTER_TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'completed', label: 'مكتمل' },
  { id: 'draft', label: 'مسودة' },
  { id: 'returned', label: 'مسترجع' },
  { id: 'canceled', label: 'ملغي' },
  { id: 'processing', label: 'قيد المعالجة' },
];

const RETURNED_PATTERN = /مسترجع|استرجاع/;
const CANCELED_PATTERN = /ملغ/;

function isTruthyFlag(value) {
  return value === true || value === 1 || value === '1';
}

function textLooksLikeDraft(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return text.includes('draft') || text.includes('مسود');
}

const DRAFT_FLAG_FIELDS = ['is_draft', 'is_draft_contract', 'is_draft_order', 'from_draft'];
const DRAFT_TEXT_FIELDS = [
  'order_type',
  'type',
  'source',
  'category',
  'contract_status_name',
  'status_name',
  'instrument_type_key',
  'instrument_type',
];

function hasDraftMarkers(item) {
  if (!item || typeof item !== 'object') return false;
  if (DRAFT_FLAG_FIELDS.some((field) => isTruthyFlag(item[field]))) return true;
  if (DRAFT_TEXT_FIELDS.some((field) => textLooksLikeDraft(item[field]))) return true;
  if (textLooksLikeDraft(item.status?.name)) return true;
  return Boolean(
    item.draft_contract_status_id ||
      item.draft_contract_status?.id ||
      item.draft_contract_status_name ||
      item.draft_contract_status?.name,
  );
}

/** Detects draft-contract rows in mixed order lists, on the row or its `contract_summary`. */
export function isDraftOrderRow(row) {
  if (!row) return false;
  return hasDraftMarkers(row) || hasDraftMarkers(row.contract_summary);
}

export function classifyOrderStatus(order = {}) {
  const statusName = order?.status?.name || order?.status_name || '';
  if (order?.return_contract === true || RETURNED_PATTERN.test(statusName)) return 'returned';
  if (CANCELED_PATTERN.test(statusName)) return 'canceled';
  if (isDraftOrderRow(order)) return 'draft';
  if (order?.is_completed) return 'completed';
  return 'processing';
}

/** Adds the bucket to every order so the table can filter and count by it. */
export function withStatusKeys(orders = []) {
  return orders.map((order) => ({ ...order, statusKey: classifyOrderStatus(order) }));
}

export function countOrdersByStatus(orders) {
  const counts = { all: orders.length };
  for (const tab of ORDER_FILTER_TABS) {
    if (tab.id !== 'all') counts[tab.id] = orders.filter((order) => order.statusKey === tab.id).length;
  }
  return counts;
}
