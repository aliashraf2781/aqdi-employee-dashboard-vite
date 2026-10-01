import { describe, expect, it } from 'vitest';
import {
  buildWebsiteImageFormData,
  extractWebsiteImages,
  PUBLIC_WEBSITE_ORIGIN,
  resolveImageUrl,
  websiteImageToForm,
} from './website-images';

describe('extractWebsiteImages', () => {
  it('reads items from items or data', () => {
    expect(extractWebsiteImages({ data: { items: [1], summary: { total: 1 } } })).toEqual({ items: [1], summary: { total: 1 } });
    expect(extractWebsiteImages({ data: { data: [2] } }).items).toEqual([2]);
    expect(extractWebsiteImages(null).items).toEqual([]);
  });
});

describe('resolveImageUrl', () => {
  it('moves api-host /website files to the public site', () => {
    expect(resolveImageUrl({ url: 'https://api.test/website/a.svg' })).toBe(`${PUBLIC_WEBSITE_ORIGIN}/website/a.svg`);
  });

  it('keeps other absolute urls and prefixes relative paths', () => {
    expect(resolveImageUrl({ url: 'https://cdn.test/x.png' })).toBe('https://cdn.test/x.png');
    expect(resolveImageUrl({ static_path: 'website/a.svg' })).toBe(`${PUBLIC_WEBSITE_ORIGIN}/website/a.svg`);
    expect(resolveImageUrl({})).toBe('');
  });
});

describe('websiteImageToForm', () => {
  it('stringifies values and defaults to active', () => {
    const form = websiteImageToForm({ alt_ar: 'نص', sort_order: 3 });
    expect(form.alt_ar).toBe('نص');
    expect(form.sort_order).toBe('3');
    expect(form.is_active).toBe(true);
    expect(websiteImageToForm({ is_active: false }).is_active).toBe(false);
  });
});

describe('buildWebsiteImageFormData', () => {
  it('trims, skips empty optional fields and sends the key on create', () => {
    const body = buildWebsiteImageFormData({ ...websiteImageToForm(null), alt_ar: ' x ', is_active: false }, { key: 'logo' });
    expect(body.get('key')).toBe('logo');
    expect(body.get('alt_ar')).toBe('x');
    expect(body.get('is_active')).toBe('0');
    expect(body.has('static_path')).toBe(false);
    expect(body.has('sort_order')).toBe(false);
  });
});
