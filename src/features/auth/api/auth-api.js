import { apiClient } from '@/shared/lib/api-client';

const LOGIN_ENDPOINT = '/admin/employees/login';
const LOGOUT_ENDPOINT = '/admin/employees/logout';

export async function login({ email, password, remember }) {
  const { data } = await apiClient.post(LOGIN_ENDPOINT, {
    email,
    password,
    remember_me: remember,
  });
  return data;
}

export async function logout() {
  await apiClient.post(LOGOUT_ENDPOINT).catch(() => {});
}
