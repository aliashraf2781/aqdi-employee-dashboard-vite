function isTruthyFlag(value) {
  return value === true || value === 1 || value === '1';
}

function textLooksLikeDraft(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return text.includes('draft') || text.includes('مسود');
}

function hasDraftMarkers(source) {
  const flags = [source.is_draft, source.is_draft_contract, source.is_draft_order, source.from_draft];
  if (flags.some(isTruthyFlag)) return true;

  const labels = [
    source.order_type,
    source.type,
    source.source,
    source.category,
    source.status?.name,
    source.contract_status_name,
    source.status_name,
    source.instrument_type_key,
    source.instrument_type,
  ];
  if (labels.some(textLooksLikeDraft)) return true;

  return Boolean(
    source.draft_contract_status_id ||
      source.draft_contract_status?.id ||
      source.draft_contract_status_name ||
      source.draft_contract_status?.name,
  );
}

/** Detects draft-contract rows in mixed order lists and related contracts. */
export function isDraftOrderRow(row) {
  if (!row) return false;
  return [row, row.contract_summary].some((source) => source && typeof source === 'object' && hasDraftMarkers(source));
}

export function getDraftOrderStatusLabel(row = {}) {
  return (
    row.draft_contract_status?.name ??
    row.draft_contract_status_name ??
    row.status?.name ??
    row.contract_status_name ??
    '—'
  );
}

export function getDraftOrderStatusColor(row = {}) {
  return row.draft_contract_status?.color ?? row.draft_contract_status_color ?? row.status?.color;
}

export function getDraftOrderStatusTextColor(row = {}) {
  return row.draft_contract_status?.color_text ?? row.draft_contract_status_color_text ?? row.status?.color_text;
}

/** Draft status of an order detail payload (the fields live on the order or its summary). */
export function getOrderDraftStatusFromDetail(orderData = {}) {
  const summary = orderData.contract_summary ?? {};
  const merged = { ...summary, ...orderData };
  return {
    id:
      orderData.draft_contract_status_id ??
      orderData.draft_contract_status?.id ??
      summary.draft_contract_status_id ??
      summary.draft_contract_status?.id ??
      null,
    name: getDraftOrderStatusLabel(merged),
    color: getDraftOrderStatusColor(merged),
    colorText: getDraftOrderStatusTextColor(merged),
  };
}

export function getOrderDraftContractNumber(orderData = {}) {
  return orderData.draft_contract_number ?? orderData.contract_summary?.draft_contract_number ?? '';
}
