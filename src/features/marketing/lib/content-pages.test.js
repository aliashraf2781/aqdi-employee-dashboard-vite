import { describe, expect, it } from 'vitest';
import {
  assetFormValue,
  buildPageMetaFormData,
  buildSectionFormData,
  extractContentSections,
  extractPageMeta,
  getStringValue,
} from './content-pages';

describe('getStringValue', () => {
  it('keeps strings, stringifies numbers, otherwise falls back', () => {
    expect(getStringValue('a')).toBe('a');
    expect(getStringValue(5)).toBe('5');
    expect(getStringValue(null, 'x')).toBe('x');
  });
});

describe('extractContentSections', () => {
  it('unwraps data.sections', () => {
    expect(extractContentSections({ data: { sections: { hero: 1 } } })).toEqual({ hero: 1 });
  });
});

describe('extractPageMeta', () => {
  it('reads top-level, nested and legacy fields', () => {
    expect(extractPageMeta({ data: { meta_title: 'T', meta_description: 'D' } })).toEqual({ meta_title: 'T', meta_description: 'D' });
    expect(extractPageMeta({ data: { seo: { meta_title_ar: 'T2' } } }).meta_title).toBe('T2');
  });
});

describe('buildPageMetaFormData', () => {
  it('trims the values', () => {
    const body = buildPageMetaFormData({ meta_title: ' a ', meta_description: 'b' });
    expect(body.get('meta_title')).toBe('a');
    expect(body.get('meta_description')).toBe('b');
  });
});

describe('assetFormValue', () => {
  it('sends the file when one was picked', () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    expect(assetFormValue(file, false)).toEqual({ image: file });
  });

  it('sends keep flags otherwise', () => {
    expect(assetFormValue(null, false)).toEqual({ keep_image: '1' });
    expect(assetFormValue(null, true, 'license_file', 'license')).toEqual({ keep_license: '0' });
  });
});

describe('buildSectionFormData', () => {
  it('nests keys with the section prefix and skips empty values', () => {
    const body = buildSectionFormData('pricing', {
      title: ' T ',
      skipped: null,
      cards: [{ id: '1', features: [{ text: 'f' }] }],
    });
    expect(body.get('pricing[title]')).toBe('T');
    expect(body.has('pricing[skipped]')).toBe(false);
    expect(body.get('pricing[cards][0][id]')).toBe('1');
    expect(body.get('pricing[cards][0][features][0][text]')).toBe('f');
  });
});
