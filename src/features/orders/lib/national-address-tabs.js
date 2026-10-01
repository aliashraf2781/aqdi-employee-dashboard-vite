import { isLikelyImageUrl } from './national-address';

const hasValue = (value) => value != null && value !== '';

export const ADDRESS_TABS = [
  { id: 'text', label: 'العنوان النصي' },
  { id: 'map', label: 'الخريطة' },
  { id: 'image', label: 'صورة العنوان' },
];

/** Image of the address card: the saved image, or the address link when that link is an image. */
export function getAddressImageUrl(address) {
  if (hasValue(address?.image_url)) return address.image_url;
  if (hasValue(address?.address_url) && isLikelyImageUrl(address.address_url)) return address.address_url;
  return null;
}

/** Google Maps link: the computed one, or the address link when it is not an image. */
export function getAddressMapsUrl(address) {
  if (hasValue(address?.maps_url)) return address.maps_url;
  if (hasValue(address?.address_url) && !isLikelyImageUrl(address.address_url)) return address.address_url;
  return null;
}

function hasTextAddress(address) {
  return [
    address?.short_address,
    address?.region,
    address?.city,
    address?.district,
    address?.building,
    address?.street,
    address?.postal_code,
    address?.additional_number,
  ].some(hasValue);
}

/** The tabs that have something to show for this address. */
export function getAvailableAddressTabs(address) {
  if (!address) return [];
  const hasData = {
    text: hasTextAddress(address),
    map: Boolean(getAddressMapsUrl(address)),
    image: Boolean(getAddressImageUrl(address)),
  };
  return ADDRESS_TABS.filter((tab) => hasData[tab.id]);
}

/** Labelled text fields of the address that have a value. */
export function getTextAddressFields(address) {
  return [
    { label: 'العنوان المختصر', value: address.short_address },
    { label: 'المنطقة', value: address.region },
    { label: 'المدينة', value: address.city },
    { label: 'الحي', value: address.district },
    { label: 'رقم المبنى', value: address.building },
    { label: 'الشارع', value: address.street },
    { label: 'الرمز البريدي', value: address.postal_code },
    { label: 'الرقم الإضافي', value: address.additional_number },
  ].filter((field) => hasValue(field.value));
}
