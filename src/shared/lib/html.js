const HTML_TAGS = /<[^>]*>/g;

/** HTML -> plain text, used to detect an "empty" editor and to preview rich descriptions. */
export function stripHtml(html) {
  return String(html || '')
    .replace(HTML_TAGS, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
