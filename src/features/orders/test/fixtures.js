/** A realistic order payload (GET /admin/orders/:id) used by the page tests. */
export const ORDER_FIXTURE = {
  id: 7,
  uuid: 'AQ-1007',
  user: { id: 4, mobile: '0512345678' },
  contract_summary: {
    contract_type_trans: 'سكني',
    contract_status_id: 1,
    contract_status_name: 'جديد',
    is_paid: true,
    amount_payment: 349,
    employee_name: 'أحمد',
    instrument_type_key: 'electronic',
    instrument_type_trans: 'صك إلكتروني',
    instrument_number: '5555',
  },
  step1: { instrument_number: '5555', name_real_estate: 'برج الندى', image_instrument: 'storage/deed.png' },
  step2: { street: 'الملك فهد', neighborhood: 'العليا', property_place_id: 1, property_city_id: 2, building_number: '12' },
  step3: { property_owner_id_num: '1012345678', property_owner_mobile: '0555555555', name_owner: 'سعد' },
  step4: { tenant_entity: 'person', tenant_id_num: '1087654321', tenant_mobile: '0566666666', tenant_name: 'خالد' },
  step5: { units: [{ id: 3, unit_number: '5', floor_number: '2', unit_area: 90, furnished: 1 }], units_count: 1 },
  step6: { annual_rent_amount_for_the_unit: 12000, payment_type_name: 'سنوي', duration_years: 1, contract_starting_date: '01-01-2026' },
  status_timeline: [{ id: 1, status_label: 'جديد', status_color: 'seagreen', created_at: '2026-01-01T10:00:00Z', state: 'current' }],
};

export const STATUSES_FIXTURE = [
  { id: 1, name: 'جديد', color: 'seagreen', is_active: true },
  { id: 2, name: 'استرجاع', color: 'gray', is_active: true },
  { id: 6, name: 'مستلم', color: 'navy', is_active: true },
];

export const ORDERS_LIST_FIXTURE = {
  data: {
    items: [
      { id: 7, uuid: 'AQ-1007', contract_type: 'سكني', is_paid: true, amount_payment: 349, employee_name: 'أحمد', updated_at: '2026-01-01T10:00:00Z' },
      { id: 8, uuid: 'AQ-1008', contract_type: 'تجاري', is_paid: false, employee_name: 'سارة', updated_at: '2026-01-02T10:00:00Z' },
    ],
    pagination: { total: 2, last_page: 1 },
  },
};
