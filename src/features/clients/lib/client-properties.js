function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/** Older API versions sent `real_estates_list` / `units_list`; the new ones send the plain names. */
function firstNonEmptyList(...candidates) {
  return candidates.map(asArray).find((list) => list.length > 0) ?? [];
}

function mapUnit(unit = {}) {
  return {
    id: unit.id,
    type: unit.unit_type_name || '—',
    number: unit.unit_number || '—',
    area: unit.unit_area || '—',
    floor: unit.floor_number || '—',
    rooms: unit.tootal_rooms || '—', // sic: the API field name is misspelled
    usage: unit.unit_usage_name || '—',
  };
}

function unitBelongsToEstate(unit, estate) {
  return (
    unit?.real_estates_units_id === estate.id ||
    unit?.real_estate_id === estate.id ||
    unit?.estate_id === estate.id
  );
}

function mapEstate(estate, allUnits) {
  const nestedUnits = asArray(estate.units);
  const units = nestedUnits.length > 0 ? nestedUnits : allUnits.filter((unit) => unitBelongsToEstate(unit, estate));

  return {
    id: estate.id,
    title: estate.name_real_estate || `عقار #${estate.id}`,
    street: estate.street || null,
    buildingNumber: estate.building_number || null,
    addedAt: estate.date_first_registration || null,
    orderId: null,
    propertyName: estate.name_real_estate || null,
    documentType: estate.instrument_type || null,
    deedNumber: estate.instrument_number || null,
    region: null,
    city: estate.property_city_name || null,
    district: estate.property_place_name || null,
    ownerId: estate.national_num || null,
    ownerMobile: estate.mobile || null,
    units: units.map(mapUnit),
  };
}

function buildUnassignedCard(units) {
  return {
    id: 'unassigned',
    title: 'وحدات غير مرتبطة بعقار',
    street: null,
    buildingNumber: null,
    addedAt: null,
    orderId: null,
    propertyName: null,
    documentType: null,
    deedNumber: null,
    region: null,
    city: null,
    district: null,
    ownerId: null,
    ownerMobile: null,
    units: units.map(mapUnit),
  };
}

/**
 * Turns the `/admin/users/{id}` payload into property cards plus totals.
 * Units that belong to no estate are collected in one extra "unassigned" card.
 */
export function buildClientProperties(user) {
  const estates = firstNonEmptyList(user?.real_estates, user?.real_estates_list);
  const units = firstNonEmptyList(user?.units, user?.units_list);

  const properties = estates.map((estate) => mapEstate(estate, units));

  const unassignedUnits = units.filter(
    (unit) => !estates.some((estate) => unitBelongsToEstate(unit, estate) || asArray(estate.units).includes(unit)),
  );
  if (unassignedUnits.length > 0) properties.push(buildUnassignedCard(unassignedUnits));

  return { properties, totals: { properties: estates.length, units: units.length } };
}
