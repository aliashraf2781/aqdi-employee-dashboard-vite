import { describe, expect, it } from 'vitest';
import { toMultipartFormData } from './single-order-api';

describe('toMultipartFormData', () => {
  it('keeps files, stringifies objects and skips empty values', () => {
    const file = new File(['x'], 'x.png');
    const form = toMultipartFormData({ image: file, ids: [1, 2], count: 3, nothing: null, missing: undefined });
    expect(form.get('image')).toBeInstanceOf(File);
    expect(form.get('ids')).toBe('[1,2]');
    expect(form.get('count')).toBe('3');
    expect(form.has('nothing')).toBe(false);
    expect(form.has('missing')).toBe(false);
  });
});
