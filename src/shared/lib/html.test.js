import { describe, expect, it } from 'vitest';
import { stripHtml } from './html';

describe('stripHtml', () => {
  it('removes tags and collapses spaces', () => {
    expect(stripHtml('<p>مرحبا <b>بك</b></p>')).toBe('مرحبا بك');
  });

  it('treats non-breaking spaces as spaces', () => {
    expect(stripHtml('<p>&nbsp;</p>')).toBe('');
  });

  it('handles empty input', () => {
    expect(stripHtml(undefined)).toBe('');
  });
});
