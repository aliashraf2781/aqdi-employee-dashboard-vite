import { getOrderFinancialStep } from '../order-detail-steps';

export function readOtherConditionsList(orderData) {
  const financial = getOrderFinancialStep(orderData);
  const list = orderData?.other_conditions_list ?? financial.other_conditions_list;
  if (Array.isArray(list) && list.length > 0) {
    return list.map((item) => (item == null ? '' : String(item))).filter((item) => item.trim() !== '');
  }

  const legacy = orderData?.other_conditions ?? financial.other_conditions;
  if (legacy != null && String(legacy).trim() !== '') {
    return [String(legacy).trim()];
  }
  return [];
}

function readTenantRoleIds(orderData) {
  const financial = getOrderFinancialStep(orderData);
  const ids = orderData?.tenant_role_ids ?? financial.tenant_role_ids;
  if (Array.isArray(ids) && ids.length > 0) return ids;

  const details = orderData?.tenant_roles_details ?? financial.tenant_roles_details;
  if (Array.isArray(details) && details.length > 0) {
    return details.map((item) => item?.id).filter((id) => id != null);
  }

  const legacy = orderData?.tenant_role_id ?? financial.tenant_role_id;
  if (legacy != null && legacy !== '') return [legacy];
  return [];
}

function readTenantRoleValues(orderData) {
  const financial = getOrderFinancialStep(orderData);
  const raw = orderData?.tenant_role_values ?? financial.tenant_role_values;
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw;
  }

  const details = orderData?.tenant_roles_details ?? financial.tenant_roles_details;
  if (!Array.isArray(details)) return {};

  return Object.fromEntries(
    details
      .filter((item) => item?.id != null && item.value !== undefined && item.value !== null && item.value !== '')
      .map((item) => [String(item.id), String(item.value)])
  );
}

export function readFinancial(orderData, key) {
  const financial = getOrderFinancialStep(orderData);

  if (key === 'tenant_role_ids') return readTenantRoleIds(orderData);
  if (key === 'tenant_role_values') return readTenantRoleValues(orderData);
  if (key === 'tenant_roles') {
    const flag = financial[key] ?? orderData?.[key];
    if (flag !== undefined && flag !== null && flag !== '') return flag;
    return readTenantRoleIds(orderData).length > 0 ? 1 : 0;
  }
  if (key === 'other_conditions_list') return readOtherConditionsList(orderData);
  if (key === 'conditions') {
    if (readOtherConditionsList(orderData).length > 0) return 1;
    const flag = financial[key] ?? orderData?.[key];
    if (flag !== undefined && flag !== null && flag !== '') return flag;
    return 0;
  }
  if (key === 'contract_term_in_years') {
    return (
      financial.contract_term_in_years ??
      orderData?.contract_term_in_years ??
      financial.contract_period_id ??
      orderData?.contract_period_id
    );
  }
  if (key === 'payment_type_id') {
    return (
      financial.payment_type_id ??
      orderData?.payment_type_id ??
      orderData?.payment_type?.id ??
      financial.payment_type?.id
    );
  }
  return financial[key] ?? orderData?.[key];
}
