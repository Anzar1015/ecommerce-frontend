import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

/**
 * Single Axios instance for the whole app. `withCredentials: true` is what
 * lets the browser send/receive the httpOnly auth cookies set by the backend.
 * No tokens are ever stored in JS-accessible storage (no localStorage).
 */
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let pendingQueue: { resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }[] = [];

function processQueue(error: unknown) {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  pendingQueue = [];
}

/**
 * On a 401, attempt exactly one silent refresh via /auth/refresh, then
 * retry the original request. Concurrent 401s are queued so we don't
 * fire multiple simultaneous refresh calls.
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed: the session is truly gone. The auth slice/hook
        // listening for this will redirect to login.
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
