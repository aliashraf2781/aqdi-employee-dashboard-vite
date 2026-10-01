import { describe, expect, it } from 'vitest';
import {
  availablePopupTypeOptions,
  buildPopupPayload,
  hasPopupContent,
  popupToFormValues,
  popupTypeOptionsFor,
} from './popup-contracts';

describe('popup type options', () => {
  it('hides types that already have a popup', () => {
    const options = availablePopupTypeOptions({ usedTypes: ['electronic'] });
    expect(options.some((option) => option.value === 'electronic')).toBe(false);
    expect(options.some((option) => option.value === 'old_handwritten')).toBe(true);
  });

  it('keeps the edited row type selectable', () => {
    const options = availablePopupTypeOptions({ usedTypes: ['electronic'], includeType: 'electronic' });
    expect(options.some((option) => option.value === 'electronic')).toBe(true);
  });

  it('falls back to the edited type when every type is used', () => {
    const usedTypes = availablePopupTypeOptions().map((option) => option.value);
    const options = popupTypeOptionsFor({ usedTypes, editedType: 'electronic' });
    expect(options.map((option) => option.value)).toEqual(['electronic']);
  });

  it('is empty when nothing is available and nothing is edited', () => {
    const usedTypes = availablePopupTypeOptions().map((option) => option.value);
    expect(popupTypeOptionsFor({ usedTypes, editedType: null })).toEqual([]);
  });
});

describe('popup mapping', () => {
  it('maps API rows to form values', () => {
    expect(popupToFormValues({ instrument_type: 'electronic', popup_status_contract: 1, button_text: 'ابدأ' })).toMatchObject({
      instrumentType: 'electronic',
      popupStatusContract: true,
      popupStatusRealestate: false,
      buttonText: 'ابدأ',
    });
  });

  it('builds the payload with trimmed button fields', () => {
    const payload = buildPopupPayload({
      instrumentType: 'electronic',
      popupStatusContract: true,
      popupStatusRealestate: false,
      contentPopup: '<p>x</p>',
      buttonText: ' ابدأ ',
      buttonLink: ' https://a.sa ',
    });
    expect(payload).toMatchObject({ instrument_type: 'electronic', button_text: 'ابدأ', button_link: 'https://a.sa' });
  });

  it('detects empty content', () => {
    expect(hasPopupContent('<p>&nbsp;</p>')).toBe(false);
    expect(hasPopupContent('<p>نص</p>')).toBe(true);
  });
});
