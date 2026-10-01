import { describe, expect, it } from 'vitest';
import { marketingTabPath, websiteDetailsPath } from './routes';

describe('marketing paths', () => {
  it('builds the tab path', () => {
    expect(marketingTabPath('seo')).toBe('/home/marketing-and-content?tab=seo');
  });

  it('encodes the page in the details path', () => {
    expect(websiteDetailsPath({ page: '/a b', issueId: 4 })).toBe('/home/marketing-and-content/website-details?page=%2Fa+b&issueId=4');
  });
});
