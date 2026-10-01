/**
 * Admin GET /admin/orders/:id step buckets.
 *
 * Current API (aligned with frontend contract steps):
 *   start, step1=deed, step2=address, step3=owner,
 *   step4=tenant, step5=units, step6=financial, contract_summary,
 *   legal_agent, endowment_nazir (also mirrored on step2/step3)
 *
 * Legacy dashboard shape (still accepted for reads):
 *   step1=address, step2=units, step3=tenant, step4=financial
 *   (owner / deed lived on contract_summary + root)
 */

import { pick } from '../pick';

export function isNonEmptyObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0;
}

function looksLikeTenant(bucket) {
  return Boolean(
    bucket &&
      (bucket.tenant_entity != null ||
        bucket.tenant_id_num != null ||
        bucket.tenant_mobile != null ||
        bucket.tenant_entity_unified_registry_number != null)
  );
}

function looksLikeAddress(bucket) {
  return Boolean(
    bucket &&
      (bucket.neighborhood != null ||
        bucket.street != null ||
        bucket.property_city_id != null ||
        bucket.property_place_id != null ||
        bucket.address_url != null ||
        bucket.image_address != null ||
        bucket.latitude != null ||
        bucket.longitude != null ||
        bucket.building_number != null)
  );
}

function looksLikeDeed(bucket) {
  return Boolean(
    bucket &&
      (bucket.instrument_type != null ||
        bucket.instrument_type_key != null ||
        bucket.image_instrument != null ||
        bucket.instrument_number != null ||
        bucket.image_instrument_from_the_front != null)
  );
}

function looksLikeOwner(bucket) {
  return Boolean(
    bucket &&
      (bucket.property_owner_id_num != null ||
        bucket.property_owner_mobile != null ||
        bucket.type_dob_property_owner != null ||
        bucket.property_owner_dob_day != null ||
        bucket.name_owner != null)
  );
}

function looksLikeUnits(bucket) {
  return Boolean(
    bucket &&
      (Array.isArray(bucket.units) ||
        bucket.unit_type_id != null ||
        bucket.unit_number != null ||
        bucket.unit_area != null ||
        bucket.unit != null)
  );
}

/** True when the payload uses the grouped admin steps (1=deed … 6=financial). */
export function usesGroupedAdminSteps(orderData = {}) {
  if (isNonEmptyObject(orderData.step6)) return true;
  if (isNonEmptyObject(orderData.step5)) return true;
  if (isNonEmptyObject(orderData.start)) return true;
  if (looksLikeTenant(orderData.step4)) return true;
  if (looksLikeOwner(orderData.step3) && !looksLikeTenant(orderData.step3)) return true;
  if (looksLikeAddress(orderData.step2) && !looksLikeUnits(orderData.step2)) return true;
  if (looksLikeDeed(orderData.step1) && !looksLikeAddress(orderData.step1)) return true;
  return false;
}

/** UI 'سكني' / legacy `residential` → API `housing`. */
export function normalizeContractTypeKey(value) {
  if (value == null || value === '') return null;
  const raw = String(value).trim();
  const lower = raw.toLowerCase();
  if (lower === 'housing' || lower === 'residential' || raw === 'سكني') return 'housing';
  if (lower === 'commercial' || raw === 'تجاري') return 'commercial';
  return raw;
}

export function resolveOrderContractTypeKey(orderData = {}) {
  return normalizeContractTypeKey(
    pick(
      orderData.contract_type_key,
      orderData.contract_summary?.contract_type_key,
      orderData.start?.contract_type,
      orderData.contract_type,
      orderData.contract_summary?.contract_type,
      orderData.step6?.contract_type,
      orderData.step5?.contract_type,
      orderData.step4?.contract_type
    )
  );
}

export function getOrderStart(orderData = {}) {
  return orderData.start ?? {};
}
