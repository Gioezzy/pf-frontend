// types/submission.types.ts
// Sesuai: src/modules/festival/submissions (pf-backend)

/** Status karya lomba */
export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
}

/** Response dari endpoint submissions (SubmissionResponseDto) */
export interface Submission {
  id: string;
  registrationId: string;
  title: string;
  description: string | null;
  fileUrl: string;
  status: SubmissionStatus;
  /** Nilai yang diberikan juri (0-100), null jika belum dinilai */
  score: number | null;

  /** File orisinalitas karya (jika ada) */
  originalityFileUrl?: string | null;
  submittedAt: string;
  participantName?: string;
  teamName?: string;
  participantEmail?: string;
}

// ── Payload (Request Body) ──────────────────────────────────────────────────

/**
 * Payload untuk POST /submissions (dikirim sebagai multipart/form-data).
 */
export interface CreateSubmissionPayload {
  registrationId: string;
  title: string;
  description?: string;
  /** Wajib — file mentah karya yang akan diunggah. */
  file: File;
  /** Opsional — file tanda orisinalitas karya bermaterai. */
  originalityFile?: File;
}
