import {
  getOrderAddressStep,
  getOrderDeedStep,
  getOrderFinancialStep,
  getOrderOwnerStep,
  getOrderTenantStep,
  getOrderUnits,
  getOrderUnitsStep,
  pickAgentRelatedField,
} from './order-detail-steps';

/** "label: value" lines of one section of the order, used when asking the client to fix a mistake. */

const ORDER_NUMBER_LABEL = 'رقم الطلب';

function describeTenantRoles(orderData, financial) {
  const details = orderData?.tenant_roles_details || financial.tenant_roles_details;
  if (Array.isArray(details) && details.length) {
    return details
      .map((item) => {
        const label = item?.text_of_reason || item?.name || '';
        return item?.value != null && item.value !== '' ? `${label} (${item.value})` : label;
      })
      .filter(Boolean)
      .join('، ');
  }
  const names = orderData?.tenant_role_names || financial.tenant_role_names;
  if (Array.isArray(names) && names.length) return names.join('، ');
  return orderData?.tenant_role?.text_of_reason || orderData?.tenant_role?.name || financial.tenant_role_id;
}

function describeOtherConditions(orderData, financial) {
  const list = orderData?.other_conditions_list || financial.other_conditions_list;
  if (Array.isArray(list) && list.length) return list.filter(Boolean).join('، ');
  return orderData?.other_conditions || financial.other_conditions || financial.text_additional_terms;
}

function describeContractTerm(financial) {
  const term = financial.contract_term_in_years;
  return typeof term === 'object' ? term?.name || term?.period : term;
}

function ownerFields({ summary, owner, address }) {
  return [
    { label: 'رقم الهوية', value: owner.property_owner_id_num ?? summary.property_owner_id_num },
    { label: 'تاريخ الميلاد', value: owner.property_owner_dob ?? summary.property_owner_dob },
    { label: 'رقم الجوال', value: owner.property_owner_mobile ?? summary.property_owner_mobile },
    { label: 'ايبان المالك', value: owner.property_owner_iban ?? summary.property_owner_iban },
    { label: 'المنطقة', value: summary.relation_labels?.property_region || address.property_place_name },
    { label: 'المدينة', value: summary.relation_labels?.property_city || address.city_name },
    { label: 'الحي', value: address.neighborhood ?? summary.neighborhood },
    { label: 'الشارع', value: address.street ?? summary.street },
  ];
}

function agentFields({ orderData, summary }) {
  const field = (key) => pickAgentRelatedField(orderData, key);
  return [
    { label: 'اسم الوكيل', value: summary.name_of_property_owner_agent ?? summary.property_owner_agent_name },
    { label: 'رقم الهوية', value: field('id_num_of_property_owner_agent') },
    { label: 'تاريخ الميلاد', value: field('dob_of_property_owner_agent') },
    { label: 'رقم الجوال', value: field('mobile_of_property_owner_agent') },
    { label: 'رقم الوكالة', value: field('agency_number_in_instrument_of_property_owner') },
  ];
}

function propertyAddressFields({ address }) {
  return [
    { label: 'المدينة', value: address.city_name || address.property_city_id },
    { label: 'المنطقة', value: address.property_place_name || address.property_place_id },
    { label: 'الحي', value: address.neighborhood },
    { label: 'الشارع', value: address.street },
    { label: 'رقم المبنى', value: address.building_number },
    { label: 'رقم الإضافي', value: address.extra_figure },
    { label: 'الرمز البريدي', value: address.postal_code },
    { label: 'خط العرض', value: address.latitude ?? address.lat },
    { label: 'خط الطول', value: address.longitude ?? address.lng },
  ];
}

function propertyDetailsFields({ deed, address }) {
  return [
    { label: 'استخدام العقار', value: deed.property_usages_name ?? address.property_usages_name },
    { label: 'نوع العقار', value: deed.property_type_name ?? address.property_type_name },
    { label: 'إجمالي عدد الوحدات في كل طابق', value: deed.number_of_units_per_floor },
    { label: 'إجمالي عدد الطوابق', value: deed.number_of_floors },
    { label: 'عمر العقار', value: deed.age_of_the_property },
    { label: 'إجمالي عدد الوحدات في العقار', value: deed.number_of_units_in_realestate },
  ];
}

