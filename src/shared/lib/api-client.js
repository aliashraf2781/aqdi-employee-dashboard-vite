import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25_000,
  headers: { Accept: 'application/json', 'Accept-Language': 'ar' },
});

/**
 * The client does not import the auth store (that would make shared code depend on
 * a feature). The app wires the two together once at startup instead.
 *
 * @param {{ getToken: () => string | null, onUnauthorized: () => void }} handlers
 */
export function configureApiAuth({ getToken, onUnauthorized }) {
  apiClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) onUnauthorized();
      return Promise.reject(error);
    },
  );
}

/** Best Arabic/server message for a failed request. */
export function getErrorMessage(error, fallback = 'حدث خطأ غير متوقع') {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ECONNABORTED') return 'الخادم لا يستجيب حاليا، حاول مرة أخرى لاحقا';
  if (error?.message === 'Network Error') return 'تعذر الاتصال بالخادم، تحقق من اتصالك بالإنترنت';
  return fallback;
}
