/** "إرسال مسودة العقد لكم عبر واتساب" status: sends the draft contract through WhatsApp. */
export const SEND_CONTRACT_DRAFT_STATUS_ID = 8;
export const SEND_CONTRACT_DRAFT_STATUS_NAME = 'إرسال مسودة العقد لكم عبر واتساب';

/** The backend field name is misspelled; keep this exact key. */
export const ACCEPT_RETURN_CONTRACT_FIELD = 'accept_retrun_contract';

export function isSendContractDraftStatus(status) {
  const id = status?.id ?? status?.status_id;
  if (id != null && String(id) === String(SEND_CONTRACT_DRAFT_STATUS_ID)) return true;
  return String(status?.name ?? status?.label ?? '').trim() === SEND_CONTRACT_DRAFT_STATUS_NAME;
}

/** Every identifier the API might accept for this order, without duplicates. */
export function collectOrderIdentifierCandidates(order, orderId) {
  const candidates = [
    order?.uuid,
    order?.orderUuid,
    order?.order_uuid,
    orderId,
    order?.id,
    order?.contract_id,
    order?.contractId,
    order?.order_id,
    order?.orderId,
    order?.contract_summary?.uuid,
    order?.contract_summary?.id,
  ];

  return candidates.filter((value, index, all) => {
    if (value == null || value === '') return false;
    return all.findIndex((other) => String(other) === String(value)) === index;
  });
}

/**
 * Body for POST /admin/orders/{id}/status.
 * Extra keys come from status_case.fields (deed_type, ejar_contract_number, ...).
 * A file field turns the body into FormData.
 */
export function buildOrderStatusPayload(statusId, fields = [], values = {}) {
  const hasFile = fields.some((field) => field?.type === 'file' && values?.[field.name] instanceof File);
  const filledFields = fields.filter((field) => {
    const value = values?.[field.name];
    return value != null && value !== '';
  });

  if (hasFile) {
    const formData = new FormData();
    formData.append('status_id', String(statusId));
    filledFields.forEach((field) => {
      const value = values[field.name];
      formData.append(field.name, value instanceof File ? value : String(value));
    });
    return formData;
  }

  const payload = { status_id: statusId };
  filledFields.forEach((field) => {
    payload[field.name] = values[field.name];
  });
  return payload;
}

/** Extra fields a status asks for before it can be applied (status_case.fields). */
export function getStatusCaseFields(status) {
  const fields = status?.status_case?.fields;
  return Array.isArray(fields) ? fields : [];
}

export function statusRequiresExtraFields(status) {
  return getStatusCaseFields(status).length > 0;
}

/** Normalizes a status coming from the menu or the API list into one shape. */
export function normalizeMenuStatus(status) {
  return {
    id: status.id,
    name: status.name ?? status.label,
    label: status.label ?? status.name,
    color: status.color,
    status_case: status.status_case ?? null,
  };
}
