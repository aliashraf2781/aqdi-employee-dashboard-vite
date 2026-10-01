import { getInstrumentTypeLabel } from '../instrument-types';
import { fileNameFromUrl, resolveImageUrl } from '../national-address';
import { getOrderDeedStep, getOrderOwnerStep, pickAgentRelatedField } from '../order-detail-steps';
import { pick } from '../pick';
import { calendarTypeLabel, composePartsDob } from './labels';
import { mapDeedAttachment } from './list-mappers';
import { mapEndowmentNazirView, mapLegalAgentView } from './parties';

/** Extra deed documents, each looked up under every place the API may put it. */
function mapExtraAttachments({ orderData, summary, deed }) {
  const agentField = (key) => pickAgentRelatedField(orderData, key);
  return [
    mapDeedAttachment(
      pick(
        summary.Image_inheritance_certificate,
        deed.Image_inheritance_certificate,
        agentField('Image_inheritance_certificate'),
        orderData.Image_inheritance_certificate,
      ),
      'شهادة حصر الإرث',
    ),
    mapDeedAttachment(
      pick(
        summary.copy_power_of_attorney_from_heirs_to_agent,
        deed.copy_power_of_attorney_from_heirs_to_agent,
        agentField('copy_power_of_attorney_from_heirs_to_agent'),
        orderData.copy_power_of_attorney_from_heirs_to_agent,
      ),
      'توكيل الورثة للوكيل',
    ),
    mapDeedAttachment(
      pick(
        agentField('copy_of_the_authorization_or_agency'),
        deed.copy_of_the_authorization_or_agency,
        orderData.copy_of_the_authorization_or_agency,
      ),
      'صورة التفويض / الوكالة',
    ),
    mapDeedAttachment(
      pick(
        deed.copy_of_the_endowment_registration_certificate,
        agentField('copy_of_the_endowment_registration_certificate'),
        orderData.copy_of_the_endowment_registration_certificate,
      ),
      'شهادة تسجيل الوقف',
    ),
    mapDeedAttachment(
      pick(
        deed.copy_of_the_trusteeship_deed,
        agentField('copy_of_the_trusteeship_deed'),
        orderData.copy_of_the_trusteeship_deed,
      ),
      'صك النظارة',
    ),
    mapDeedAttachment(
      pick(
        deed.copy_of_guardians_power_of_attorney_for_agent,
        agentField('copy_of_guardians_power_of_attorney_for_agent'),
        orderData.copy_of_guardians_power_of_attorney_for_agent,
      ),
      'توكيل الأولياء للوكيل',
    ),
    mapDeedAttachment(pick(deed.image_instrument_from_the_back, orderData.image_instrument_from_the_back), 'صورة الصك (من الخلف)'),
  ].filter(Boolean);
}

function resolveInstrumentRaw({ orderData, summary, deed }) {
  return pick(
    summary.instrument_type_trans,
    deed.instrument_type_trans,
    orderData.instrument_type_trans,
    summary.instrument_type_label,
    deed.instrument_type_label,
    summary.instrument_type,
    deed.instrument_type,
    orderData.instrument_type,
    summary.instrument_type_key,
    deed.instrument_type_key,
    orderData.instrument_type_key,
  );
}

function composeInstrumentHistory(deed, orderData) {
  const full = pick(deed.instrument_history, orderData.instrument_history);
  if (full) return full;
  const composed = ['day', 'month', 'year']
    .map((part) => deed[`instrument_history_${part}`] ?? orderData[`instrument_history_${part}`])
    .filter((part) => part != null && part !== '')
    .join('-');
  return composed || null;
}

function resolveOwnerDob({ summary, owner, orderData }) {
  const full = pick(summary.property_owner_dob, owner.property_owner_dob, orderData.property_owner_dob);
  return full || composePartsDob(owner, 'property_owner_dob') || composePartsDob(orderData, 'property_owner_dob');
}

