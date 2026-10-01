import { describe, expect, it } from 'vitest';
import { filterInvoices, getInvoiceStats, paginate } from './invoice-filters';

const invoices = [
  { invoiceNo: 'INV-1', orderNo: 'a', mobile: '050', status: 'success', contractType: 'housing', amount: 100 },
  { invoiceNo: 'INV-2', orderNo: 'b', mobile: '055', status: 'failed', contractType: 'commercial', amount: 50 },
  { invoiceNo: 'INV-3', orderNo: 'c', mobile: '056', status: 'success', contractType: 'commercial', amount: 25 },
];
const NO_FILTERS = { search: '', status: 'all', contractType: 'all' };

describe('invoice filters', () => {
  it('returns everything without filters', () => {
    expect(filterInvoices(invoices, NO_FILTERS)).toHaveLength(3);
  });

  it('filters by status, type and search text', () => {
    expect(filterInvoices(invoices, { ...NO_FILTERS, status: 'success' })).toHaveLength(2);
    expect(filterInvoices(invoices, { ...NO_FILTERS, contractType: 'commercial', status: 'success' })).toHaveLength(1);
    expect(filterInvoices(invoices, { ...NO_FILTERS, search: ' inv-2 ' })).toHaveLength(1);
    expect(filterInvoices(invoices, { ...NO_FILTERS, search: '056' })).toHaveLength(1);
  });

  it('computes stats', () => {
    expect(getInvoiceStats(invoices)).toEqual({ paidCount: 2, refundedCount: 1, totalCount: 3, collected: 125 });
  });

  it('paginates', () => {
    expect(paginate([1, 2, 3, 4, 5], 2, 2)).toEqual([3, 4]);
  });
});
