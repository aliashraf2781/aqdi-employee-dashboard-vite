import { describe, expect, it } from 'vitest';
import { buildInvoiceCsvRows, INVOICE_CSV_HEADERS } from './invoices-csv';

describe('buildInvoiceCsvRows', () => {
  it('starts with headers and translates type and status', () => {
    const rows = buildInvoiceCsvRows([
      {
        invoiceNo: 'INV-1',
        orderNo: 'a',
        mobile: '050',
        contractType: 'housing',
        amount: 10,
        source: 'ميسر',
        status: 'success',
        date: '01/01/2026',
      },
    ]);
    expect(rows[0]).toEqual(INVOICE_CSV_HEADERS);
    expect(rows[1]).toEqual(['INV-1', 'a', '050', 'سكني', 10, 'ميسر', 'ناجحة', '01/01/2026']);
  });
});
