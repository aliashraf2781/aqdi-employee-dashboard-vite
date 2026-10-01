import { apiClient } from '@/shared/lib/api-client';

const NOT_FOUND = 404;
const METHOD_NOT_ALLOWED = 405;

/**
 * Create/update/delete calls for a resource whose backend follows the usual convention:
 *   POST {base}            -> create
 *   POST {base}/{id}       -> update
 *   POST {base}/{id}/delete -> delete
 * Pass `createPath` / `deletePath` when a resource deviates. Each call resolves to the response body.
 */
export function createCrudApi({ basePath, createPath = basePath, allowDeleteFallback = false }) {
  return {
    create: (payload) => apiClient.post(createPath, payload).then((response) => response.data),
    update: (id, payload) => apiClient.post(`${basePath}/${id}`, payload).then((response) => response.data),
    remove: (id) => removeRecord(`${basePath}/${id}`, allowDeleteFallback),
  };
}

/** Some endpoints only accept HTTP DELETE: retry that way when POST /delete is not routed. */
async function removeRecord(recordPath, allowDeleteFallback) {
  try {
    const { data } = await apiClient.post(`${recordPath}/delete`);
    return data;
  } catch (error) {
    const status = error.response?.status;
    const canFallback = allowDeleteFallback && (status === NOT_FOUND || status === METHOD_NOT_ALLOWED);
    if (!canFallback) throw error;
    const { data } = await apiClient.delete(recordPath);
    return data;
  }
}
