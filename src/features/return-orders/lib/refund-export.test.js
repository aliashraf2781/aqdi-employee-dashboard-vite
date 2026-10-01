import { describe, expect, it } from 'vitest';
import { mapRefundToExportRow } from './refund-export';

const REFUND = {
  orderUuid: 'AQ-7',
  userMobile: '0501111111',
  contractType: 'سكني',
  isPaid: true,
  amountPayment: 349,
  refundAmount: 300,
  customerRefunded: null,
  adminConfirmed: true,
  employeeName: 'أحمد',
  draftContractNumber: 'D-1',
};

describe('mapRefundToExportRow', () => {
  it('maps a paid, approved refund', () => {
    expect(mapRefundToExportRow(REFUND)).toMatchObject({
      'رقم الطلب': 'AQ-7',
      الدفع: 349,
      'تم الاسترجاع': 'بانتظار الاسترجاع',
      'موافقة الإدارة': 'تم الموافقة',
      'رقم مسودة العقد': 'D-1',
    });
  });

  it('shows the payment label of an unpaid order and a pending approval', () => {
    const row = mapRefundToExportRow({ ...REFUND, isPaid: false, paymentLabelAr: null, adminConfirmed: null });
    expect(row.الدفع).toBe('لم يتم الدفع');
    expect(row['موافقة الإدارة']).toBe('لم تتم الموافقة');
  });
});
