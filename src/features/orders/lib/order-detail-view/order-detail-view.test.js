import { describe, expect, it } from 'vitest';
import { mapOrderDetailView } from './index';

const order = {
  id: 7,
  uuid: 'UU-7',
  contract_summary: {
    contract_type_trans: 'سكني',
    contract_status_id: 3,
    contract_status_name: 'جديد',
    is_paid: true,
    amount_payment: 349,
    employee_name: 'أحمد',
    instrument_type_key: 'electronic',
  },
  step1: { image_instrument: 'storage/deed.png' },
  step2: { street: 'الملك فهد', neighborhood: 'العليا' },
  step3: { property_owner_id_num: '1000000000', property_owner_mobile: '0500000000' },
  step4: { tenant_entity: 'person', tenant_name: 'خالد', tenant_dob_day: '1', tenant_dob_month: '2', tenant_dob_year: '1990' },
  step5: { units: [{ id: 1, unit_number: '5', unit_area: 90, furnished: 1, Services: ['a', 'b'] }] },
  step6: { annual_rent_amount_for_the_unit: 9000, duration_years: 2, payment_type_name: 'سنوي' },
  status_timeline: [{ status_label: 'جديد', created_at: 'x' }],
};

describe('mapOrderDetailView', () => {
  const view = mapOrderDetailView(order);

  it('maps the header fields', () => {
    expect(view).toMatchObject({
      id: 7,
      uuid: 'UU-7',
      contract_type: 'سكني',
      status_id: 3,
      status_name: 'جديد',
      is_paid: true,
      employee_name: 'أحمد',
      user_mobile: '0500000000',
    });
  });

  it('maps the deed and owner', () => {
    expect(view.deed.owner_id).toBe('1000000000');
    expect(view.deed.file_url).toMatch(/storage\/deed\.png$/);
    expect(view.deed.file_label).toBe('صورة الصك');
  });

  it('maps tenant, financial and units', () => {
    expect(view.tenant.name).toBe('خالد');
    expect(view.tenant.dob).toBe('1-2-1990');
    expect(view.financial.rent).toBe(9000);
    expect(view.financial.duration).toBe('2 سنة');
    expect(view.units[0]).toMatchObject({ title: 'الوحدة 5', area: '90 م²', furnished: 'نعم', services: 'a / b' });
  });

  it('maps the address and timeline', () => {
    expect(view.national_address.street).toBe('الملك فهد');
    expect(view.status_timeline).toHaveLength(1);
  });

  it('survives an empty order', () => {
    expect(() => mapOrderDetailView({})).not.toThrow();
    expect(mapOrderDetailView({}).status_name).toBe('قيد المعالجة');
  });
});
