import { stripHtml } from '@/shared/lib/html';
import { POPUP_INSTRUMENT_TYPES, popupInstrumentTypeLabel } from '@/features/contract-settings/lib/instrument-types';

export const EMPTY_POPUP_FORM = {
  instrumentType: '',
  popupStatusContract: true,
  popupStatusRealestate: false,
  contentPopup: '',
  buttonText: '',
  buttonLink: '',
};

/** One popup per document type: hide types that already have one (except the row being edited). */
export function availablePopupTypeOptions({ usedTypes = [], includeType = null } = {}) {
  const taken = new Set(usedTypes.filter((type) => type && type !== includeType));
  return POPUP_INSTRUMENT_TYPES.filter((option) => !taken.has(option.value));
}

/** Options for the type dropdown. When editing, the row's own type is always selectable. */
export function popupTypeOptionsFor({ usedTypes, editedType }) {
  const options = availablePopupTypeOptions({ usedTypes, includeType: editedType });
  if (options.length > 0 || !editedType) return options;
  return [{ value: editedType, label: popupInstrumentTypeLabel(editedType) }];
}

export function popupToFormValues(item) {
  return {
    instrumentType: item.instrument_type || '',
    popupStatusContract: Boolean(item.popup_status_contract),
    popupStatusRealestate: Boolean(item.popup_status_realestate),
    contentPopup: item.content_popup || '',
    buttonText: item.button_text || '',
    buttonLink: item.button_link || '',
  };
}

export function buildPopupPayload(values) {
  return {
    instrument_type: values.instrumentType,
    popup_status_contract: values.popupStatusContract,
    popup_status_realestate: values.popupStatusRealestate,
    content_popup: values.contentPopup,
    button_text: values.buttonText.trim(),
    button_link: values.buttonLink.trim(),
  };
}

export const hasPopupContent = (html) => stripHtml(html) !== '';
export const popupStatusLabel = (active) => (active ? 'مفعل' : 'غير مفعل');
