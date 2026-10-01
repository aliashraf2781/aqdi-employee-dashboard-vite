import { describe, expect, it } from 'vitest';
import { findDocumentedStatus, resolveCurrentStatusId } from './ejar-documentation';

describe('ejar documentation helpers', () => {
  it('finds the documented status by name', () => {
    const statuses = [{ id: 1, name: 'جديد' }, { id: 7, name: 'تم التوثيق' }];
    expect(findDocumentedStatus(statuses).id).toBe(7);
    expect(findDocumentedStatus([{ id: 1, label: 'جديد' }])).toBeUndefined();
    expect(findDocumentedStatus()).toBeUndefined();
  });

  it('finds the current status id', () => {
    expect(resolveCurrentStatusId({ contract_summary: { contract_status_id: 3 }, status_id: 9 })).toBe(3);
    expect(resolveCurrentStatusId({ status: { id: 4 } })).toBe(4);
  });
});
