// services/user.service.ts
// Pemisah logika API untuk modul Users (pf-backend: /api/v1/users/*)

import api from '../lib/axios';
import type {
  AdminCreateUserPayload,
  AdminCreateUserResponse,
  UpdateAvatarPayload,
  UpdateUserPayload,
  User,
} from '../types/auth.types';

/**
 * (Khusus role ADMIN) Membuat akun user baru yang langsung terverifikasi
 * tanpa perlu OTP email.
 */
export async function adminCreateUser(
  payload: AdminCreateUserPayload,
): Promise<AdminCreateUserResponse> {
  const { data } = await api.post<AdminCreateUserResponse>(
    '/users/admin/create',
    payload,
  );
  return data;
}

/** Profil lengkap user yang sedang login. Response di-cache browser 60 detik (busted via timestamp). */
export async function getMyProfile(config?: import('axios').AxiosRequestConfig): Promise<User> {
  const { data } = await api.get<User>(`/users/me?t=${Date.now()}`, config);
  return data;
}

/**
 * Ambil profil berdasarkan ID. Backend HANYA mengizinkan mengakses profil
 * milik sendiri (id harus sama dengan userId token, selain itu 403).
 * Untuk kebutuhan umum, lebih baik pakai getMyProfile().
 */
export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
}

/**
 * Update profil sendiri (nama dan/atau password). `id` harus sama dengan
 * userId token yang sedang login. Untuk ganti password, currentPassword
 * dan newPassword WAJIB dikirim bersamaan.
 */
export async function updateProfile(
  id: string,
  payload: UpdateUserPayload,
): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}`, payload);
  return data;
}

/**
 * Perbarui foto profil sendiri. Endpoint ini hanya menerima URL, bukan
 * file mentah — upload dulu file-nya via `storage.service.uploadFile()`
 * (purpose: `FilePurpose.PROFILE_PHOTO`), lalu kirim `fileUrl` hasilnya
 * ke sini sebagai `avatarUrl`.
 *
 * ⚠️ Lihat catatan di `types/auth.types.ts` (`User`) — response dari
 * endpoint ini TIDAK akan menyertakan `avatarUrl` karena keterbatasan
 * mapper di backend saat ini, walau update-nya sendiri berhasil.
 */
export async function updateAvatar(
  payload: UpdateAvatarPayload,
): Promise<User> {
  const { data } = await api.patch<User>('/users/me/avatar', payload);
  return data;
}

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getAllUsers(params: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
} = {}): Promise<PaginatedUsersResponse> {
  const { data } = await api.get<PaginatedUsersResponse>('/users', { params });
  return data;
}

export async function searchParticipants(query: string): Promise<User[]> {
  const { data } = await api.get<User[]>('/users/search', { params: { q: query } });
  return data;
}
