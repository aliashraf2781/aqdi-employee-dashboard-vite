/* Field definitions that nearly every content section repeats. */

export const badgeField = (placeholder, defaultValue, label = 'الشارة') => ({
  name: 'badge_text',
  label,
  placeholder,
  default: defaultValue,
  required: 'نص الشارة مطلوب',
});

export const mainTitleField = (placeholder, defaultValue, { multiline = false } = {}) => ({
  name: 'main_title',
  label: 'العنوان الرئيسي',
  placeholder,
  default: defaultValue,
  multiline,
  required: 'العنوان الرئيسي مطلوب',
});

export const descriptionField = (placeholder, defaultValue, hint) => ({
  name: 'description',
  label: 'الوصف',
  placeholder,
  default: defaultValue,
  hint,
  multiline: true,
  required: 'الوصف مطلوب',
});

/** Title + description pair used by most card lists. */
export const titleDescriptionFields = (titleRequired, descriptionRequired, titlePlaceholder, descriptionPlaceholder) => [
  { name: 'title', label: 'العنوان', placeholder: titlePlaceholder, required: titleRequired },
  { name: 'description', label: 'الوصف', multiline: true, placeholder: descriptionPlaceholder, required: descriptionRequired },
];

/** Placeholder taken from the default cards, falling back to a fixed text. */
export const placeholderFromDefaults = (defaults, key, fallback) => (index) => defaults[index]?.[key] || fallback;
