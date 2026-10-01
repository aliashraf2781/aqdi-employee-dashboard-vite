import { getContractTypeLabel } from '../contract-periods';
import { absolutizeMediaUrl } from '../media-url';
import {
  getOrderAddressStep,
  getOrderDeedStep,
  getOrderEndowmentNazir,
  getOrderFinancialStep,
  getOrderOwnerStep,
  getOrderTenantStep,
  getOrderUnits,
  getOrderUnitsStep,
  hasEndowmentNazir,
  hasLegalAgent,
  pickAgentRelatedField,
  resolveOrderContractTypeKey,
} from '../order-detail-steps';
import { display, imagesSection, section } from './html-helpers';

const AGENT_DOCUMENT_FIELDS = [
  'copy_power_of_attorney_from_heirs_to_agent',
  'copy_of_the_authorization_or_agency',
  'Image_inheritance_certificate',
  'copy_of_the_endowment_registration_certificate',
  'copy_of_the_trusteeship_deed',
  'copy_of_guardians_power_of_attorney_for_agent',
];

function collectDeedImages(orderData, summary, deed) {
  const deedImageFields = [
    'image_instrument',
    'image_instrument_from_the_front',
    'image_instrument_from_the_back',
    'copy_power_of_attorney_from_heirs_to_agent',
  ];
  const fromDeed = deedImageFields.flatMap((field) => [summary[field], deed[field]]);
  const fromAgent = AGENT_DOCUMENT_FIELDS.map((field) => pickAgentRelatedField(orderData, field));
  const urls = [...fromDeed, ...fromAgent].map(absolutizeMediaUrl).filter(Boolean);
  return [...new Set(urls)];
}

function describeTenantRoles(orderData, financial, tenant) {
  const details = orderData.tenant_roles_details || financial.tenant_roles_details;
  if (Array.isArray(details) && details.length) {
    return details
      .map((item) => {
        const label = item?.text_of_reason || item?.name || '';
        return item?.value != null && item.value !== '' ? `${label} (${item.value})` : label;
      })
      .filter(Boolean)
      .join('، ');
  }
  const names = orderData.tenant_role_names || financial.tenant_role_names || tenant.tenant_role_names;
  return Array.isArray(names) ? names.join('، ') : names;
}

function describeOtherConditions(orderData, financial) {
  const list = orderData.other_conditions_list || financial.other_conditions_list;
  if (Array.isArray(list) && list.length) return list.filter(Boolean).join('، ');
  return financial.other_conditions || orderData.other_conditions || null;
}

function describeDateType(type) {
  if (type === 'hijri') return 'هجري';
  if (type === 'gregorian') return 'ميلادي';
  return type;
}

function ownerSection(summary, owner, address) {
  return section('الصك - الملاك', [
    ['رقم الهوية', owner.property_owner_id_num ?? summary.property_owner_id_num],
    ['تاريخ الميلاد', owner.property_owner_dob ?? summary.property_owner_dob],
    ['رقم الجوال', owner.property_owner_mobile ?? summary.property_owner_mobile],
    ['المنطقة', summary.relation_labels?.property_region || address.property_place_name],
    ['المدينة', summary.relation_labels?.property_city || address.city_name],
    ['الحي', address.neighborhood ?? summary.neighborhood],
    ['الشارع', address.street ?? summary.street],
  ]);
}

function agentSection(orderData, summary) {
  if (!hasLegalAgent(orderData)) return '';
  const field = (key) => pickAgentRelatedField(orderData, key);
  return section('بيانات الوكيل', [
    ['اسم الوكيل', summary.name_of_property_owner_agent ?? summary.property_owner_agent_name],
    ['رقم الهوية', field('id_num_of_property_owner_agent')],
    ['تاريخ الميلاد', field('dob_of_property_owner_agent')],
    ['رقم الجوال', field('mobile_of_property_owner_agent')],
    ['رقم الوكالة', field('agency_number_in_instrument_of_property_owner')],
    ['تاريخ الوكالة', field('agency_instrument_date_of_property_owner')],
  ]);
}

function nazirSection(orderData) {
  if (!hasEndowmentNazir(orderData)) return '';
  const nazir = getOrderEndowmentNazir(orderData);
  return section('ناظر الوقف', [
    ['رقم الهوية', nazir.id_num_of_property_owner_agent],
    ['رقم الجوال', nazir.mobile_of_property_owner_agent],
    ['أكثر من صك نظارة', nazir.is_multiple_trusteeship_deed_copy],
  ]);
}

function addressSection(address) {
  return section('العنوان الوطني للعقار', [
    ['المدينة', address.city_name || address.property_city_id],
    ['المنطقة', address.property_place_name || address.property_place_id],
    ['الشارع', address.street],
    ['الحي', address.neighborhood],
    ['رقم الإضافي', address.extra_figure],
    ['رقم المبنى', address.building_number],
    ['الرمز البريدي', address.postal_code],
  ]);
}

