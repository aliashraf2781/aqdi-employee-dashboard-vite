import { describe, expect, it } from 'vitest';
import { absolutizeMediaUrl, fileNameFromMediaUrl, isPdfMediaUrl, resolveMediaUrl } from './media-url';

describe('media url helpers', () => {
  it('keeps absolute urls', () => {
    expect(absolutizeMediaUrl('https://x.com/a.png')).toBe('https://x.com/a.png');
  });

  it('prefixes relative paths with the media origin', () => {
    expect(absolutizeMediaUrl('/storage/a.png')).toMatch(/^https?:\/\/[^/]+\/storage\/a\.png$/);
    expect(absolutizeMediaUrl('storage/a.png')).toMatch(/\/storage\/a\.png$/);
  });

  it('reads urls from objects', () => {
    expect(resolveMediaUrl({ url: ' u ' })).toBe('u');
    expect(resolveMediaUrl(null)).toBeNull();
  });

  it('extracts file names and detects pdfs', () => {
    expect(fileNameFromMediaUrl('https://x.com/a/b%20c.pdf?x=1')).toBe('b c.pdf');
    expect(isPdfMediaUrl('a/b.PDF')).toBe(true);
  });
});
