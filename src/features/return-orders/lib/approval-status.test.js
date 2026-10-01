import { describe, expect, it } from 'vitest';
import { getApprovalMeta } from './approval-status';

describe('getApprovalMeta', () => {
  it('maps the admin decision to a label and tone', () => {
    expect(getApprovalMeta({ admin_confirmed: true }, null)).toMatchObject({ key: 'approved', tone: 'success' });
    expect(getApprovalMeta({ admin_confirmed: false }, null)).toMatchObject({ key: 'rejected', tone: 'danger' });
    expect(getApprovalMeta({}, null)).toMatchObject({ key: 'pending', tone: 'warning' });
  });

  it('lets the refund win over the row', () => {
    expect(getApprovalMeta({ admin_confirmed: false }, { adminConfirmed: true }).key).toBe('approved');
  });
});
