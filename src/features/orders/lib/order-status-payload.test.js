import { describe, expect, it } from 'vitest';
import {
  buildOrderStatusPayload,
  collectOrderIdentifierCandidates,
  isSendContractDraftStatus,
  statusRequiresExtraFields,
} from './order-status-payload';

describe('buildOrderStatusPayload', () => {
  const fields = [{ name: 'deed_type' }, { name: 'ejar_contract_number' }];

  it('builds a JSON body with only filled fields', () => {
    expect(buildOrderStatusPayload(3, fields, { deed_type: 'a', ejar_contract_number: '' })).toEqual({
      status_id: 3,
      deed_type: 'a',
    });
  });

  it('switches to FormData when a file is attached', () => {
    const file = new File(['x'], 'x.pdf');
    const body = buildOrderStatusPayload(3, [{ name: 'doc', type: 'file' }], { doc: file });
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('status_id')).toBe('3');
    expect(body.get('doc')).toBeInstanceOf(File);
  });
});

describe('collectOrderIdentifierCandidates', () => {
  it('removes empty and duplicate ids', () => {
    expect(collectOrderIdentifierCandidates({ uuid: 'a', id: 5 }, '5')).toEqual(['a', '5']);
  });
});

describe('status helpers', () => {
  it('detects the send-draft status by id or name', () => {
    expect(isSendContractDraftStatus({ id: 8 })).toBe(true);
    expect(isSendContractDraftStatus({ name: 'إرسال مسودة العقد لكم عبر واتساب' })).toBe(true);
    expect(isSendContractDraftStatus({ id: 1 })).toBe(false);
  });

  it('knows when extra fields are needed', () => {
    expect(statusRequiresExtraFields({ status_case: { fields: [{ name: 'x' }] } })).toBe(true);
    expect(statusRequiresExtraFields({})).toBe(false);
  });
});