function unitDetailsFields({ unit, unitsStep }) {
  const read = (key) => unit[key] ?? unitsStep[key];
  return [
    { label: 'نوع الوحدة', value: unit.unit_type_name || unitsStep.unit_type_name || unit.unit_type_id || unitsStep.unit_type_id },
    { label: 'استخدام الوحدة', value: unit.unit_usage_name || unitsStep.unit_usage_name || unit.unit_usage_id || unitsStep.unit_usage_id },
    { label: 'رقم الوحدة', value: read('unit_number') },
    { label: 'رقم الطابق', value: read('floor_number') },
    { label: 'مساحة الوحدة', value: read('unit_area') },
    { label: 'إجمالي الغرف', value: read('tootal_rooms') },
    { label: 'عدد الغرف', value: read('number_of_rooms') },
    { label: 'عدد الصالات', value: read('The_number_of_halls') },
    { label: 'عدد المطابخ', value: read('The_number_of_kitchens') },
    { label: 'عدد دورات المياه', value: read('The_number_of_toilets') },
  ];
}

function contractTenantFields({ tenant }) {
  return [
    { label: 'كيان المستأجر', value: tenant.tenant_entity },
    { label: 'رقم هوية المستأجر', value: tenant.tenant_id_num },
    { label: 'تاريخ ميلاد المستأجر', value: tenant.tenant_dob },
    { label: 'رقم جوال المستأجر', value: tenant.tenant_mobile },
    { label: 'الرقم الموحد للمنشأة', value: tenant.tenant_entity_unified_registry_number },
    { label: 'رقم هوية وكيل المستأجر', value: tenant.id_num_of_property_tenant_agent },
    { label: 'جوال وكيل المستأجر', value: tenant.mobile_of_property_tenant_agent },
  ];
}

function financialTermsFields({ orderData, financial }) {
  return [
    {
      label: 'نوع الدفع',
      value:
        orderData?.payment_type?.name_trans ||
        orderData?.payment_type?.name_ar ||
        orderData?.payment_type?.name ||
        financial.payment_type_name ||
        financial.payment_type_id,
    },
    { label: 'مدة العقد', value: describeContractTerm(financial) },
    { label: 'مدة (سنوات)', value: financial.duration_years },
    { label: 'مدة (أشهر)', value: financial.duration_months },
    { label: 'تاريخ بداية العقد', value: financial.contract_starting_date },
    { label: 'صلاحيات المستأجر', value: describeTenantRoles(orderData, financial) },
    { label: 'شروط أخرى', value: describeOtherConditions(orderData, financial) },
    { label: 'نص الشروط الإضافية', value: financial.text_additional_terms },
    { label: 'ملاحظات', value: financial.notes },
  ];
}

const SECTION_FIELD_BUILDERS = {
  owner: ownerFields,
  agent: agentFields,
  propertyAddress: propertyAddressFields,
  propertyDetails: propertyDetailsFields,
  unitDetails: unitDetailsFields,
  contractTenant: contractTenantFields,
  financialTerms: financialTermsFields,
};

/** Fields of one section ("owner", "agent", "propertyAddress", ...), starting with the order number. */
export function getOrderSectionFields(orderData, context) {
  const buildFields = SECTION_FIELD_BUILDERS[context];
  if (!buildFields) return [];

  const summary = orderData?.contract_summary ?? {};
  const unitsStep = getOrderUnitsStep(orderData);
  const parts = {
    orderData,
    summary,
    owner: getOrderOwnerStep(orderData),
    address: getOrderAddressStep(orderData),
    deed: getOrderDeedStep(orderData),
    tenant: getOrderTenantStep(orderData),
    financial: getOrderFinancialStep(orderData),
    unitsStep,
    unit: getOrderUnits(orderData)[0] ?? unitsStep.unit ?? {},
  };

  const orderId = orderData?.uuid ?? orderData?.id ?? summary.id;
  return [{ label: ORDER_NUMBER_LABEL, value: orderId }, ...buildFields(parts)];
}

/** Bullet list text of the fields that have a value. */
export function formatSectionDataBlock(fields) {
  return fields
    .filter(({ value }) => value !== null && value !== undefined && value !== '')
    .map(({ label, value }) => `\t•\t${label}: ${value}`)
    .join('\n');
}
