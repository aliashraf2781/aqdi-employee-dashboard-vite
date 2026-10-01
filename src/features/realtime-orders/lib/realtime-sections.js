import { ALL_ORDERS_FILTER_PILLS, buildAdminOrdersParams } from '@/features/orders';
import { PERMISSION_SECTIONS } from '@/features/permissions';

/** Title shown on the section header when one of the quick filters is opened. */
const SECTION_TITLES = {
  authenticated: 'موثق في إيجار',
  canceled: 'ملغي',
  returned: 'مسترجع',
  incomplete: 'طلب غير مكتمل',
};

/** The quick filters of the realtime screen. Each one opens a "section" (an archive of orders in that state). */
export const REALTIME_SECTIONS = ALL_ORDERS_FILTER_PILLS.map((pill) => ({ ...pill, sectionTitle: SECTION_TITLES[pill.id] }));

export const SECTION_NOTE = 'صفحة مستقلة — الطلبات المؤرشفة بهذه الحالة';

/** Permission section that must be viewable to see each quick filter. */
const SECTION_PERMISSIONS = {
  authenticated: PERMISSION_SECTIONS.request_classification,
  canceled: PERMISSION_SECTIONS.request_classification,
  returned: PERMISSION_SECTIONS.returned_request,
  incomplete: PERMISSION_SECTIONS.incomplete_request,
};

export function getSectionPermission(sectionId) {
  return SECTION_PERMISSIONS[sectionId];
}

export function findSection(sectionId) {
  return REALTIME_SECTIONS.find((section) => section.id === sectionId) ?? null;
}

const hasValue = (value) => value != null && value !== '';

/** Which contract status the list is filtered by. A chosen status chip always wins over a section. */
export function resolveStatusId({ activeSection, extraStatusId, statusIds, canViewReceivedQueue }) {
  if (hasValue(extraStatusId)) return extraStatusId;
  if (activeSection === 'canceled') return statusIds.canceled;
  if (activeSection === 'returned') return statusIds.returned;

  const isCompletionSection = activeSection === 'authenticated' || activeSection === 'incomplete';
  if (isCompletionSection || !canViewReceivedQueue) return undefined;
  return statusIds.received;
}

/** Query params of GET /admin/orders for the table of the realtime screen. */
export function buildRealtimeListParams({ activeSection, extraStatusId, contractType, search, page, perPage, statusIds, canViewReceivedQueue }) {
  let isCompleted;
  if (activeSection === 'authenticated') isCompleted = 1;
  else if (activeSection === 'incomplete') isCompleted = 0;

  return buildAdminOrdersParams({
    page,
    perPage,
    search,
    isCompleted,
    statusId: resolveStatusId({ activeSection, extraStatusId, statusIds, canViewReceivedQueue }),
    contractType: contractType || undefined,
  });
}
