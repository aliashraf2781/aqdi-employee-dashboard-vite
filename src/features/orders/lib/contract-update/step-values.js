import { isPlaceholderCoordinate } from '../national-address';
import { normalizeFieldValue } from './field-normalize';
import { getOrderAddressStep, getOrderDeedStep, getOrderOwnerStep, pickAgentRelatedField } from '../order-detail-steps';
import { readFinancial } from './financial-readers';
import { CONTRACT_STEP_KEYS } from './step-keys';
import { readTenant, readUnitsAlias } from './tenant-unit-readers';

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
