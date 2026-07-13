// src/services/auth.service.ts
import api, { fetchCsrfToken } from '../lib/axios';
import type {
  AuthResponse,
  CurrentUserPayload,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  VerifyEmailPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '../types/auth.types';

/**
 * Daftar akun baru.
 * Otomatis mengirimkan data pendaftaran ke backend.
 */
export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>(
    '/auth/register',
    payload,
  );
  return data;
}

/**
 * Login dengan email & password.
 * Axios otomatis menerima dan menyimpan HttpOnly Cookie dari backend.
 */
export async function login(
  payload: LoginPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  await fetchCsrfToken();
  return data;
}

/**
 * Verifikasi OTP email.
 * Sama seperti login, backend akan mengatur HttpOnly Cookie secara otomatis di sini.
 */
export async function verifyEmail(
  payload: VerifyEmailPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse & { accessToken?: string }>(
    '/auth/verify-email',
    payload,
  );
  
  if (data.accessToken && typeof window !== "undefined") {
    // Manually set cookie in Next.js since backend verify-email doesn't set HttpOnly cookie directly
    await fetch("/api/auth/set-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken: data.accessToken }),
    });
  }
  
  return data;
}

/**
 * Info singkat user yang sedang login.
 * Cookie akan otomatis dikirimkan oleh browser/Axios di header request.
 */
export async function getMe(): Promise<CurrentUserPayload> {
  const { data } = await api.get<CurrentUserPayload>('/auth/me');
  return data;
}

/**
 * Lupa password.
 * Mengirimkan OTP ke email.
 */
export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/auth/forgot-password',
    payload,
  );
  return data;
}

/**
 * Reset password.
 * Menggunakan OTP untuk mereset password.
 */
export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    '/auth/reset-password',
    payload,
  );
  return data;
}

/**
 * Logout pengguna.
 * Backend akan membalas dengan instruksi (header) yang menghancurkan cookie sesi di browser.
 */
export async function logout(): Promise<{ message: string }> {
  try {
    const { data } = await api.post<{ message: string }>('/auth/logout');
    await fetchCsrfToken();
    return data;
  } catch (error) {
    await fetchCsrfToken();
    throw error;
  }
}

/**
 * Resend OTP untuk pendaftaran.
 */
export async function resendOtp(email: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/auth/resend-otp', { email });
  return data;
}
