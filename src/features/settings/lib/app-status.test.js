import { describe, expect, it } from 'vitest';
import { buildMobilePayload, buildPlatformPayload, buildWebsitePayload, extractAppStatus } from './app-status';

describe('extractAppStatus', () => {
  it('returns defaults without data', () => {
    const status = extractAppStatus(undefined);
    expect(status.website.is_open).toBe(true);
    expect(status.android).not.toHaveProperty('message_ar');
  });

  it('reads website, mobile and platform blocks', () => {
    const status = extractAppStatus({
      data: {
        website: { is_open: 0, message_ar: 'صيانة' },
        mobile: { is_open: '1' },
        ios: { latest_version: '2.0', force_update: 1 },
      },
    });
    expect(status.website).toEqual({ is_open: false, message_ar: 'صيانة', message_en: '' });
    expect(status.mobile.is_open).toBe(true);
    expect(status.ios).toMatchObject({ latest_version: '2.0', force_update: true, store_url: '' });
  });
});

describe('payload builders', () => {
  it('builds the mobile payload', () => {
    expect(buildMobilePayload(false)).toEqual({ mobile: { is_open: false } });
  });

  it('trims website messages', () => {
    expect(buildWebsitePayload({ is_open: true, message_ar: ' أ ', message_en: ' b ' })).toEqual({
      website: { is_open: true, message_ar: 'أ', message_en: 'b' },
    });
  });

  it('only sends the fields of that platform', () => {
    const payload = buildPlatformPayload('android', { latest_version: ' 1 ', min_version: '', store_url: 'u', force_update: true, message_ar: 'x' });
    expect(payload).toEqual({ android: { force_update: true, latest_version: '1', min_version: '', store_url: 'u' } });
  });
});
