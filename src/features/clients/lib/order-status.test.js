import { describe, expect, it } from 'vitest';
import { classifyOrderStatus, countOrdersByStatus, isDraftOrderRow, withStatusKeys } from './order-status';

describe('classifyOrderStatus', () => {
  it('detects returned orders from the flag or the status name', () => {
    expect(classifyOrderStatus({ return_contract: true })).toBe('returned');
    expect(classifyOrderStatus({ status: { name: 'طلب مسترجع' } })).toBe('returned');
  });

  it('detects canceled orders from the status name', () => {
    expect(classifyOrderStatus({ status_name: 'ملغي' })).toBe('canceled');
  });

  it('detects drafts, completed and everything else as processing', () => {
    expect(classifyOrderStatus({ is_draft: 1 })).toBe('draft');
    expect(classifyOrderStatus({ is_completed: true })).toBe('completed');
    expect(classifyOrderStatus({})).toBe('processing');
  });
});

describe('isDraftOrderRow', () => {
  it('looks inside contract_summary too', () => {
    expect(isDraftOrderRow({ contract_summary: { draft_contract_status_id: 4 } })).toBe(true);
  });

  it('is false for empty rows', () => {
    expect(isDraftOrderRow(null)).toBe(false);
    expect(isDraftOrderRow({})).toBe(false);
  });
});

describe('countOrdersByStatus', () => {
  it('counts every tab, including tabs with no orders', () => {
    const orders = withStatusKeys([{ is_completed: true }, { is_completed: true }, { is_draft: true }]);
    expect(countOrdersByStatus(orders)).toEqual({
      all: 3,
      completed: 2,
      draft: 1,
      returned: 0,
      canceled: 0,
      processing: 0,
    });
  });
});