/** Owner and deed section: who owns the property and the deed documents. */
export function mapDeedView(orderData) {
  const summary = orderData.contract_summary ?? {};
  const deed = getOrderDeedStep(orderData);
  const owner = getOrderOwnerStep(orderData);
  const context = { orderData, summary, deed };

  const instrumentRaw = resolveInstrumentRaw(context);
  const deedUrl = resolveImageUrl(
    pick(
      summary.image_instrument,
      deed.image_instrument,
      orderData.image_instrument,
      summary.image_instrument_from_the_front,
      deed.image_instrument_from_the_front,
    ),
  );
  const instrumentKey = pick(summary.instrument_type_key, deed.instrument_type_key, orderData.instrument_type_key);
  const isLeaseRenewal = instrumentKey === 'lease_renewal';
  const fromDeedOrOrder = (key) => pick(deed[key], orderData[key]);

  return {
    type_label: getInstrumentTypeLabel(instrumentRaw),
    number: pick(summary.instrument_number, deed.instrument_number, orderData.instrument_number, summary.deed_number),
    owner_id: pick(summary.property_owner_id_num, owner.property_owner_id_num, orderData.property_owner_id_num),
    owner_phone: pick(summary.property_owner_mobile, owner.property_owner_mobile, orderData.property_owner_mobile),
    owner_name: pick(summary.name_owner, owner.name_owner, orderData.name_owner),
    owner_iban: pick(summary.property_owner_iban, owner.property_owner_iban, orderData.property_owner_iban),
    owner_dob: resolveOwnerDob({ summary, owner, orderData }),
    owner_dob_type: calendarTypeLabel(
      pick(summary.type_dob_property_owner, owner.type_dob_property_owner, orderData.type_dob_property_owner),
    ),
    file_url: deedUrl,
    file_name: fileNameFromUrl(deedUrl),
    file_label: isLeaseRenewal ? 'العقد المرغوب تجديده' : 'صورة الصك',
    attachments: mapExtraAttachments(context),
    is_lease_renewal: isLeaseRenewal,
    legal_agent: mapLegalAgentView(orderData),
    endowment_nazir: mapEndowmentNazirView(orderData),
    property_name: pick(
      deed.name_real_estate,
      orderData.name_real_estate,
      orderData.real_estate?.name_real_estate,
      orderData.real_estate?.name,
    ),
    property_type: pick(
      deed.property_type_name,
      orderData.property_type_name,
      orderData.relation_labels?.property_type,
      orderData.property_type?.name_ar,
      orderData.property_type?.name,
    ),
    property_usage: pick(
      deed.property_usages_name,
      orderData.property_usages_name,
      orderData.relation_labels?.property_usages,
      orderData.property_usages?.name_ar,
      orderData.property_usages?.name,
    ),
    contract_ownership: fromDeedOrOrder('contract_ownership'),
    registry_number: fromDeedOrOrder('real_estate_registry_number'),
    unit_number_of_real: fromDeedOrOrder('unit_number_of_real'),
    instrument_history: composeInstrumentHistory(deed, orderData),
    instrument_history_type: calendarTypeLabel(fromDeedOrOrder('type_instrument_history')),
    date_first_registration: fromDeedOrOrder('date_first_registration'),
    date_first_registration_type: calendarTypeLabel(fromDeedOrOrder('type_date_first_registration')),
    age_of_the_property: fromDeedOrOrder('age_of_the_property'),
    number_of_floors: fromDeedOrOrder('number_of_floors'),
    number_of_units_per_floor: fromDeedOrOrder('number_of_units_per_floor'),
    number_of_units_in_realestate: fromDeedOrOrder('number_of_units_in_realestate'),
  };
}

/** Label of the instrument (deed) type of the order. */
export function resolveInstrumentTypeLabel(orderData) {
  const summary = orderData.contract_summary ?? {};
  return getInstrumentTypeLabel(resolveInstrumentRaw({ orderData, summary, deed: getOrderDeedStep(orderData) }));
}
