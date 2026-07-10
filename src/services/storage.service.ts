// services/storage.service.ts
// Pemisah logika API untuk modul Storage (pf-backend: /api/v1/storage/*)
// Dipakai untuk upload file pendukung (bukti bayar, kartu pelajar, dll)
// sebelum dipakai di modul lain (registrations/submissions).

import api from '../lib/axios';
import type {
  UploadFilePayload,
  StoredFile,
} from '../types/storage.types';

/**
 * Upload satu file ke server. Format yang didukung: JPG, PNG, WebP, PDF.
 * Ukuran maksimum 20MB (divalidasi juga di backend, disarankan validasi
 * dulu di FE sebelum upload agar UX lebih cepat   lihat lib/formatters
 * `formatFileSize` untuk menampilkan ukuran ke user).
 */
export async function uploadFile(
  payload: UploadFilePayload,
): Promise<StoredFile> {
  const formData = new FormData();
  formData.append('file', payload.file);
  formData.append('purpose', payload.purpose);
  if (payload.context) formData.append('context', payload.context);
  if (payload.provider) formData.append('provider', payload.provider);

  // PENTING: jangan set header Content-Type secara manual di sini.
  // Axios otomatis menghitung `multipart/form-data; boundary=...` yang benar
  // saat body berupa FormData. Override manual tanpa boundary akan membuat
  // multer di backend gagal mem-parsing file (biasanya gagal secara diam-diam).
  const { data } = await api.post<StoredFile>('/storage/upload', formData);
  return data;
}

/**
 * Hapus file secara permanen (hard delete). Hanya pemilik file yang bisa
 * melakukan aksi ini (dicek dari userId di JWT).
 */
export async function deleteFile(id: string): Promise<void> {
  await api.delete(`/storage/${id}`);
}
