import { pick } from '../pick';
import { usesGroupedAdminSteps } from './grouped-steps';

export function getOrderDeedStep(orderData = {}) {
  if (usesGroupedAdminSteps(orderData)) {
    return orderData.step1 ?? {};
  }
  return orderData.contract_summary ?? {};
}

export function getOrderAddressStep(orderData = {}) {
  if (usesGroupedAdminSteps(orderData)) {
    return orderData.step2 ?? {};
  }
  return orderData.step1 ?? {};
}

export function getOrderOwnerStep(orderData = {}) {
  if (usesGroupedAdminSteps(orderData)) {
    return orderData.step3 ?? {};
  }
  return orderData.contract_summary ?? {};
}

export function getOrderTenantStep(orderData = {}) {
  if (usesGroupedAdminSteps(orderData)) {
    return orderData.step4 ?? {};
  }
  return orderData.step3 ?? {};
}

export function getOrderUnitsStep(orderData = {}) {
  if (usesGroupedAdminSteps(orderData)) {
    return orderData.step5 ?? {};
  }
  return orderData.step2 ?? {};
}

export function getOrderFinancialStep(orderData = {}) {
  if (usesGroupedAdminSteps(orderData)) {
    return orderData.step6 ?? {};
  }
  return orderData.step4 ?? {};
}

/** Units list: prefer root `units`, then step5.units, then legacy step2. */
export function getOrderUnits(orderData = {}) {
  if (Array.isArray(orderData.units) && orderData.units.length > 0) {
    return orderData.units;
  }
  const step5 = orderData.step5 ?? {};
  if (Array.isArray(step5.units) && step5.units.length > 0) {
    return step5.units;
  }
  if (!usesGroupedAdminSteps(orderData)) {
    const step2 = orderData.step2 ?? {};
    if (Array.isArray(step2.units) && step2.units.length > 0) {
      return step2.units;
    }
  }
  return Array.isArray(orderData.units) ? orderData.units : [];
}

export function getOrderUnitsCount(orderData = {}) {
  const units = getOrderUnits(orderData);
  return pick(
    orderData.units_count,
    orderData.step5?.units_count,
    orderData.step2?.units_count,
    units.length
  );
}

/** Read a key from a step bucket, then root (empty → null). */
export function pickOrderField(orderData, bucket, key, ...fallbacks) {
  return pick(bucket?.[key], orderData?.[key], ...fallbacks);
}
