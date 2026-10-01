import { describe, expect, it } from 'vitest';
import { buildAdSpendRow } from './ad-spend';

describe('buildAdSpendRow', () => {
  it('converts numbers and falls back to the manual campaign', () => {
    expect(buildAdSpendRow({ spent_on: '2025-01-01', platform: 'google', campaign_name: ' ', spend: '12.5', impressions: '', clicks: '3' })).toEqual({
      spent_on: '2025-01-01',
      platform: 'google',
      campaign_id: 'manual',
      campaign_name: 'إدخال يدوي',
      spend: 12.5,
      currency: 'SAR',
      impressions: 0,
      clicks: 3,
    });
  });

  it('keeps a typed campaign name', () => {
    const row = buildAdSpendRow({ spent_on: 'd', platform: 'meta', campaign_name: 'Summer', spend: '1', impressions: '5', clicks: '' });
    expect(row.campaign_id).toBe('Summer');
    expect(row.campaign_name).toBe('Summer');
  });
});
