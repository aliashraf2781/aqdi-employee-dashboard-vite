import { describe, expect, it } from 'vitest';
import { extractPayments, formatPaymentDate, mapPaymentToInvoice } from './invoice-mapper';

describe('invoice mapper', () => {
  it('formats dates', () => {
    expect(formatPaymentDate('2026-03-15')).toBe('15/03/2026');
    expect(formatPaymentDate(null)).toBe('—');
  });

  it('maps a payment', () => {
    const invoice = mapPaymentToInvoice({
      id: 7,
      contract_uuid: 'c-1',
      user: { name: ' علي ', mobile: '0500' },
      contract_type: 'housing',
      amount: '120.5',
      payment_method: 'moyasar',
      status: 'success',
      payment_date: '2026-01-02',
    });
    expect(invoice).toMatchObject({
      invoiceNo: 'INV-7',
      customerName: 'علي',
      mobile: '0500',
      amount: 120.5,
      source: 'ميسر',
      date: '02/01/2026',
    });
  });

  it('uses safe defaults', () => {
    expect(mapPaymentToInvoice({ id: 1 })).toMatchObject({
      orderNo: '—',
      mobile: '—',
      status: 'unknown',
      amount: 0,
      referenceNo: '1',
    });
  });

  it('extracts items from the response', () => {
    expect(extractPayments({ data: { items: [1, 2] } })).toEqual([1, 2]);
    expect(extractPayments({})).toEqual([]);
  });
});
