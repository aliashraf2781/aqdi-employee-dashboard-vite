import { describe, expect, it } from 'vitest';
import { ejarDocumentationSchema } from './ejar-documentation-schema';
import { propertyUpdateSchema, resolveDeedNumber } from './property-update-schema';
import { buildSendDraftBody, CONTACT_MODES, sendDraftDefaults, sendDraftSchema } from './send-draft-schema';
import { countSmsSegments, smsSchema } from './sms-schema';

describe('propertyUpdateSchema', () => {
  it('needs a method and a deed number', () => {
    const result = propertyUpdateSchema.safeParse({ method: '', deed_number: ' ' });
    expect(result.success).toBe(false);
    expect(result.error.issues.map((issue) => issue.path[0]).sort()).toEqual(['deed_number', 'method']);
    expect(propertyUpdateSchema.safeParse({ method: 'paper', deed_number: '123' }).success).toBe(true);
  });

  it('finds the saved deed number', () => {
    expect(resolveDeedNumber({ contract_summary: { instrument_number: ' 55 ' } })).toBe('55');
    expect(resolveDeedNumber({})).toBe('');
  });
});

describe('sendDraftSchema', () => {
  const valid = { ...sendDraftDefaults, draft_number: '1234567890' };

  it('accepts the registered number', () => {
    expect(sendDraftSchema.safeParse(valid).success).toBe(true);
  });

  it('requires a valid phone for another number', () => {
    const result = sendDraftSchema.safeParse({ ...valid, contact_mode: CONTACT_MODES.ANOTHER, other_number: '12' });
    expect(result.error.issues[0].path).toEqual(['other_number']);
    expect(sendDraftSchema.safeParse({ ...valid, contact_mode: CONTACT_MODES.ANOTHER, other_number: '0512345678' }).success).toBe(true);
  });

  it('builds the status body', () => {
    expect(buildSendDraftBody(8, valid)).toEqual({ status_id: 8, ejar_contract_draft_number: '1234567890', contact_number_mode: 'same' });
    expect(buildSendDraftBody('8', { ...valid, contact_mode: 'another', other_number: '0512345678' }).contact_number).toBe('0512345678');
  });
});

describe('small schemas', () => {
  it('requires the ejar number', () => {
    expect(ejarDocumentationSchema.safeParse({ ejar_number: '', notes: '' }).success).toBe(false);
    expect(ejarDocumentationSchema.safeParse({ ejar_number: '123', notes: '' }).success).toBe(true);
  });

  it('requires an sms text and counts segments', () => {
    expect(smsSchema.safeParse({ message: '  ' }).success).toBe(false);
    expect(countSmsSegments('')).toBe(1);
    expect(countSmsSegments('x'.repeat(71))).toBe(2);
  });
});
