import { pick } from '../pick';
import { isNonEmptyObject } from './grouped-steps';
import { getOrderAddressStep, getOrderOwnerStep } from './step-buckets';

function isTruthyFlag(value) {
  return value === true || value === 1 || value === '1';
}

function bucketHasMeaningfulValue(bucket = {}) {
  return Object.values(bucket).some((value) => value != null && value !== '');
}

/**
 * Top-level `legal_agent` (also mirrored on step2 / step3).
 * Always present in the new API; values are null when there is no agent.
 */
export function getOrderLegalAgent(orderData = {}) {
  if (isNonEmptyObject(orderData.legal_agent)) return orderData.legal_agent;
  if (isNonEmptyObject(orderData.step3?.legal_agent)) return orderData.step3.legal_agent;
  if (isNonEmptyObject(orderData.step2?.legal_agent)) return orderData.step2.legal_agent;
  return orderData.legal_agent ?? {};
}

/**
 * Top-level `endowment_nazir` (also mirrored on step2 / step3).
 */
export function getOrderEndowmentNazir(orderData = {}) {
  if (isNonEmptyObject(orderData.endowment_nazir)) return orderData.endowment_nazir;
  if (isNonEmptyObject(orderData.step3?.endowment_nazir)) {
    return orderData.step3.endowment_nazir;
  }
  if (isNonEmptyObject(orderData.step2?.endowment_nazir)) {
    return orderData.step2.endowment_nazir;
  }
  return orderData.endowment_nazir ?? {};
}

/** Prefer legal_agent / endowment_nazir / owner / address / summary / root. */
export function pickAgentRelatedField(orderData, key) {
  const legalAgent = getOrderLegalAgent(orderData);
  const nazir = getOrderEndowmentNazir(orderData);
  const owner = getOrderOwnerStep(orderData);
  const address = getOrderAddressStep(orderData);
  const summary = orderData.contract_summary ?? {};
  return pick(
    legalAgent?.[key],
    nazir?.[key],
    owner?.[key],
    address?.[key],
    summary?.[key],
    orderData?.[key]
  );
}

export function hasLegalAgent(orderData = {}) {
  const agent = getOrderLegalAgent(orderData);
  const flag = pickAgentRelatedField(orderData, 'add_legal_agent_of_owner');
  if (isTruthyFlag(flag)) return true;
  return Boolean(
    pick(
      agent.id_num_of_property_owner_agent,
      agent.mobile_of_property_owner_agent,
      agent.copy_of_the_authorization_or_agency,
      agent.agency_number_in_instrument_of_property_owner
    )
  );
}

export function hasEndowmentNazir(orderData = {}) {
  const nazir = getOrderEndowmentNazir(orderData);
  if (!bucketHasMeaningfulValue(nazir)) {
    return Boolean(
      pickAgentRelatedField(orderData, 'copy_of_the_endowment_registration_certificate') ||
        pickAgentRelatedField(orderData, 'copy_of_the_trusteeship_deed')
    );
  }
  return Boolean(
    pick(
      nazir.copy_of_the_endowment_registration_certificate,
      nazir.copy_of_the_trusteeship_deed,
      nazir.copy_of_guardians_power_of_attorney_for_agent,
      nazir.id_num_of_property_owner_agent,
      nazir.mobile_of_property_owner_agent,
      nazir.copy_of_the_authorization_or_agency
    )
  );
}
