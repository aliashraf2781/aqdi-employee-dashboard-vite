import { describe, expect, it } from 'vitest';
import { arabicOrEnglishName, audienceLabel, contractTypeLabel } from './labels';

describe('labels', () => {
  it('translates contract types', () => {
    expect(contractTypeLabel('housing')).toBe('سكني');
    expect(contractTypeLabel('commercial')).toBe('تجاري');
  });

  it('keeps unknown values and dashes empty ones', () => {
    expect(contractTypeLabel('other')).toBe('other');
    expect(contractTypeLabel(undefined)).toBe('—');
  });

  it('translates audiences', () => {
    expect(audienceLabel('employee')).toBe('موظف');
  });

  it('prefers the Arabic name', () => {
    expect(arabicOrEnglishName({ name_ar: 'أ', name_en: 'a' })).toBe('أ');
    expect(arabicOrEnglishName({ name_en: 'a' })).toBe('a');
    expect(arabicOrEnglishName(null)).toBe('—');
  });
});