function unitSection(unit, unitsStep) {
  const read = (...keys) => keys.map((key) => unit[key] || unitsStep[key]).find(Boolean);
  return section('تفاصيل الوحدة', [
    ['رقم الوحدة', read('unit_number')],
    ['نوع الوحدة', unit.unit_type_name || unitsStep.unit_type_name || unitsStep.unit_type?.name_ar],
    ['استخدام الوحدة', unit.unit_usage_name || unitsStep.unit_usage_name || unitsStep.unit_usage?.name_ar],
    ['رقم الطابق', read('floor_number')],
    ['مساحة الوحدة', read('unit_area')],
    ['عدد الغرف', read('tootal_rooms')],
    ['مؤثثة', unit.furnished ?? unitsStep.furnished],
    ['مطبخ راكب', unit.kitchen_tank ?? unitsStep.kitchen_tank],
    ['دورة مياه', read('The_number_of_the_toilet', 'The_number_of_toilets')],
    ['الصالة', read('The_number_of_halls')],
    ['مكيف سبليت', read('split_ac') || 'لا يوجد'],
    ['مكيف شباك', read('window_ac') || 'لا يوجد'],
    ['مطبخ', read('The_number_of_kitchens')],
    ['عداد الكهرباء', read('electricity_meter_number')],
    ['عداد المياه', read('water_meter_number')],
  ]);
}

function tenantSection({ orderData, summary, tenant, financial, contractTypeLabel }) {
  return section('العقد - المستأجر', [
    ['نوع العقد', contractTypeLabel],
    ['تاريخ بدء العقد', financial.contract_starting_date],
    ['مدة العقد', summary.contract_period || financial.contract_term_name],
    ['صلاحيات المستأجر', describeTenantRoles(orderData, financial, tenant)],
    ['رقم هوية المستأجر', tenant.tenant_id_num],
    ['تاريخ ميلاد المستأجر', tenant.tenant_dob],
    ['رقم جوال المستأجر', tenant.tenant_mobile],
  ]);
}

function financialSection(orderData, financial) {
  return section('البيانات المالية', [
    ['مبلغ الإيجار السنوي للوحدة', financial.annual_rent_amount_for_the_unit],
    ['نوع الدفع', financial.payment_type_name],
    ['الغرامة اليومية', financial.daily_fine],
    ['إجمالي السعر', financial.contract_term_in_years?.price],
    ['مدة العقد', financial.contract_term_name],
    ['تاريخ بداية العقد', financial.contract_starting_date],
    ['نوع التاريخ', describeDateType(financial.type_contract_starting_date)],
    ['شروط أخرى', describeOtherConditions(orderData, financial)],
    ['نص الشروط الإضافية', financial.text_additional_terms],
  ]);
}

function headerBlock(orderData, summary) {
  return `<div class="header">
    <h1>عقد إيجار - تفاصيل الطلب</h1>
    <p>رقم الطلب: ${display(orderData.uuid)}</p>
    <p>حالة الطلب: ${display(summary.contract_status_name || orderData.status_label)}</p>
    <p>رقم جوال العميل: ${display(orderData.user?.mobile)}</p>
    <p>تاريخ الطباعة: ${new Date().toLocaleString('ar-SA')}</p>
  </div>`;
}

/** Inner markup of one printed contract (no html/head/body wrapper). */
export function buildContractPrintSections(orderData) {
  if (!orderData) return '';

  const summary = orderData.contract_summary ?? {};
  const deed = getOrderDeedStep(orderData);
  const address = getOrderAddressStep(orderData);
  const owner = getOrderOwnerStep(orderData);
  const tenant = getOrderTenantStep(orderData);
  const unitsStep = getOrderUnitsStep(orderData);
  const unit = getOrderUnits(orderData)[0] ?? unitsStep.unit ?? {};
  const financial = getOrderFinancialStep(orderData);

  const contractTypeKey = resolveOrderContractTypeKey(orderData);
  const knownType = contractTypeKey === 'housing' || contractTypeKey === 'commercial';
  const contractTypeLabel = knownType
    ? getContractTypeLabel(contractTypeKey)
    : summary.contract_type || orderData.contract_type_trans || orderData.contract_type;

  return [
    headerBlock(orderData, summary),
    ownerSection(summary, owner, address),
    agentSection(orderData, summary),
    nazirSection(orderData),
    imagesSection(collectDeedImages(orderData, summary, deed)),
    addressSection(address),
    unitSection(unit, unitsStep),
    tenantSection({ orderData, summary, tenant, financial, contractTypeLabel }),
    financialSection(orderData, financial),
  ].join('\n');
}
