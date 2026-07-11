// lib/axios.ts
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_BASE_URL } from './constants';

// ── State CSRF ───────────────────────────────────────────────────────────
let csrfToken: string | null = null;

// Fungsi untuk mengambil CSRF token terbaru dari backend
export async function fetchCsrfToken(): Promise<void> {
  try {
    // Jangan gunakan instance 'api' agar tidak terjebak infinite loop
    const { data } = await axios.get(`${API_BASE_URL}/csrf-token`, {
      withCredentials: true,
    });
    csrfToken = data.csrfToken;
  } catch (error) {
    console.error('Gagal mengambil CSRF token:', error);
  }
}

// ── Axios Instance ───────────────────────────────────────────────────────
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Menyisipkan header X-CSRF-Token
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const { method } = config;
  const methodsRequiringCsrf = ['post', 'put', 'patch', 'delete'];

  // Jika request mengubah data, pastikan token CSRF dilampirkan
  if (method && methodsRequiringCsrf.includes(method.toLowerCase())) {
    if (!csrfToken) {
      await fetchCsrfToken();
    }

    if (csrfToken) {
      config.headers.set('X-CSRF-Token', csrfToken);
    }
  }

  // Jika payload adalah FormData, hapus Content-Type agar Axios/Browser 
  // dapat otomatis menghitung boundary untuk multipart/form-data.
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }

  return config;
});

// Response Interceptor: Penanganan 401 dan 403 (Invalid CSRF)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    // Penanganan Sesi Habis (401)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const isOnAuthPage = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/verify') || path.startsWith('/forgot-password') || path.startsWith('/reset-password');
        const isPublicPage = path === '/';
        
        if (!isOnAuthPage && !isPublicPage) {
          // Bersihkan cookie/storage lokal jika ada sebagai fallback (jika endpoint gagal)
          document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          
          // Panggil API internal Next.js untuk menghancurkan cookie HttpOnly
          try {
            await fetch('/api/auth/clear', { method: 'POST' });
          } catch (e) {
            // Abaikan jika gagal
          }
          
          // Setelah cookie benar-benar hancur, baru arahkan ke login dengan parameter
          window.location.href = '/login?session_expired=true';
        }
      }
    }

    if (error.response?.status === 403) {
      csrfToken = null;
    }

    // Penanganan CSRF Token Kedaluwarsa/Invalid (403)
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
      // (Opsional) reset csrfToken var
    }

    return Promise.reject(error);
  },
);

export default api;

// ── Error Helper ─────────────────────────────────────────────────────────

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  module?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Terjadi kesalahan. Silakan coba lagi.',
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    if (!data) return error.message || fallback;

    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }
    if (typeof data.message === 'string') {
      return data.message;
    }
  }
  return fallback;
}
