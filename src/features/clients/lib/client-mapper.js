import { unwrapData } from '@/features/clients/lib/unwrap-data';

const SUMMARY_LABELS = {
  total_customers: 'إجمالي العملاء',
  website_customers: 'عملاء الموقع',
  google_play_customers: 'جوجل بلاي',
  apple_store_customers: 'آبل',
  banned: 'الموقوفون',
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/** A count may arrive as a number, a numeric string, or the list itself. */
function countValue(value, arrayFallback) {
  if (Array.isArray(value)) return value.length;
  if (value == null || value === '') return Array.isArray(arrayFallback) ? arrayFallback.length : 0;
  const count = Number(value);
  return Number.isFinite(count) ? count : 0;
}

/** Turns true/1/"1" and false/0/"0" into a boolean; anything else is "unknown" (null). */
function flagValue(value) {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  return null;
}

function buildSummaryLabels(summary) {
  return Object.fromEntries(
    Object.keys(SUMMARY_LABELS).map((key) => [key, summary[`${key}_label`] || SUMMARY_LABELS[key]]),
  );
}

/**
 * `{ data: { summary, items, pagination } }` from `GET /admin/users`.
 * Items are newest first.
 */
export function normalizeClientsListResponse(response) {
  const payload = unwrapData(response);
  const items = asArray(payload?.items);
  const pagination = payload?.pagination ?? {};
  const summary = payload?.summary ?? null;

  return {
    items,
    summary: summary ? { ...summary, labels: buildSummaryLabels(summary) } : null,
    meta: {
      currentPage: pagination.current_page ?? 1,
      lastPage: pagination.last_page ?? 1,
      total: pagination.total ?? items.length,
      perPage: pagination.per_page ?? items.length,
    },
  };
}

/** Maps a raw users row to the shape the client screens use. */
export function mapUserToClientRow(user = {}) {
  const paid = Number(user.paid ?? user.total_paid_amount) || 0;
  const refunded = Number(user.refunded ?? user.refunded_amount) || 0;
  const active = flagValue(user.is_active ?? user.status);

  return {
    id: user.id,
    clientCode: user.customer_number || (user.id != null ? `C-${user.id}` : '—'),
    name: user.full_name || user.name || '—',
    mobile: user.mobile || user.phone || '—',
    email: user.email || null,
    photo: user.photo_path || null,
    joinedAt: user.joined_at || user.created_at || null,
    platform: user.platform || null,
    platformLabel: user.platform_label || null,
    verified: flagValue(user.verified),
    isActive: active !== false,
    completed: user.completed_orders_count ?? user.completed ?? 0,
    draft: user.draft_orders_count ?? user.draft ?? 0,
    incomplete: user.incomplete_orders_count ?? user.uncompleted_orders_count ?? 0,
    properties: countValue(user.properties_count ?? user.real_estate_count, user.real_estates ?? user.real_estates_list),
    units: countValue(user.units_count, user.units ?? user.units_list),
    refundedAmount: refunded,
    paid,
    net: Number(user.net ?? user.net_amount ?? paid - refunded) || 0,
    blocked: Boolean(user.is_banned),
    contracts: asArray(user.contracts),
  };
}
