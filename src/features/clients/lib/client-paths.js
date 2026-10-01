/** Route builders and the `?from=` back-link convention used across the client screens. */

export const CLIENTS_PATH = '/home/clients';

export const clientPath = (clientId) => `${CLIENTS_PATH}/${clientId}`;
export const clientPropertiesPath = (clientId) => `${CLIENTS_PATH}/${clientId}/properties`;
export const clientDiscountPath = (clientId) => `${CLIENTS_PATH}/${clientId}/discount`;
export const orderPath = (orderId) => `/home/orders/${orderId}`;

/** Appends `?from=<path>` so the next screen knows where "back" should lead. */
export function withFrom(path, from) {
  return `${path}?from=${encodeURIComponent(from)}`;
}

/** Only same-app paths are accepted, so a crafted `from` can never redirect off-site. */
export function resolveBackPath(from, fallback) {
  return from && from.startsWith('/') && !from.startsWith('//') ? from : fallback;
}
