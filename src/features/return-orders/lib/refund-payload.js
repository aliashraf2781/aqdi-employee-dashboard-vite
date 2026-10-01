/** Readers for the GET /admin/analytics/refunds/contracts response. */

/** The list of refund contracts, whichever of the known response shapes the API used. */
export function extractRefundItemsFromApi(root) {
  if (!root) return [];
  if (Array.isArray(root)) return root;

  const payload = root.data ?? root;
  const candidates = [payload, payload?.contracts, payload?.items, root.contracts, root.items];
  return candidates.find(Array.isArray) ?? [];
}

/** Items, pagination and the global summary block of one page of the refunds endpoint. */
export function extractRefundsContractsPayload(root) {
  const payload = root?.data ?? root ?? {};
  const summary = payload.summary ?? {};

  return {
    contracts: extractRefundItemsFromApi(root),
    pagination: payload.pagination ?? root?.pagination ?? null,
    summary,
    managementApproval: summary.management_approval ?? payload.management_approval ?? null,
  };
}

const PENDING_KEYS = ['pending', 'waiting', 'unconfirmed', 'in_review', 'under_review', 'null'];
const APPROVED_KEYS = ['approved', 'confirmed', 'accepted', 'approved_count'];
const REJECTED_KEYS = ['rejected', 'not_approved', 'declined', 'refused', 'denied'];
// Older backends split "approved" into these; they all count as approved now.
const LEGACY_APPROVED_KEYS = [
  ['refunded', 'is_refunded', 'customer_refunded', 'completed', 'done'],
  ['processing', 'in_progress', 'pending_refund', 'awaiting_refund'],
];

function readCount(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value);
  }
  return 0;
}

/** `{ pending, approved, rejected }` from `summary.management_approval`, tolerant of old key names. */
export function parseManagementApprovalCounts(summary) {
  const source = summary?.management_approval ?? summary?.managementApproval ?? summary ?? {};
  const legacyApproved = LEGACY_APPROVED_KEYS.reduce((sum, keys) => sum + readCount(source, keys), 0);

  return {
    pending: readCount(source, PENDING_KEYS),
    approved: readCount(source, APPROVED_KEYS) + legacyApproved,
    rejected: readCount(source, REJECTED_KEYS),
  };
}
