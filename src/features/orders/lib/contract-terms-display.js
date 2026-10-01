import { getOrderFinancialStep } from './order-detail-steps';
import { pick } from './pick';

/**
 * Normalize selected tenant roles for contract display.
 * Prefers tenant_roles_details (with values), then ids + values/names.
 */
export function resolveTenantRoleDetails(orderData, tenantRoles = []) {
  const financial = getOrderFinancialStep(orderData);

  const details = pick(
    orderData?.tenant_roles_details,
    financial.tenant_roles_details
  );
  if (Array.isArray(details) && details.length > 0) {
    return details.map((item) => ({
      id: item?.id ?? null,
      label:
        item?.text_of_reason ||
        item?.name ||
        (item?.id != null ? String(item.id) : '—'),
      value:
        item?.value !== undefined && item?.value !== null && item?.value !== ''
          ? String(item.value)
          : null,
      inputLabel: item?.input_field_label || null,
      hasUserInput: Boolean(item?.has_user_input),
    }));
  }

  const valuesRaw = pick(
    orderData?.tenant_role_values,
    financial.tenant_role_values
  );
  const values =
    valuesRaw && typeof valuesRaw === 'object' && !Array.isArray(valuesRaw)
      ? valuesRaw
      : {};

  const ids = pick(orderData?.tenant_role_ids, financial.tenant_role_ids);
  const names = pick(
    orderData?.tenant_role_names,
    financial.tenant_role_names
  );

  if (Array.isArray(ids) && ids.length > 0) {
    return ids.map((id, index) => {
      const role = tenantRoles.find((item) => String(item?.id) === String(id));
      const nameFromList =
        Array.isArray(names) && names[index] != null && names[index] !== ''
          ? String(names[index])
          : null;
      const value = values[String(id)] ?? values[id] ?? null;
      return {
        id,
        label:
          nameFromList ||
          role?.text_of_reason ||
          role?.name ||
          String(id),
        value: value !== undefined && value !== null && value !== ''
          ? String(value)
          : null,
        inputLabel: role?.input_field_label || null,
        hasUserInput: Boolean(role?.has_user_input),
      };
    });
  }

  if (Array.isArray(names) && names.length > 0) {
    return names.map((name) => ({
      id: null,
      label: String(name),
      value: null,
      inputLabel: null,
      hasUserInput: false,
    }));
  }

  const legacyId = pick(orderData?.tenant_role_id, financial.tenant_role_id);
  if (legacyId != null && legacyId !== '') {
    const role = tenantRoles.find(
      (item) => String(item?.id) === String(legacyId)
    );
    return [
      {
        id: legacyId,
        label:
          orderData?.tenant_role?.text_of_reason ||
          orderData?.tenant_role?.name ||
          financial?.tenant_role?.text_of_reason ||
          financial?.tenant_role?.name ||
          orderData?.relation_labels?.tenant_role ||
          role?.text_of_reason ||
          role?.name ||
          String(legacyId),
        value: null,
        inputLabel: null,
        hasUserInput: false,
      },
    ];
  }

  return [];
}

/** Resolve other-conditions list for display. */
export function resolveOtherConditionsList(orderData) {
  const financial = getOrderFinancialStep(orderData);
  const list = pick(
    orderData?.other_conditions_list,
    financial.other_conditions_list
  );
  if (Array.isArray(list) && list.length > 0) {
    return list
      .map((item) => (item == null ? '' : String(item).trim()))
      .filter(Boolean);
  }
  const legacy = pick(
    orderData?.other_conditions,
    financial.other_conditions
  );
  if (legacy != null && String(legacy).trim() !== '') {
    return [String(legacy).trim()];
  }
  return [];
}
