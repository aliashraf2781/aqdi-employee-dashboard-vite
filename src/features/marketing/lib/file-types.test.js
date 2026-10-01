import { describe, expect, it } from 'vitest';
import { getFileTypeError } from './file-types';

const image = new File(['x'], 'a.png', { type: 'image/png' });
const pdf = new File(['x'], 'a.pdf', { type: 'application/pdf' });
const text = new File(['x'], 'a.txt', { type: 'text/plain' });

describe('getFileTypeError', () => {
  it('accepts images', () => {
    expect(getFileTypeError(image, false)).toBeNull();
  });

  it('accepts pdf only when allowed', () => {
    expect(getFileTypeError(pdf, true)).toBeNull();
    expect(getFileTypeError(pdf, false)).toBe('يجب اختيار ملف صورة فقط');
  });

  it('rejects other files', () => {
    expect(getFileTypeError(text, true)).toBe('الملف يجب أن يكون صورة أو PDF');
  });
});
