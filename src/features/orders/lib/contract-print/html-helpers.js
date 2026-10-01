const EMPTY_VALUE = '---';

/** Text shown in a print cell for any kind of value. */
export function display(value) {
  if (value == null || value === '') return EMPTY_VALUE;
  if (Array.isArray(value)) return value.filter(Boolean).join('، ') || EMPTY_VALUE;
  if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
  return String(value);
}

/** A titled two-column table. Rows without a value are dropped; no rows means no section. */
export function section(title, rows) {
  const items = rows
    .filter(([, value]) => value != null && value !== '')
    .map(([label, value]) => `<tr><td class="label">${label}</td><td class="value">${display(value)}</td></tr>`)
    .join('');

  if (!items) return '';
  return `<section class="section"><h2>${title}</h2><table>${items}</table></section>`;
}

export function imagesSection(urls) {
  if (!urls.length) return '';
  const images = urls.map((src) => `<img src="${src}" alt="صورة الصك" />`).join('');
  return `<section class="section"><h2>صور الصك</h2><div class="images">${images}</div></section>`;
}
