// services/submission.service.ts
// Pemisah logika API untuk modul Submissions
// (pf-backend: /api/v1/submissions/*)

import api from '../lib/axios';
import type {
  CreateSubmissionPayload,
  Submission,
} from '../types/submission.types';

/**
 * (Role PARTICIPANT) Mengunggah/mengumpulkan karya lomba.
 *
 * Lihat catatan di `types/submission.types.ts` (`CreateSubmissionPayload`)
 * untuk penjelasan kenapa `file` dan `fileUrl` sama-sama wajib dikirim.
 * Alur yang direkomendasikan di halaman submit karya:
 *   1) `uploadFile({ file, purpose: FilePurpose.COMPETITION_WORK, context: 'submissions' })`
 *      dari `storage.service.ts` → ambil `fileUrl` dari hasilnya.
 *   2) Panggil `createSubmission({ ...form, fileUrl, file })`.
 */
export async function createSubmission(
  payload: CreateSubmissionPayload,
): Promise<Submission> {
  const formData = new FormData();
  formData.append('registrationId', payload.registrationId);
  formData.append('title', payload.title);
  if (payload.description) {
    formData.append('description', payload.description);
  }
  formData.append('file', payload.file);
  if (payload.originalityFile) {
    formData.append('originalityFile', payload.originalityFile);
  }

  // PENTING: jangan set header Content-Type secara manual di sini.
  // Axios otomatis menghitung `multipart/form-data; boundary=...` yang benar
  // saat body berupa FormData. Jika di-override manual tanpa boundary,
  // parsing multer di backend akan gagal secara diam-diam.
  const { data } = await api.post<Submission>('/submissions', formData);
  return data;
}

/**
 * (Role PARTICIPANT) Melihat karya yang sudah diupload untuk satu
 * registrationId milik sendiri.
 */
export async function getMySubmission(
  registrationId: string,
): Promise<Submission> {
  const { data } = await api.get<Submission>(
    `/submissions/my-submission/${registrationId}`,
  );
  return data;
}

/**
 * (Role PARTICIPANT) Hapus/batalkan karya milik sendiri.
 * Hanya bisa dilakukan jika karya belum dinilai (belum GRADED).
 */
export async function deleteSubmission(id: string): Promise<void> {
  await api.delete(`/submissions/${id}`);
}

/**
 * (Role ADMIN/COMMITTEE) Melihat semua karya yang terkumpul untuk satu
 * lomba (dipakai panitia/juri untuk menilai).
 */
export async function getSubmissionsByCompetition(
  competitionId: string,
  config?: import('axios').AxiosRequestConfig
): Promise<Submission[]> {
  const { data } = await api.get<Submission[]>(
    `/submissions/competition/${competitionId}`,
    config
  );
  return data;
}
