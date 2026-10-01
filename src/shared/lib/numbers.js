/** Number typed into a text input -> number, or null when empty / not numeric. */
export function toNumberOrNull(value) {
  if (value === '' || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
