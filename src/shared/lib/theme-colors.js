/**
 * Reads colors from the CSS tokens in src/styles/tokens.css, for the few places that
 * cannot use Tailwind classes (native <input type="color">, print windows, canvas).
 * Raw color values therefore still live only in tokens.css.
 */

/** Returns the [r, g, b] channels of a token, e.g. readTokenChannels('primary'). */
export function readTokenChannels(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`);
  const channels = raw.trim().split(/\s+/).map(Number);
  return channels.length === 3 && channels.every(Number.isFinite) ? channels : null;
}

/** CSS rgb() string for inline styles and generated CSS, or '' if the token is missing. */
export function tokenToRgb(name) {
  const channels = readTokenChannels(name);
  return channels ? `rgb(${channels.join(', ')})` : '';
}

/** Hex string for APIs and color inputs that need it, or '' if the token is missing. */
export function tokenToHex(name) {
  const channels = readTokenChannels(name);
  if (!channels) return '';
  return `#${channels.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}
