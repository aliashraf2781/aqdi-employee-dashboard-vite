import { fileNameFromUrl, resolveImageUrl } from '../national-address';
import { getOrderTenantStep } from '../order-detail-steps';
import { pick } from '../pick';
import { calendarTypeLabel, composePartsDob, composeTenantDob, relationName, tenantEntityLabel, yesNoLabel } from './labels';

function resolveRelationLabel(orderData, tenant, labelKey, ...fieldKeys) {
  return pick(
    orderData.relation_labels?.[labelKey],
    ...fieldKeys.flatMap((key) => [relationName(orderData[key]), relationName(tenant[key])]),
  );
}

/** Tenant section: person or company, contact data and an optional legal representative. */
export function mapTenantView(orderData) {
  const tenant = getOrderTenantStep(orderData);
  const both = (key) => pick(tenant[key], orderData[key]);

  const dob = composeTenantDob(tenant) ?? composeTenantDob(orderData);
  const dobType = calendarTypeLabel(both('type_tenant_dob'));
  const ownerRecordUrl = resolveImageUrl(
    pick(tenant.copy_of_the_owner_record, orderData.copy_of_the_owner_record, orderData.copy_of_the_owner_record_path),
  );

  return {
    type_label: tenantEntityLabel(both('tenant_entity')),
    name: both('tenant_name'),
    email: both('tenant_email'),
    nationality: both('tenant_nationality'),
    work: both('tenant_work'),
    gender: both('tenant_gender'),
    phone: both('tenant_mobile'),
    id_num: both('tenant_id_num'),
    dob,
    dob_type: dobType,
    dob_display: dob ? (dobType ? `${dob} (${dobType})` : dob) : null,
    entity_region: resolveRelationLabel(orderData, tenant, 'tenant_entity_region', 'tenant_entity_region'),
    entity_city: resolveRelationLabel(orderData, tenant, 'tenant_entity_city', 'tenant_entity_city'),
    entity_legal_region: pick(
      resolveRelationLabel(orderData, tenant, 'tenant_entity_legal_region', 'tenant_entity_legal_region'),
      relationName(orderData.region_of_the_tenant_legal_agent),
      tenant.region_of_the_tenant_legal_agent,
    ),
    entity_legal_city: pick(
      resolveRelationLabel(orderData, tenant, 'tenant_entity_legal_city', 'tenant_entity_legal_city'),
      relationName(orderData.city_of_the_tenant_legal_agent),
      tenant.city_of_the_tenant_legal_agent,
    ),
    has_legal_representative: yesNoLabel(both('is_there_a_legal_representative_of_the_tenant')),
    legal_agent_id: pick(
      tenant.id_num_of_property_tenant_agent,
      tenant.id_number_of_property_tenant_agent,
      orderData.id_num_of_property_tenant_agent,
      orderData.id_number_of_property_tenant_agent,
    ),
    legal_agent_phone: both('mobile_of_property_tenant_agent'),
    legal_agent_dob:
      composePartsDob(tenant, 'dob_of_property_tenant_agent') ?? composePartsDob(orderData, 'dob_of_property_tenant_agent'),
    legal_agent_dob_type: calendarTypeLabel(both('type_dob_tenant_agent')),
    owner_record_url: ownerRecordUrl,
    owner_record_name: fileNameFromUrl(ownerRecordUrl),
  };
}
