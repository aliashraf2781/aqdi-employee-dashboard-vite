import { AlertCircle, Ban, CheckCircle2, Undo2 } from 'lucide-react';
import { PERMISSION_SECTIONS } from '@/features/permissions';

/** Quick filter buttons of the all-orders screen. `tone` picks the active color. */
export const ALL_ORDERS_FILTER_PILLS = [
  { id: 'authenticated', label: 'موثق', Icon: CheckCircle2, tone: 'success' },
  { id: 'canceled', label: 'ملغي', Icon: Ban, tone: 'danger' },
  { id: 'returned', label: 'مسترجع', Icon: Undo2, tone: 'refunded' },
  { id: 'incomplete', label: 'طلب غير مكتمل', Icon: AlertCircle, tone: 'warning' },
];

/** "Completed or not" pills exclude each other. */
export const COMPLETION_FILTERS = ['authenticated', 'incomplete'];
/** Status pills (a contract status) exclude each other. */
export const STATUS_PILLS = ['canceled', 'returned'];

export const CONTRACT_TYPE_OPTIONS = [
  { value: 'housing', label: 'سكني' },
  { value: 'commercial', label: 'تجاري' },
];

/** Permission section that must be viewable to see each pill. */
export const PILL_PERMISSIONS = {
  authenticated: PERMISSION_SECTIONS.request_classification,
  canceled: PERMISSION_SECTIONS.request_classification,
  returned: PERMISSION_SECTIONS.returned_request,
  incomplete: PERMISSION_SECTIONS.incomplete_request,
};

/** New list of active pill ids after the user clicks `id`. */
export function toggleFilterPill(activeFilters, id) {
  if (activeFilters.includes(id)) return activeFilters.filter((item) => item !== id);

  let next = activeFilters;
  if (COMPLETION_FILTERS.includes(id)) next = next.filter((item) => !COMPLETION_FILTERS.includes(item));
  if (STATUS_PILLS.includes(id)) next = next.filter((item) => !STATUS_PILLS.includes(item));
  return [...next, id];
}

/** Query-params input for GET /admin/orders from the filter state. */
export function resolveListFilters({ activeFilters, extraStatusId, canceledStatusId, returnedStatusId }) {
  const hasExtraStatus = extraStatusId != null && extraStatusId !== '';

  let isCompleted;
  if (activeFilters.includes('authenticated')) isCompleted = 1;
  else if (activeFilters.includes('incomplete')) isCompleted = 0;

  let statusId;
  if (hasExtraStatus) statusId = extraStatusId;
  else if (activeFilters.includes('canceled')) statusId = canceledStatusId;
  else if (activeFilters.includes('returned')) statusId = returnedStatusId;

  return { isCompleted, statusId };
}
