import { apiClient } from '@/shared/lib/api-client';
import { pickItems } from '@/features/settings/lib/list-response';
import { buildNotificationRequest } from '@/features/settings/lib/notification-targets';

const RECIPIENT_LIMIT = 50;

export async function sendNotification(values) {
  const { endpoint, payload } = buildNotificationRequest(values);
  const { data } = await apiClient.post(endpoint, payload);
  return data;
}

/** Users or employees matching `search`, for the recipient dropdown. */
export async function fetchRecipients({ kind, search }) {
  const path = kind === 'employee' ? '/admin/employees' : '/admin/users';
  const { data } = await apiClient.get(path, {
    params: { page: 1, per_page: RECIPIENT_LIMIT, search: search || undefined },
  });
  return pickItems(data);
}
