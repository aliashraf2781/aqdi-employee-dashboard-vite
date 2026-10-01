import { getOrderTenantStep, getOrderUnits, getOrderUnitsStep } from '../order-detail-steps';

function firstUnit(orderData) {
  const units = getOrderUnits(orderData);
  return units[0] ?? {};
}

export function readUnitsAlias(orderData, key) {
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

export function readTenant(orderData, key) {
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
