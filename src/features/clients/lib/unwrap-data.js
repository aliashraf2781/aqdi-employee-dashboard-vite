/** The API wraps payloads as `{ data: { data: ... } }`; this returns the innermost payload. */
export function unwrapData(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}
