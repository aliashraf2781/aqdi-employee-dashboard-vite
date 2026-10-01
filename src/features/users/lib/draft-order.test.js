import { describe, expect, it } from 'vitest';
import { isDraftOrderRow } from './draft-order';

describe('isDraftOrderRow', () => {
  it('reads explicit flags', () => {
    expect(isDraftOrderRow({ is_draft: 1 })).toBe(true);
    expect(isDraftOrderRow({ contract_summary: { from_draft: true } })).toBe(true);
  });

  it('reads draft status references and text', () => {
    expect(isDraftOrderRow({ draft_contract_status_id: 4 })).toBe(true);
    expect(isDraftOrderRow({ status: { name: 'مسودة عقد' } })).toBe(true);
    expect(isDraftOrderRow({ source: 'Draft' })).toBe(true);
  });

  it('is false for normal rows', () => {
    expect(isDraftOrderRow({ status: { name: 'مكتمل' } })).toBe(false);
    expect(isDraftOrderRow(null)).toBe(false);
  });
});
