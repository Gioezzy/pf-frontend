// services/registration.service.ts
// Pemisah logika API untuk modul Registrations
// (pf-backend: /api/v1/registrations/*)
//

import api from '../lib/axios';
import type {
  Registration,
  RegisterCompetitionPayload,
  SetChampionPayload,
  VerifyPaymentPayload,
} from '../types/registration.types';


export async function registerCompetition(
  payload: RegisterCompetitionPayload,
): Promise<Registration> {
  const { data } = await api.post<Registration>('/registrations', payload);
  return data;
}

/** (Role PARTICIPANT) Riwayat semua pendaftaran lomba milik user & timnya. */
export async function getMyRegistrations(): Promise<Registration[]> {
  const { data } = await api.get<Registration[]>(
    '/registrations/my-registrations',
  );
  return data;
}

export async function uploadPaymentProof(
  id: string,
  file: File,
  identityCardFiles: File[],
): Promise<Registration> {
  const formData = new FormData();
  formData.append('file', file);
  identityCardFiles.forEach(f => formData.append('identityCardFile', f));

  const { data } = await api.post<Registration>(
    `/registrations/${id}/payment-proof`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

/**
 * (Role TREASURER/BENDAHARA) Antrean pendaftaran lintas lomba yang menunggu
 * verifikasi bukti pembayaran, diurutkan dari yang paling lama menunggu.
 */
export async function getPendingVerifications(): Promise<Registration[]> {
  const { data } = await api.get<Registration[]>(
    '/registrations/bendahara/pending-verification',
  );
  return data;
}

export async function verifyPayment(
  id: string,
  payload: VerifyPaymentPayload,
): Promise<Registration> {
  const { data } = await api.patch<Registration>(
    `/registrations/bendahara/${id}/verify`,
    payload,
  );
  return data;
}

/**
 * (Role ADMIN/COMMITTEE/TREASURER) Daftar peserta yang sudah terverifikasi
 * pembayarannya untuk satu lomba tertentu.
 */
export async function getVerifiedParticipants(
  competitionId: string,
  config?: import('axios').AxiosRequestConfig
): Promise<Registration[]> {
  const { data } = await api.get<Registration[]>(
    `/registrations/admin/competition/${competitionId}/verified`,
    config
  );
  return data;
}

export async function setChampionTitle(
  id: string,
  payload: SetChampionPayload,
): Promise<Registration> {
  const { data } = await api.patch<Registration>(
    `/registrations/admin/${id}/set-champion`,
    payload,
  );
  return data;
}
