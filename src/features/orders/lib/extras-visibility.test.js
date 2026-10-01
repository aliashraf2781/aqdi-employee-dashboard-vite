import { describe, expect, it } from 'vitest';
import { getExtrasVisibility } from './extras-visibility';

describe('getExtrasVisibility', () => {
  it('shows nothing for an ordinary order', () => {
    expect(getExtrasVisibility({ status_name: 'جديد', extras: { ejar_contract_number: '1' } })).toBeNull();
    expect(getExtrasVisibility(undefined)).toBeNull();
  });

  it('shows the ejar card for a documented order', () => {
    const visibility = getExtrasVisibility({ status_name: 'تم التوثيق', extras: { ejar_contract_number: '123' } });
    expect(visibility).toMatchObject({ ejar: true, draft: false, refund: false });
  });

  it('shows the refund card when the order has a refund', () => {
    const visibility = getExtrasVisibility({ status_name: 'استرجاع', status_id: 2, extras: { refund: { return_status: 'قيد المراجعة' } } });
    expect(visibility.refund).toBe(true);
  });

  it('hides a documented order that has no data at all', () => {
    expect(getExtrasVisibility({ status_name: 'تم التوثيق', extras: {} })).toBeNull();
  });
});
