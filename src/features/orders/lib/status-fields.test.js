import { describe, expect, it } from 'vitest';
import {
  buildEmptyStatusValues,
  buildStatusFieldsSchema,
  getFieldLabel,
  isFieldRequired,
  isFieldVisible,
} from './status-fields';

const fields = [
  { name: 'deed_type', type: 'select', required: true },
  { name: 'deed_number', type: 'text', required_if: ['deed_type', 'old'] },
  { name: 'attachment', type: 'file' },
];

describe('status fields', () => {
  it('builds empty values', () => {
    expect(buildEmptyStatusValues(fields)).toEqual({ deed_type: '', deed_number: '', attachment: null });
  });

  it('shows required_if fields only when the condition matches', () => {
    expect(isFieldVisible(fields[1], { deed_type: 'new' })).toBe(false);
    expect(isFieldVisible(fields[1], { deed_type: 'old' })).toBe(true);
    expect(isFieldRequired(fields[1], { deed_type: 'old' })).toBe(true);
    expect(isFieldVisible(fields[0], {})).toBe(true);
  });

  it('requires visible required fields', () => {
    const schema = buildStatusFieldsSchema(fields);
    expect(schema.safeParse({ deed_type: '', deed_number: '', attachment: null }).success).toBe(false);
    expect(schema.safeParse({ deed_type: 'new', deed_number: '', attachment: null }).success).toBe(true);
    const result = schema.safeParse({ deed_type: 'old', deed_number: '', attachment: null });
    expect(result.error.issues.map((issue) => issue.path[0])).toEqual(['deed_number']);
  });

  it('labels fields in Arabic first', () => {
    expect(getFieldLabel({ name: 'x', label_ar: 'عربي', label_en: 'en' })).toBe('عربي');
    expect(getFieldLabel({ name: 'x' })).toBe('x');
  });
});
