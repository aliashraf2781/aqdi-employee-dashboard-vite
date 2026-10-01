import { describe, expect, it } from 'vitest';
import { legacyContentRedirectPath, marketingTabPath, websiteDetailsPath } from './routes';

describe('marketing paths', () => {
  it('builds the tab path', () => {
    expect(marketingTabPath('seo')).toBe('/home/marketing-and-content?tab=seo');
  });

  it('encodes the page in the details path', () => {
    expect(websiteDetailsPath({ page: '/a b', issueId: 4 })).toBe('/home/marketing-and-content/website-details?page=%2Fa+b&issueId=4');
  });
});

describe('legacyContentRedirectPath', () => {
  it('keeps the known tabs', () => {
    expect(legacyContentRedirectPath('about')).toBe('/home/marketing-and-content?tab=content&view=about');
    expect(legacyContentRedirectPath('images')).toBe('/home/marketing-and-content?tab=content&view=images');
  });

  it('falls back to home', () => {
    expect(legacyContentRedirectPath(null)).toBe('/home/marketing-and-content?tab=content&view=home');
    expect(legacyContentRedirectPath('nope')).toBe('/home/marketing-and-content?tab=content&view=home');
  });
});
