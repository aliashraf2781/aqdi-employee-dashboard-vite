import { describe, expect, it } from 'vitest';
import { buildBatchContractPrintHtml, buildContractPrintHtml } from './index';
import { display, section } from './html-helpers';

const order = {
  uuid: 'ABC-1',
  user: { mobile: '0500000000' },
  contract_summary: { contract_status_name: 'جديد' },
  step5: { units: [{ unit_number: '12' }] },
  step6: { annual_rent_amount_for_the_unit: 5000 },
};

describe('contract print', () => {
  it('formats cell values', () => {
    expect(display(null)).toBe('---');
    expect(display(true)).toBe('نعم');
    expect(display(['a', '', 'b'])).toBe('a، b');
  });

  it('drops empty rows and empty sections', () => {
    expect(section('t', [['a', null]])).toBe('');
    expect(section('t', [['a', 1]])).toContain('<td class="value">1</td>');
  });

  it('builds a full document for one order', () => {
    const html = buildContractPrintHtml(order);
    expect(html).toContain('ABC-1');
    expect(html).toContain('5000');
    expect(html).toContain('dir="rtl"');
  });

  it('puts a page break between batch contracts only', () => {
    const html = buildBatchContractPrintHtml([order, order]);
    expect(html.match(/page-break-after/g)).toHaveLength(1);
    expect(buildBatchContractPrintHtml([])).toBe('');
  });
});
