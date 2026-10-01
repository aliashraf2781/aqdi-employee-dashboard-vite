import { describe, expect, it } from 'vitest';
import { buildRecordPayload, buildRecordSchema, mapApiFieldErrors, recordToFormValues } from './record-settings';

const fields = [
  { name: 'sms_user', type: 'textarea' },
  { name: 'fee', type: 'number' },
];

describe('recordToFormValues', () => {
  it('stringifies values and blanks missing ones', () => {
    expect(recordToFormValues({ sms_user: 'مرحبا', fee: 12 }, fields)).toEqual({ sms_user: 'مرحبا', fee: '12' });
    expect(recordToFormValues(null, fields)).toEqual({ sms_user: '', fee: '' });
  });
});

describe('buildRecordPayload', () => {
  it('trims text and converts numbers', () => {
    expect(buildRecordPayload({ sms_user: ' م ', fee: '15.5' }, fields)).toEqual({ sms_user: 'م', fee: 15.5 });
  });

  it('sends null for empty numbers', () => {
    expect(buildRecordPayload({ sms_user: '', fee: ' ' }, fields).fee).toBeNull();
  });
});

describe('buildRecordSchema', () => {
  const schema = buildRecordSchema(fields);

  it('accepts empty and positive numbers', () => {
    expect(schema.safeParse({ sms_user: '', fee: '' }).success).toBe(true);
    expect(schema.safeParse({ sms_user: '', fee: '3' }).success).toBe(true);
  });

  it('rejects negative numbers', () => {
    expect(schema.safeParse({ sms_user: '', fee: '-1' }).success).toBe(false);
  });
});

describe('mapApiFieldErrors', () => {
  it('keeps the first message of each field', () => {
    expect(mapApiFieldErrors({ fee: ['خطأ 1', 'خطأ 2'], other: 'x' })).toEqual({ fee: 'خطأ 1', other: 'x' });
    expect(mapApiFieldErrors(undefined)).toEqual({});
  });
});
