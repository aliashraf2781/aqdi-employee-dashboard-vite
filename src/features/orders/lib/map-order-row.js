import { isDraftOrderRow } from './draft-order';

/** "housing" | "commercial" | "" from the several fields the API may use. */
export function getContractTypeKey(row = {}) {
  const explicit = row.contract_type_key;
  if (explicit === 'housing' || explicit === 'commercial') return explicit;
  if (explicit === 'residential') return 'housing';

  const type = String(row.contract_type ?? row.contract_type_trans ?? '').trim().toLowerCase();
  if (type.includes('سكن') || type === 'housing' || type === 'residential') return 'housing';
  if (type.includes('تجار') || type === 'commercial') return 'commercial';
  return '';
}

export function getWaitingMinutes(row = {}, now = Date.now()) {
  if (row.waiting_minutes != null && row.waiting_minutes !== '') {
    const parsed = Number(row.waiting_minutes);
    if (Number.isFinite(parsed)) return Math.max(0, parsed);
  }

  const timestamp = row.created_at || row.updated_at;
  if (!timestamp) return 0;
  const minutes = Math.floor((now - new Date(timestamp).getTime()) / 60000);
  return Number.isFinite(minutes) ? Math.max(0, minutes) : 0;
}

function resolveStatusId(row) {
  return row.status?.id ?? row.contract_status_id ?? row.status_id;
}

function resolveStatusName(row, fallback) {
  return row.status?.name || row.contract_status_name || row.status_name || fallback;
}

/** A row of the "new requests" strip on the realtime-orders screen. */
export function mapNewOrderRow(row = {}) {
  const isDraft = isDraftOrderRow(row);
  return {
    ...row,
    contract_type_key: getContractTypeKey(row),
    status_kind: isDraft ? 'draft' : 'new',
    status_label: isDraft ? 'طلب مسودة' : 'طلب جديد',
    waiting_minutes: getWaitingMinutes(row),
    status_id: resolveStatusId(row),
    status_name: resolveStatusName(row, 'جديد'),
  };
}

/** A row of the orders table: flattens the nested objects the table columns read. */
export function mapTableOrderRow(row = {}) {
  return {
    ...row,
    contract_type_key: getContractTypeKey(row),
    is_draft: isDraftOrderRow(row),
    user_mobile: row.user_mobile || row.user?.mobile || row.phone,
    instrument_type: row.instrument_type_trans || row.instrument_type || row.document_type || row.track || null,
    employee_name: row.employee_name || row.employee?.name,
    received_at: row.received_at || row.updated_at || row.created_at,
    status_id: resolveStatusId(row),
    status_name: resolveStatusName(row, '---'),
    status_color: row.status?.color || row.contract_status_color || row.status_color,
    status_color_text: row.status?.color_text || row.contract_status_color_text || row.status_color_text,
  };
}
