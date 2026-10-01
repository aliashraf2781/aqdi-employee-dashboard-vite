import { describe, expect, it } from 'vitest';
import { extractGeneralSettings } from './general-settings';

describe('extractGeneralSettings', () => {
  it('uses defaults without data', () => {
    expect(extractGeneralSettings(undefined)).toEqual({
      apple_store: false,
      android_store: true,
      website_status: true,
      thank_you_card: true,
    });
  });

  it('reads plain values and { enabled } objects', () => {
    const settings = extractGeneralSettings({
      data: { apple_store: 1, android_store: { key: 'android_store', enabled: false }, website_status: '0' },
    });
    expect(settings).toMatchObject({ apple_store: true, android_store: false, website_status: false, thank_you_card: true });
  });

  it('reads the first item of an items list', () => {
    expect(extractGeneralSettings({ data: { items: [{ apple_store: true }] } }).apple_store).toBe(true);
  });
});
