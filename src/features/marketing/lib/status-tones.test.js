import { describe, expect, it } from 'vitest';
import { getPublishTone, getRoasTone, getSeverityTone } from './status-tones';

describe('status tones', () => {
  it('maps english keys and arabic labels', () => {
    expect(getPublishTone('published')).toBe('success');
    expect(getPublishTone('مسودة')).toBe('warning');
    expect(getPublishTone('unknown')).toBe('neutral');
  });

  it('maps severity and roas tone', () => {
    expect(getSeverityTone('high')).toBe('danger');
    expect(getRoasTone('good')).toBe('success');
    expect(getRoasTone(undefined)).toBe('neutral');
  });
});
