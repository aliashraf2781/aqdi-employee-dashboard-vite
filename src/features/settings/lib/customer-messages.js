/** Splits the `/admin/customer-messages/all` response into the parts the screens need. */
export function parseCustomerMessagesAll(body) {
  const data = body?.data ?? body;
  return {
    audiences: data?.audiences ?? [],
    messages: data?.messages ?? [],
  };
}

export function getMessagesByType(messages, type) {
  return messages.filter((message) => message.type === type);
}

/** Sections (each with its `items`) that belong to one audience type. */
export function getAudienceSections(audiences, type) {
  return audiences.find((audience) => audience.type === type)?.sections ?? [];
}

/** `{ id, name_ar, name_en }` list -> `<select>` options. */
export function toSelectOptions(records) {
  return records.map((record) => ({ value: String(record.id), label: record.name_ar || record.name_en || '—' }));
}
