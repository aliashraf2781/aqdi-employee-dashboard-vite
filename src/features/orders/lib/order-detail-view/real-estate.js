import { pick } from '../pick';

export function mapRealEstateView(orderData = {}) {
  const estate = orderData.real_estate;
  const isLinked =
    Boolean(estate && typeof estate === 'object') ||
    orderData.is_real === 1 ||
    orderData.is_real === true ||
    orderData.real_id != null;

  if (!estate || typeof estate !== 'object') {
    return {
      linked: Boolean(isLinked && orderData.real_id != null),
      id: orderData.real_id ?? null,
      name: null,
      instrument_type: null,
      instrument_number: null,
      registry_number: null,
      property_type: null,
      property_usage: null,
      region: null,
      city: null,
      district: null,
      street: null,
      building_number: null,
      owner_id: null,
      owner_phone: null,
      age: null,
      floors: null,
      units_count: null,
      date_first_registration: null,
    };
  }

  return {
    linked: true,
    id: pick(estate.id, orderData.real_id),
    name: pick(estate.name_real_estate, estate.name),
    instrument_type: pick(
      estate.instrument_type_trans,
      estate.instrument_type_label,
      estate.instrument_type
    ),
    instrument_number: pick(estate.instrument_number, estate.deed_number),
    registry_number: estate.real_estate_registry_number,
    property_type: pick(
      estate.property_type_name,
      estate.property_type?.name_ar,
      estate.property_type?.name
    ),
    property_usage: pick(
      estate.property_usages_name,
      estate.property_usages?.name_ar,
      estate.property_usages?.name
    ),
    region: pick(
      estate.property_place_name,
      estate.property_region?.name_ar,
      estate.property_region?.name
    ),
    city: pick(
      estate.property_city_name,
      estate.city_name,
      estate.property_city?.name_ar,
      estate.property_city?.name
    ),
    district: pick(estate.neighborhood, estate.district),
    street: estate.street,
    building_number: estate.building_number,
    owner_id: pick(estate.national_num, estate.property_owner_id_num),
    owner_phone: pick(estate.mobile, estate.property_owner_mobile),
    age: estate.age_of_the_property,
    floors: estate.number_of_floors,
    units_count: pick(
      estate.number_of_units_in_realestate,
      estate.Count_Units,
      estate.units_count
    ),
    date_first_registration: estate.date_first_registration,
  };
}

/**
 * Shape GET /admin/orders/:id into the realtime detail header/groups view.
 */
