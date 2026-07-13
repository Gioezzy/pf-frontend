// services/competition.service.ts
// Pemisah logika API untuk modul Competitions
// (pf-backend: /api/v1/competitions/*)
//
// Catatan: GET list & GET detail di-cache server-side 5 menit oleh backend
// (CacheInterceptor). Perubahan dari admin mungkin tidak langsung terlihat.

import api from '../lib/axios';
import type {
  Competition,
  CompetitionWave,
  CreateCompetitionPayload,
  UpdateCompetitionPayload,
  UpdateWavePayload,
} from '../types/competition.types';

/** [KHUSUS ADMIN] Daftar semua lomba beserta wave/gelombang pendaftarannya (Termasuk Non-Aktif). */
export async function getAllCompetitions(config?: import('axios').AxiosRequestConfig): Promise<Competition[]> {
  const { data } = await api.get<Competition[]>('/competitions/admin/list', config);
  return data;
}

/** [PUBLIC] Daftar lomba yang aktif saja. */
export async function getActiveCompetitions(): Promise<Competition[]> {
  const { data } = await api.get<Competition[]>('/competitions');
  return data;
}

/** [PUBLIC] Detail satu lomba berdasarkan ID. */
export async function getCompetitionById(id: string): Promise<Competition> {
  const { data } = await api.get<Competition>(`/competitions/${id}`);
  return data;
}

/** (Khusus role ADMIN) Membuat lomba baru + wave-nya sekaligus. */
export async function createCompetition(
  payload: CreateCompetitionPayload,
): Promise<Competition> {
  const { data } = await api.post<Competition>('/competitions', payload);
  return data;
}

/**
 * (Khusus role ADMIN) Update data lomba, termasuk soft-disable via
 * `isActive: false`. Field `waves` tidak bisa diubah di sini — gunakan
 * updateWave() untuk itu.
 */
export async function updateCompetition(
  id: string,
  payload: UpdateCompetitionPayload,
): Promise<Competition> {
  const { data } = await api.patch<Competition>(
    `/competitions/${id}`,
    payload,
  );
  return data;
}

/** (Khusus role ADMIN) Soft-delete (menonaktifkan) lomba. */
export async function deleteCompetition(
  id: string,
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/competitions/${id}`,
  );
  return data;
}

/** (Khusus role ADMIN) Update satu wave/gelombang tertentu (harga/jadwal). */
export async function updateWave(
  waveId: string,
  payload: UpdateWavePayload,
): Promise<CompetitionWave> {
  const { data } = await api.patch<CompetitionWave>(
    `/competitions/waves/${waveId}`,
    payload,
  );
  return data;
}

/** (Khusus role ADMIN) Import array JSON perlombaan. */
export async function importCompetitions(
  payload: CreateCompetitionPayload[],
): Promise<{ imported: number; skipped: number }> {
  const { data } = await api.post<{ imported: number; skipped: number }>(
    '/competitions/import',
    payload,
  );
  return data;
}
