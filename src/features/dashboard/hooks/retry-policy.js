const MAX_RETRIES = 2;

/** Never retry auth failures: the user just lacks access (or must log in again). */
export function retryUnlessAuthError(failureCount, error) {
  const status = error?.response?.status;
  if (status === 401 || status === 403) return false;
  return failureCount < MAX_RETRIES;
}
