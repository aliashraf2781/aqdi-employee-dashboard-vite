/**
 * TODO: Firebase push messaging is out of scope for this port. The source app
 * registers a service worker and listens for new-order pushes here. Callers can
 * already use this hook; it just never receives anything yet.
 */
export function usePushNotifications() {
  return { isSupported: false, permission: 'unsupported' };
}
