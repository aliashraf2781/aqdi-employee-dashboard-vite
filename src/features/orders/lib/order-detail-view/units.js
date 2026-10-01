import { pick } from '../pick';
import { meterOwnershipLabel, yesNoLabel } from './labels';

function formatServices(unit) {
  if (Array.isArray(unit.Services)) return unit.Services.filter(Boolean).join(' / ') || null;
  return yesNoLabel(unit.Services ?? unit.services);
}

function mapUnitView(unit, index) {
  const hasNumber = unit.unit_number != null && unit.unit_number !== '';
  return {
    id: unit.id ?? unit.unit_id ?? index,
    title: hasNumber ? `الوحدة ${unit.unit_number}` : `الوحدة ${index + 1}`,
    badge: pick(unit.unit_usage_name, unit.unit_usage, unit.badge),
    number: unit.unit_number,
    type: pick(unit.unit_type_name, unit.unit_type),
    use: pick(unit.unit_usage_name, unit.unit_usage),
    floor: unit.floor_number,
    area: unit.unit_area != null ? `${unit.unit_area} م²` : null,
    rooms: pick(unit.number_of_rooms, unit.tootal_rooms),
    halls: unit.The_number_of_halls,
    councils: unit.number_of_councils,
    bathrooms: pick(unit.The_number_of_toilets, unit.The_number_of_the_toilet),
    kitchens: unit.The_number_of_kitchens,
    window_ac: unit.window_ac,
    split_ac: unit.split_ac,
    air_conditioners: unit.number_of_unit_air_conditioners,
    furnished: yesNoLabel(unit.furnished),
    kitchen_tank: yesNoLabel(unit.kitchen_tank),
    kitchen_cabinets: yesNoLabel(unit.kitchen_cabinets),
    electricity_meter: yesNoLabel(unit.electricity_meter),
    electricity_meter_number: unit.electricity_meter_number,
    electricity_meter_ownership: meterOwnershipLabel(unit.electricity_meter_ownership),
    water_meter: yesNoLabel(unit.water_meter),
    water_meter_number: unit.water_meter_number,
    water_meter_ownership: meterOwnershipLabel(unit.water_meter_ownership),
    gas_meter: yesNoLabel(unit.Gasmeter),
    parking_spaces: unit.Number_parking_spaces,
    services: formatServices(unit),
  };
}

export function mapUnitsView(units) {
  return units.map(mapUnitView);
}
