/** First value that is neither null/undefined nor an empty string, or null when there is none. */
export function pick(...values) {
  const found = values.find((value) => value != null && value !== '');
  return found === undefined ? null : found;
}
