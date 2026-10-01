import { apiClient } from '@/shared/lib/api-client';

export const SMS_SEND_API = '/admin/sms/send';
export const SMS_MESSAGE_API = '/admin/sms/message';

/** Sends an SMS. `recipient` is { user_id } or { mobile } (or { employee_id } for staff messages). */
export async function sendSms({ endpoint = SMS_SEND_API, message, recipient }) {
  const { data } = await apiClient.post(endpoint, { message, ...recipient });
  return data;
}
