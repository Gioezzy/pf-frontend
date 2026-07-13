// services/team.service.ts
// Pemisah logika API untuk modul Teams (pf-backend: /api/v1/teams/*)
// Semua endpoint di sini butuh login dengan role PARTICIPANT.

import api from '../lib/axios';
import type {
  AddMemberPayload,
  CreateTeamPayload,
  Team,
} from '../types/team.types';
import type { User } from '../types/auth.types';

/**
 * Membuat tim baru. User yang membuat otomatis menjadi ketua.
 * Satu user hanya boleh tergabung di satu tim (sebagai ketua atau anggota).
 */
export async function createTeam(payload: CreateTeamPayload): Promise<Team> {
  const { data } = await api.post<Team>('/teams', payload);
  return data;
}

/**
 * Menambah anggota ke tim milik sendiri berdasarkan email.
 * HANYA ketua tim yang boleh memanggil ini.
 */
export async function addMember(payload: AddMemberPayload): Promise<Team> {
  const { data } = await api.post<Team>('/teams/members', payload);
  return data;
}

/**
 * Info tim milik user yang sedang login (baik sebagai ketua maupun anggota).
 * Melempar 404 jika user belum tergabung di tim manapun.
 */
export async function getMyTeam(): Promise<Team> {
  const { data } = await api.get<Team>('/teams/my-team');
  return data;
}

/**
 * Membubarkan tim milik user.
 * HANYA ketua tim yang boleh memanggil ini.
 */
export async function leaveTeam(): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>('/teams/my-team');
  return data;
}

/**
 * Mengeluarkan anggota dari tim.
 * HANYA ketua tim yang boleh memanggil ini.
 */
export async function removeMember(memberId: string): Promise<Team> {
  const { data } = await api.delete<Team>(`/teams/members/${memberId}`);
  return data;
}

/**
 * Memindahkan kepemimpinan ke anggota lain.
 * HANYA ketua tim yang boleh memanggil ini.
 */
export async function transferLeadership(newLeaderId: string): Promise<Team> {
  const { data } = await api.put<Team>(`/teams/my-team/transfer-leadership/${newLeaderId}`);
  return data;
}

/**
 * Mendapatkan daftar peserta dari institusi yang sama.
 */
export async function getInstitutionPeers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users/institution-peers');
  return data;
}
