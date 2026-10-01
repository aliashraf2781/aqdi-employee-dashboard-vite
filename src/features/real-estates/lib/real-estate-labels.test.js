import { describe, expect, it } from 'vitest';
import { displayValue, EMPTY_VALUE, getInstrumentTypeLabel } from './real-estate-labels';

describe('displayValue', () => {
  it('shows a placeholder for empty values', () => {
    expect(displayValue(null)).toBe(EMPTY_VALUE);
    expect(displayValue(undefined)).toBe(EMPTY_VALUE);
    expect(displayValue('')).toBe(EMPTY_VALUE);
  });

  it('keeps zero and text', () => {
    expect(displayValue(0)).toBe('0');
    expect(displayValue('abc')).toBe('abc');
  });
});

describe('getInstrumentTypeLabel', () => {
  it('maps known types', () => {
    expect(getInstrumentTypeLabel('electronic')).toBe('صك إلكتروني');
    expect(getInstrumentTypeLabel('paper')).toBe('صك ورقي');
    expect(getInstrumentTypeLabel('handwritten')).toBe('صك ورقي');
  });

  it('falls back to the raw value', () => {
    expect(getInstrumentTypeLabel('other')).toBe('other');
    expect(getInstrumentTypeLabel(null)).toBe(EMPTY_VALUE);
  });
});
