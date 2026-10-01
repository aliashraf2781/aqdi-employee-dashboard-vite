import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';

/** What the current user may do on the order screens (list, details, status changes). */
export function useOrdersPermissions() {
  const { can, isAdmin } = usePermissions();
  const allowed = (section, action) => isAdmin || can(section, action);

  const canViewAny = (sections) => isAdmin || sections.some((section) => can(section, 'view'));

  return {
    isAdmin,
    can,
    canChangeStatus:
      allowed(PERMISSION_SECTIONS.request_classification, 'edit') || allowed(PERMISSION_SECTIONS.all_requests, 'edit'),
    canAddStatus: allowed(PERMISSION_SECTIONS.contract_statuses, 'create'),
    canEditStatus: allowed(PERMISSION_SECTIONS.contract_statuses, 'edit'),
    canAddStatusFromOrder: allowed(PERMISSION_SECTIONS.request_classification, 'create'),
    canExport: canViewAny([
      PERMISSION_SECTIONS.all_requests,
      PERMISSION_SECTIONS.completed_request,
      PERMISSION_SECTIONS.incomplete_request,
      PERMISSION_SECTIONS.request_classification,
      PERMISSION_SECTIONS.returned_request,
    ]),
    canReturn: allowed(PERMISSION_SECTIONS.returned_request, 'create') || allowed(PERMISSION_SECTIONS.returned_request, 'edit'),
  };
}
