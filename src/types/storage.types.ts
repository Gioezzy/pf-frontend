// types/storage.types.ts
// Sesuai: src/modules/storage (pf-backend)

/** Kategori/tujuan file diunggah   harus sama persis dengan enum backend */
export enum FilePurpose {
  PROFILE_PHOTO = 'PROFILE_PHOTO',
  ORIGINALITY_STATEMENT = 'ORIGINALITY_STATEMENT',
  COMPETITION_WORK = 'COMPETITION_WORK',
  OTHER = 'OTHER',
}

export type StorageProvider = 'local' | 's3';

/** Payload untuk POST /storage/upload (dikirim sebagai multipart/form-data) */
export interface UploadFilePayload {
  file: File;
  purpose: FilePurpose;
  /** Sub-folder penyimpanan, hanya huruf/angka/strip/underscore. Default: "general" */
  context?: string;
  /** Default mengikuti env STORAGE_PROVIDER di backend */
  provider?: StorageProvider;
}

/** Response dari POST /storage/upload (StorageResponseDto) */
export interface StoredFile {
  storedFileId: string;
  fileKey: string;
  /** URL publik file   pakai ini untuk ditampilkan/disimpan sebagai referensi */
  fileUrl: string;
  originalName: string;
  mimeType: string;
  sizeInBytes: number;
  provider: StorageProvider;
  uploadedAt: string;
}
