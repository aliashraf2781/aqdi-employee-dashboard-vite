import { isPlaceholderCoordinate } from '../national-address';
import { normalizeFieldValue } from './field-normalize';
import {
  getOrderAddressStep,
  getOrderDeedStep,
  getOrderFinancialStep,
  getOrderOwnerStep,
  getOrderTenantStep,
  getOrderUnits,
  getOrderUnitsStep,
  pickAgentRelatedField,
} from '../order-detail-steps';
import { CONTRACT_STEP_KEYS } from './step-keys';

function firstUnit(orderData) {
  const units = getOrderUnits(orderData);
  return units[0] ?? {};
}

function readUnitsAlias(orderData, key) {
  const step = getOrderUnitsStep(orderData);
  const unit = step.unit ?? firstUnit(orderData);
  if (key === 'unit_number') {
    return step.unit_number ?? unit.unit_number ?? orderData?.unit_number;
  }
  if (key === 'floor_number') {
    return step.floor_number ?? unit.floor_number ?? orderData?.floor_number;
  }
  if (key === 'unit_area') {
    return step.unit_area ?? unit.unit_area ?? orderData?.unit_area;
  }
  return step[key] ?? unit[key] ?? orderData?.[key];
}

function readTenant(orderData, key) {
  const bucket = getOrderTenantStep(orderData);
  if (key === 'id_num_of_property_tenant_agent') {
    return (
      bucket.id_num_of_property_tenant_agent ??
      bucket.id_number_of_property_tenant_agent ??
      orderData?.id_num_of_property_tenant_agent ??
      orderData?.id_number_of_property_tenant_agent
    );
  }
  if (
    key === 'dob_of_property_tenant_agent_day' ||
    key === 'dobof_property_tenant_agent_day'
  ) {
    return (
      bucket.dob_of_property_tenant_agent_day ??
      bucket.dobof_property_tenant_agent_day ??
      orderData?.dob_of_property_tenant_agent_day ??
      orderData?.dobof_property_tenant_agent_day
    );
  }
  if (
    key === 'dob_of_property_tenant_agent_month' ||
    key === 'dobof_property_tenant_agent_month'
  ) {
    return (
      bucket.dob_of_property_tenant_agent_month ??
      bucket.dobof_property_tenant_agent_month ??
      orderData?.dob_of_property_tenant_agent_month ??
      orderData?.dobof_property_tenant_agent_month
    );
  }
  if (
    key === 'dob_of_property_tenant_agent_year' ||
    key === 'dobof_property_tenant_agent_year'
  ) {
    return (
      bucket.dob_of_property_tenant_agent_year ??
      bucket.dobof_property_tenant_agent_year ??
      orderData?.dob_of_property_tenant_agent_year ??
      orderData?.dobof_property_tenant_agent_year
    );
  }
  return bucket[key] ?? orderData?.[key];
}

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

function readFinancial(orderData, key) {
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

function composeDateParts(bucket, baseKey) {
  if (!bucket) return null;
  const full = bucket[baseKey];
  if (full != null && full !== '') return full;
  const composed = [bucket[`${baseKey}_day`], bucket[`${baseKey}_month`], bucket[`${baseKey}_year`]]
    .filter((part) => part != null && part !== '')
    .join('-');
  return composed || null;
}

function readValue(orderData, step, key) {
  if (step === 'summary') {
    const owner = getOrderOwnerStep(orderData);
    const deed = getOrderDeedStep(orderData);
    return (
      orderData?.contract_summary?.[key] ??
      pickAgentRelatedField(orderData, key) ??
      owner[key] ??
      deed[key] ??
      orderData?.[key]
    );
  }
  if (step === 'step1') {
    const deed = getOrderDeedStep(orderData);
    if (key === 'instrument_history') {
      return (
        composeDateParts(deed, 'instrument_history') ??
        composeDateParts(orderData, 'instrument_history')
      );
    }
    if (key === 'date_first_registration') {
      return (
        composeDateParts(deed, 'date_first_registration') ??
        composeDateParts(orderData, 'date_first_registration')
      );
    }
    if (key === 'name_real_estate') {
      return (
        deed.name_real_estate ??
        orderData?.name_real_estate ??
        orderData?.real_estate?.name_real_estate ??
        orderData?.real_estate?.name ??
        null
      );
    }
    if (key === 'property_type_id') {
      return (
        deed.property_type_id ??
        orderData?.property_type_id ??
        orderData?.property_type?.id ??
        null
      );
    }
    if (key === 'property_usages_id') {
      return (
        deed.property_usages_id ??
        orderData?.property_usages_id ??
        orderData?.property_usages?.id ??
        null
      );
    }
    return (
      deed[key] ??
      pickAgentRelatedField(orderData, key) ??
      orderData?.contract_summary?.[key] ??
      orderData?.[key]
    );
  }
  if (step === 'step2') {
    const address = getOrderAddressStep(orderData);
    return address[key] ?? pickAgentRelatedField(orderData, key) ?? orderData?.[key];
  }
  if (step === 'step3') {
    const owner = getOrderOwnerStep(orderData);
    return (
      owner[key] ??
      pickAgentRelatedField(orderData, key) ??
      orderData?.contract_summary?.[key] ??
      orderData?.[key]
    );
  }
  if (step === 'step4') return readTenant(orderData, key);
  if (step === 'step5') return readUnitsAlias(orderData, key);
  if (step === 'step6') return readFinancial(orderData, key);
  return undefined;
}

const TENANT_AGENT_DETAIL_KEYS = [
  'id_num_of_property_tenant_agent',
  'mobile_of_property_tenant_agent',
  'type_dob_tenant_agent',
  'dob_of_property_tenant_agent',
];

function hasFilledValue(value) {
  if (value == null) return false;
  return String(value).trim() !== '';
}

function hasTenantAgentDetails(values) {
  return TENANT_AGENT_DETAIL_KEYS.some((key) => hasFilledValue(values?.[key]));
}

const OWNER_AGENT_DETAIL_KEYS = [
  'id_num_of_property_owner_agent',
  'mobile_of_property_owner_agent',
  'type_dob_property_owner_agent',
  'dob_of_property_owner_agent',
  'agency_number_in_instrument_of_property_owner',
  'copy_of_the_authorization_or_agency',
];

function hasOwnerAgentDetails(values) {
  return OWNER_AGENT_DETAIL_KEYS.some((key) => hasFilledValue(values?.[key]));
}

export function getStepFormValues(orderData, step) {
  const keys = CONTRACT_STEP_KEYS[step] ?? [];
  const values = Object.fromEntries(
    keys.map((key) => [key, normalizeFieldValue(readValue(orderData, step, key), key)])
  );

  // Agent identity is stored even when the yes/no flag is null. Treat any
  // saved agent detail as 'there is a legal representative'.
  if (step === 'step4' && hasTenantAgentDetails(values)) {
    values.is_there_a_legal_representative_of_the_tenant = 1;
  }

  if (step === 'step3' && hasOwnerAgentDetails(values)) {
    values.add_legal_agent_of_owner = 1;
  }

  // The API stores central Riyadh (24.7136, 46.6753) when no pin was saved.
  if (
    step === 'step2' &&
    isPlaceholderCoordinate(Number(values.latitude), Number(values.longitude))
  ) {
    values.latitude = '';
    values.longitude = '';
  }

  return values;
}
