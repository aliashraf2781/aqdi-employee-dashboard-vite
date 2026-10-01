const DEFAULT_PER_PAGE = 20;

/** Query params for GET /admin/orders. Empty values are left out. */
export function buildAdminOrdersParams({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
  search,
  contractStatusId,
  statusId,
  isCompleted,
  isReceived,
  employeeId,
  contractType,
  userId,
} = {}) {
  const params = { page, per_page: perPage };
  const hasValue = (value) => value != null && value !== '';
  const resolvedStatusId = hasValue(statusId) ? statusId : contractStatusId;

  if (search) params.search = search;
  if (hasValue(resolvedStatusId)) params.status_id = resolvedStatusId;

  if (isCompleted === 1 || isCompleted === '1') params.complete = 1;
  else if (isCompleted === 0 || isCompleted === '0') params.incomplete = 1;

  if ([true, false, 'true', 'false'].includes(isReceived)) params.is_received = isReceived;
  if (hasValue(employeeId)) params.employee_id = employeeId;
  if (contractType) params.contract_type = contractType;
  if (hasValue(userId)) params.user_id = userId;

  return params;
}

/** The three shapes the list endpoint answers with, reduced to one. */
export function extractOrdersPayload(body) {
  const payload = body?.data ?? body;
  const items = payload?.items ?? payload?.data?.items;
  return {
    items: Array.isArray(items) ? items : [],
    pagination: payload?.pagination ?? payload?.data?.pagination ?? null,
    summary: payload?.summary ?? payload?.data?.summary ?? null,
  };
}
