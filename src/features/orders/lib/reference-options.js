/** The several shapes a "list of reference items" endpoint answers with, reduced to an array. */
export function normalizeListResponse(body) {
  const candidates = [body?.items, body?.data?.items, body?.data, body];
  return candidates.find(Array.isArray) ?? [];
}

export function getReferenceLabel(item = {}) {
  return item.name_trans || item.name_ar || item.name || item.name_en || (item.id != null ? String(item.id) : '—');
}

/** Select options ({ value, label }) for reference items. */
export function mapReferenceToOptions(items = [], getLabel = getReferenceLabel) {
  return items
    .filter((item) => item?.id != null)
    .map((item) => ({ value: String(item.id), label: String(getLabel(item)).trim() || String(item.id) }));
}

export function getCityRegionId(city = {}) {
  return city.region_id ?? city.regions?.id ?? city.region?.id ?? null;
}

export function mapCitiesToOptions(cities = []) {
  return cities
    .filter((city) => city?.id != null)
    .map((city) => {
      const regionId = getCityRegionId(city);
      return {
        value: String(city.id),
        label: String(getReferenceLabel(city)).trim() || String(city.id),
        regionId: regionId != null ? String(regionId) : null,
      };
    });
}

export function getTenantRoleLabel(role = {}) {
  return role.text_of_reason ?? role.name ?? role.label ?? role.title ?? (role.id != null ? String(role.id) : '—');
}

export function mapTenantRolesToOptions(roles = []) {
  return roles
    .filter((role) => role?.id != null)
    .map((role) => ({ value: String(role.id), label: String(getTenantRoleLabel(role)).trim() || String(role.id) }));
}

export function extractTenantRoles(body) {
  const candidates = [body?.data, body?.data?.data, body?.items, body];
  return candidates.find(Array.isArray) ?? [];
}
