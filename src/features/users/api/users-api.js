import { apiClient } from '@/shared/lib/api-client';

/** Returns `{ user, contracts }`. */
export async function fetchUser(userId) {
  const { data } = await apiClient.get(`/admin/users/${userId}`);
  return data?.data ?? data;
}

/** Flips the user between active and blocked. */
export async function toggleUserBlock(userId) {
  const { data } = await apiClient.post(`/admin/users/${userId}/block`);
  return data;
}

export async function deleteUser(userId) {
  const { data } = await apiClient.post(`/admin/users/${userId}/delete`);
  return data;
}

/** Texts the user by id, or by mobile number when the id is unknown. */
export async function sendUserSms({ userId, mobile, message }) {
  const recipient = userId != null ? { user_id: Number(userId) } : { mobile };
  const { data } = await apiClient.post('/admin/sms/send', { ...recipient, message });
  return data;
}
