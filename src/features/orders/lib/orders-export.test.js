import { describe, expect, it } from 'vitest';
import { mapOrderToExportRow, mapReturnOrderToExportRow } from './orders-export';

describe('orders export rows', () => {
  it('shows the amount for paid orders and a label for unpaid ones', () => {
    expect(mapOrderToExportRow({ is_paid: true, amount_payment: 349 }).الدفع).toBe(349);
    expect(mapOrderToExportRow({ is_paid: false }).الدفع).toBe('لم يتم الدفع');
  });

  it('can leave the status column out', () => {
    expect(mapOrderToExportRow({}, { showStatusColumn: false })).not.toHaveProperty('حالة الطلب');
  });

  it('maps return orders approval', () => {
    const row = mapReturnOrderToExportRow({ uuid: 'u', management_approval: { approved: true } });
    expect(row['موافقة الإدارة']).toBe('تم الموافقة');
  });
});
