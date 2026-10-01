/** Permission section keys (match API `section_key` / `permission_matrix` keys). */
export const PERMISSION_SECTIONS = {
  analytics: 'analytics',
  operating_expenses: 'operating_expenses',
  finance_expenses: 'finance_expenses',
  all_requests: 'all_requests',
  completed_request: 'completed_request',
  incomplete_request: 'incomplete_request',
  completed_whatsapp_request: 'completed_whatsapp_request',
  incomplete_whatsapp_request: 'incomplete_whatsapp_request',
  returned_request: 'returned_request',
  request_classification: 'request_classification',
  roles: 'roles',
  permissions: 'permissions',
  employees: 'employees',
  employee_salaries: 'employee_salaries',
  employee_kpis: 'employee_kpis',
  users: 'users',
  notifications: 'notifications',
  payments: 'payments',
  contract_payments: 'contract_payments',
  regions: 'regions',
  cities: 'cities',
  real_estates: 'real_estates',
  property_reference: 'property_reference',
  tenant_roles: 'tenant_roles',
  contract_statuses: 'contract_statuses',
  draft_contract_statuses: 'draft_contract_statuses',
  contract_periods: 'contract_periods',
  services_pricing: 'services_pricing',
  contract_whatsapp: 'contract_whatsapp',
  instrument_settings: 'instrument_settings',
  coupons: 'coupons',
  blogs: 'blogs',
  ads: 'ads',
  faqs: 'faqs',
  paperworks: 'paperworks',
  popup_contracts: 'popup_contracts',
  instruction_sections: 'instruction_sections',
  message_alerts: 'message_alerts',
  app_content: 'app_content',
  payment_messages: 'payment_messages',
  settings: 'settings',
  sms: 'sms',
  seo_crawl: 'seo_crawl',
  website_images: 'website_images',
};

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete', 'retrieve'];

function matrixToPermissionNames(matrix) {
  if (!matrix || typeof matrix !== 'object') return [];

  return Object.entries(matrix).flatMap(([section, actions]) => {
    if (!Array.isArray(actions)) return [];
    return actions.map((action) => `${section}.${action}`);
  });
}

function extractNamesFromList(list) {
  if (!Array.isArray(list)) return [];

  return list
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item?.name) return item.name;
      if (item?.section && item?.action) return `${item.section}.${item.action}`;
      return null;
    })
    .filter(Boolean);
}

/**
 * Normalize a login/refresh/profile payload (or a role payload) into `section.action` strings.
 * `permissions` and `permission_names` are the same list from the API — prefer `permissions`,
 * fall back to `permission_names`, then derive from `permission_matrix`. Whichever source has
 * data wins outright (no merging across sources) so a fresh login/refresh always fully replaces
 * what was previously known, never adds to it.
 *
 * Also unwraps a nested `data.user` when the whole login `data` blob was stored as `user`
 * (legacy login shape: `{ token, user: { ... } }`).
 */
export function resolveAuthUser(user) {
  if (!user) return null;
  const nested = user.user;
  if (
    nested &&
    typeof nested === 'object' &&
    user.is_system_admin == null &&
    !user.permissions &&
    !user.permission_names &&
    !user.permission_matrix &&
    (user.token || user.refresh_token || user.role_id == null)
  ) {
    return nested;
  }
  return user;
}

export function normalizeUserPermissions(user) {
  const source = resolveAuthUser(user);
  if (!source) return [];

  const fromPermissions = extractNamesFromList(source.permissions);
  if (fromPermissions.length > 0) return fromPermissions;

  const fromNames = extractNamesFromList(source.permission_names);
  if (fromNames.length > 0) return fromNames;

  return matrixToPermissionNames(source.permission_matrix);
}

/** `is_system_admin` from the API is the only thing allowed to grant blanket access — never role name/title. */
export function isSuperAdmin(user) {
  return resolveAuthUser(user)?.is_system_admin === true;
}

export function hasPermission(permissions, section, action = 'view') {
  if (!section) return true;
  const key = `${section}.${action}`;
  return permissions.includes(key) || permissions.includes(`${section}.*`);
}

/** `section` may be a single section key or an array of section keys (ANY-of / OR semantics). */
export function canAccess(permissions, user, section, action = 'view') {
  if (isSuperAdmin(user)) return true;
  if (Array.isArray(section)) return section.some((s) => hasPermission(permissions, s, action));
  return hasPermission(permissions, section, action);
}

/** True if the user has ANY of the given actions on one section (e.g. show an actions column if edit OR delete is granted). */
export function canAccessAny(permissions, user, section, actions = []) {
  return actions.some((action) => canAccess(permissions, user, section, action));
}

/**
 * ANY-of section groups. A page or nav item is allowed when the user has `view`
 * on at least one section of its group.
 */
const S = PERMISSION_SECTIONS;

export const SECTION_GROUPS = {
  orders: [
    S.all_requests,
    S.completed_request,
    S.incomplete_request,
    S.request_classification,
    S.completed_whatsapp_request,
    S.incomplete_whatsapp_request,
  ],
  realtimeOrders: [
    S.all_requests,
    S.completed_request,
    S.incomplete_request,
    S.request_classification,
    S.completed_whatsapp_request,
    S.incomplete_whatsapp_request,
    S.returned_request,
  ],
  rolesAndEmployees: [S.employees, S.roles, S.employee_salaries, S.employee_kpis],
  marketing: [S.analytics, S.blogs, S.seo_crawl, S.app_content, S.website_images, S.faqs],
  content: [S.app_content, S.website_images],
};

export function extractPermissionsFromRole(roleResponse) {
  const roleData = roleResponse?.data ?? roleResponse;
  if (!roleData) return [];

  return normalizeUserPermissions(roleData);
}
