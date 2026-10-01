import { getOrderAddressStep, getOrderUnitsStep } from '../order-detail-steps';

/** Reference list a select field draws its options from (by `optionsSource`, or implied by the field key). */
const SOURCE_BY_FIELD_KEY = {
  tenant_role_id: 'tenant-roles',
  payment_type_id: 'payment-types',
  contract_term_in_years: 'contract-periods',
  contract_period_id: 'contract-periods',
  property_place_id: 'regions',
  property_city_id: 'cities',
  unit_type_id: 'unit-types',
  unit_usage_id: 'unit-usages',
  property_type_id: 'property-types',
  property_usages_id: 'property-usages',
};

/** Name of the option source of a field, or null for fields with fixed options. */
export function getOptionsSource(field) {
  if (Array.isArray(field?.options) && field.options.length > 0) return null;
  return field?.optionsSource ?? SOURCE_BY_FIELD_KEY[field?.key] ?? null;
}

function firstOf(...values) {
  return values.find((value) => value) ?? null;
}

/**
 * Text for the saved value of a select when the option list (still loading, or without it) does not
 * contain it: the label the API sent along with the order.
 */
export function getCurrentOptionLabel(field, orderData, formValues) {
  const labels = orderData?.contract_summary?.relation_labels ?? orderData?.relation_labels ?? {};
  const address = getOrderAddressStep(orderData);
  const unitsStep = getOrderUnitsStep(orderData);
  const deed = orderData?.step1 ?? {};

  const byKey = {
    property_place_id: () => firstOf(labels.property_region, orderData?.property_region?.name_ar, address.property_place_name),
    property_city_id: () =>
      firstOf(labels.property_city, orderData?.property_city?.name_ar, address.city_name, address.property_city_name),
    property_type_id: () =>
      firstOf(
        formValues?.property_type_name,
        labels.property_type,
        deed.property_type_name,
        orderData?.property_type_name,
        orderData?.property_type?.name_ar,
        orderData?.property_type?.name,
      ),
    property_usages_id: () =>
      firstOf(
        formValues?.property_usages_name,
        labels.property_usages,
        deed.property_usages_name,
        orderData?.property_usages_name,
        orderData?.property_usages?.name_ar,
        orderData?.property_usages?.name,
      ),
    unit_type_id: () => firstOf(formValues?.unit_type_name, unitsStep.unit_type_name, orderData?.unit_type_name),
    unit_usage_id: () => firstOf(formValues?.unit_usage_name, unitsStep.unit_usage_name, orderData?.unit_usage_name),
  };

  if (byKey[field.key]) return byKey[field.key]();
  if (field.displayKey && formValues?.[field.displayKey]) return formValues[field.displayKey];
  return null;
}

/** Options plus the current value when the list does not contain it (so a saved value never disappears). */
export function withCurrentOption(options, selectValue, fallbackLabel) {
  if (!selectValue || options.some((option) => String(option.value) === selectValue)) return options;
  return [...options, { value: selectValue, label: fallbackLabel ? String(fallbackLabel) : `الخيار الحالي (${selectValue})` }];
}
