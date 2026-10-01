import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl, getOrderContractUuid, getOrderPhoneForContext, normalizeWhatsAppPhone } from './order-contact';
import { composeSendErrorMessage, getSendErrorTitle } from './send-error-message';
import { getOrderSectionFields } from './order-section-fields';
import { buildOrderPaymentUrl, getOrderSmsTemplates } from './order-sms-templates';

describe('whatsapp helpers', () => {
  it('normalizes saudi numbers', () => {
    expect(normalizeWhatsAppPhone('0500000000')).toBe('966500000000');
    expect(normalizeWhatsAppPhone('500000000')).toBe('966500000000');
    expect(normalizeWhatsAppPhone('')).toBe('');
  });

  it('builds a url with encoded text', () => {
    expect(buildWhatsAppUrl('0500000000', 'hi there')).toBe('https://wa.me/966500000000?text=hi%20there');
    expect(buildWhatsAppUrl('', 'x')).toBeNull();
  });

  it('picks the phone by context', () => {
    const order = { step4: { tenant_mobile: '0511111111' }, step3: { property_owner_mobile: '0522222222' }, step6: { x: 1 } };
    expect(getOrderPhoneForContext(order, 'contractTenant')).toBe('0511111111');
    expect(getOrderPhoneForContext(order, 'owner')).toBe('0522222222');
  });

  it('finds the uuid', () => {
    expect(getOrderContractUuid({ contract_summary: { uuid: 'u' } })).toBe('u');
  });
});

describe('send error message', () => {
  const order = { uuid: 'ORD-1', step3: { property_owner_id_num: '1000000000' }, step6: { x: 1 } };

  it('lists the section fields without the order number line', () => {
    const message = composeSendErrorMessage(order, 'owner');
    expect(message).toContain('رقم الهوية: 1000000000');
    expect(message.endsWith('رقم الطلب: ORD-1')).toBe(true);
  });

  it('has a title per section and a default', () => {
    expect(getSendErrorTitle('agent')).toBe('بيانات الوكيل غير صحيحة');
    expect(getSendErrorTitle('nope')).toBe('إرسال تنبيه للعميل');
  });

  it('starts fields with the order number', () => {
    expect(getOrderSectionFields(order, 'owner')[0]).toEqual({ label: 'رقم الطلب', value: 'ORD-1' });
    expect(getOrderSectionFields(order, 'nope')).toEqual([]);
  });
});

describe('sms templates', () => {
  it('embeds the order id and pay url', () => {
    expect(buildOrderPaymentUrl(' 5 ')).toBe('https://aqdi.sa/pay/5');
    expect(getOrderSmsTemplates('5')[0].body).toContain('https://aqdi.sa/pay/5');
  });
});
