const CLIENT_ERROR_STATUSES = [401, 403, 404, 422];
const MAX_RETRIES = 2;

/** React Query `retry`: retrying a 401/403/404/422 never helps, so give up at once. */
export function retryUnlessClientError(failureCount, error) {
  if (CLIENT_ERROR_STATUSES.includes(error?.response?.status)) return false;
  return failureCount < MAX_RETRIES;
}
