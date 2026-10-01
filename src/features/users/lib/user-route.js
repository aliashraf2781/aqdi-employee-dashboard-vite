export const DEFAULT_BACK_URL = '/home/reports?tab=users';
const CLIENT_FILE_ID_PREFIX = 'c-';
const CLIENTS_URL_PREFIX = '/home/clients';

/** Links from the clients list (or ids like "c-12") open the client file, not a plain user page. */
export function isClientFileRoute(userId, from) {
  if (typeof from === 'string' && from.includes(CLIENTS_URL_PREFIX)) return true;
  return String(userId ?? '').startsWith(CLIENT_FILE_ID_PREFIX);
}

/** `from` is normally a path; older links passed just a report segment name. */
export function resolveBackUrl(from) {
  return from.startsWith('/') ? from : `${DEFAULT_BACK_URL}&segment=${from}`;
}
