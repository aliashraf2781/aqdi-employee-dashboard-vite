import { describe, expect, it } from 'vitest';
import { getAddressImageUrl, getAddressMapsUrl, getAvailableAddressTabs, getTextAddressFields } from './national-address-tabs';

describe('national address tabs', () => {
  it('lists only the tabs with data', () => {
    expect(getAvailableAddressTabs(null)).toEqual([]);
    expect(getAvailableAddressTabs({ street: 's' }).map((tab) => tab.id)).toEqual(['text']);
    expect(getAvailableAddressTabs({ maps_url: 'https://maps.google.com/x', image_url: 'a.png' }).map((tab) => tab.id)).toEqual([
      'map',
      'image',
    ]);
  });

  it('treats an image address link as the image, not the map', () => {
    const address = { address_url: 'https://x.com/card.png' };
    expect(getAddressImageUrl(address)).toBe('https://x.com/card.png');
    expect(getAddressMapsUrl(address)).toBeNull();
  });

  it('keeps only filled text fields', () => {
    expect(getTextAddressFields({ city: 'الرياض', street: '' })).toEqual([{ label: 'المدينة', value: 'الرياض' }]);
  });
});
