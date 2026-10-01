import { APPLIES_TO_OPTIONS, DISCOUNT_TYPES } from '@/features/clients/lib/client-discount';
import { unwrapData } from '@/features/clients/lib/unwrap-data';

/** `GET /admin/users/{id}/coupons` is documented only in Postman: accept a bare array or an `{ items: [] }` page. */
export function normalizeCouponListResponse(response) {
  const payload = unwrapData(response);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export function isCouponActive(coupon = {}) {
  if (coupon.deactivated_at) return false;
  if (typeof coupon.is_active === 'boolean') return coupon.is_active;
  if (coupon.is_active != null) return coupon.is_active === 1 || coupon.is_active === '1';
  if (coupon.status != null) return String(coupon.status).toLowerCase() === 'active';
  return true;
}

export function findActiveCoupon(coupons = []) {
  return coupons.find(isCouponActive) ?? null;
}

export function formatDiscountValue(coupon = {}) {
  const type = coupon.type_coupon ?? coupon.type;
  const value = coupon.value_coupon ?? coupon.value ?? 0;
  return type === DISCOUNT_TYPES.FIXED ? `${value} ر.س` : `${value}%`;
}

export function getAppliesToLabel(coupon = {}) {
  const option = APPLIES_TO_OPTIONS.find((candidate) => candidate.value === coupon.applies_to);
  return option?.label ?? APPLIES_TO_OPTIONS[0].label;
}

/** Active coupons first, then most-recently-created first within each group. */
export function sortCouponsForDisplay(coupons = []) {
  return [...coupons].sort((a, b) => {
    const activeDiff = Number(isCouponActive(b)) - Number(isCouponActive(a));
    if (activeDiff !== 0) return activeDiff;
    return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
  });
}
