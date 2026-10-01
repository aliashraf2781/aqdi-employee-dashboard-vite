const DRAFT_FLAGS = ['is_draft', 'is_draft_contract', 'is_draft_order', 'from_draft'];
const DRAFT_TEXT_FIELDS = [
  'order_type', 'type', 'source', 'category',
  'contract_status_name', 'status_name', 'instrument_type_key', 'instrument_type',
];

function isTruthyFlag(value) {
  return value === true || value === 1 || value === '1';
}

function textLooksLikeDraft(value) {
  const text = String(value ?? '').trim().toLowerCase();
  return text.includes('draft') || text.includes('مسود');
}

function hasDraftStatusReference(source) {
  return Boolean(
    source.draft_contract_status_id ||
      source.draft_contract_status?.id ||
      source.draft_contract_status_name ||
      source.draft_contract_status?.name,
  );
}

function sourceLooksLikeDraft(source) {
  if (!source || typeof source !== 'object') return false;
  if (DRAFT_FLAGS.some((flag) => isTruthyFlag(source[flag]))) return true;
  if (hasDraftStatusReference(source)) return true;
  if (textLooksLikeDraft(source.status?.name)) return true;
  return DRAFT_TEXT_FIELDS.some((field) => textLooksLikeDraft(source[field]));
}

/** Detects draft contracts in order lists, looking at the row and its `contract_summary`. */
export function isDraftOrderRow(row) {
  if (!row) return false;
  return [row, row.contract_summary].some(sourceLooksLikeDraft);
}
