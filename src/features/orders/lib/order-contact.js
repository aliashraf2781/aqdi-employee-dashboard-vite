import { getOrderOwnerStep, getOrderTenantStep, pickAgentRelatedField } from './order-detail-steps';

export function getOrderContractUuid(orderData) {
  const summary = orderData?.contract_summary ?? {};
  return orderData?.uuid ?? orderData?.contract_uuid ?? summary.uuid ?? summary.contract_uuid ?? '';
}

/** Order uuid when there is one, otherwise the numeric id. */
export function getOrderId(orderData) {
  return getOrderContractUuid(orderData) || orderData?.id || orderData?.contract_summary?.id || '';
}

/** Saudi WhatsApp number in international form (9665xxxxxxxx), or '' when empty. */
export function normalizeWhatsAppPhone(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('966')) return digits;
  if (digits.startsWith('0')) return `966${digits.slice(1)}`;
  if (digits.length === 9) return `966${digits}`;
  return digits;
}

export function buildWhatsAppUrl(phone, messageText) {
  const normalized = normalizeWhatsAppPhone(phone);
  if (!normalized) return null;
  const text = encodeURIComponent(messageText || '');
  return `https://wa.me/${normalized}${text ? `?text=${text}` : ''}`;
}

/**
 * The phone to contact for a section of the order:
 * the agent for "agent", the tenant for "contractTenant", the owner otherwise.
 */
export function getOrderPhoneForContext(orderData, context) {
  const summary = orderData?.contract_summary ?? {};
  const owner = getOrderOwnerStep(orderData);
  const tenant = getOrderTenantStep(orderData);

  if (context === 'agent') {
    return pickAgentRelatedField(orderData, 'mobile_of_property_owner_agent') || '';
  }

  if (context === 'contractTenant') {
    return (
      tenant?.tenant_mobile ||
      tenant?.mobile_of_property_tenant_agent ||
      orderData?.user?.mobile ||
      orderData?.user_mobile ||
      owner.property_owner_mobile ||
      summary.property_owner_mobile ||
      ''
    );
  }

  return (
    owner.property_owner_mobile ||
    summary.property_owner_mobile ||
    orderData?.user?.mobile ||
    orderData?.user_mobile ||
    ''
  );
}

export function getOrderClientPhone(orderData) {
  return getOrderPhoneForContext(orderData, 'owner');
}

export function getWhatsAppRecipientLabel(context) {
  if (context === 'agent') return 'الوكيل';
  if (context === 'contractTenant') return 'المستأجر';
  return 'العميل';
}
