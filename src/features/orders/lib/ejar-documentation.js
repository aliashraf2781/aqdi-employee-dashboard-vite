const DOCUMENTED_STATUS_NAME = 'تم التوثيق';

/** The "documented in Ejar" status among the contract statuses. */
export function findDocumentedStatus(statuses = []) {
  return statuses.find((status) => String(status?.name ?? status?.label ?? '').includes(DOCUMENTED_STATUS_NAME));
}

export function resolveCurrentStatusId(orderData) {
  return (
    orderData?.contract_summary?.contract_status_id ?? orderData?.contract_status_id ?? orderData?.status_id ?? orderData?.status?.id
  );
}
