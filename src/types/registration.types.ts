// types/registration.types.ts
// Sesuai: src/modules/festival/registrations (pf-backend)

/** Status pendaftaran lomba */
export enum RegistrationStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

/** Gelar juara yang bisa ditetapkan admin/panitia ke sebuah registrasi */
export enum ChampionTitle {
  NONE = 'NONE',
  JUARA_1 = 'JUARA_1',
  JUARA_2 = 'JUARA_2',
  JUARA_3 = 'JUARA_3',
  HONORABLE_MENTION = 'HONORABLE_MENTION',
}

/**
 * Keputusan bendahara terhadap bukti pembayaran (sesuai
 * `VerificationAction` / `VerifyPaymentDto` di
 * registrations/applications/dto/verify-payment.dto.ts).
 */
export enum VerificationAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

// ── Payload (Request Body) ──────────────────────────────────────────────────

/** Body untuk POST /registrations */
export interface RegisterCompetitionPayload {
  competitionId: string;
  waveId: string;
  /** Wajib diisi jika lomba bertipe TEAM. Hanya ketua tim yang boleh mengirim ini. */
  teamId?: string;
}

/** Body untuk PATCH /registrations/admin/:id/set-champion (khusus ADMIN/COMMITTEE) */
export interface SetChampionPayload {
  title: ChampionTitle;
}

/**
 * Body untuk PATCH /registrations/bendahara/:id/verify (khusus TREASURER/ADMIN).
 * `note` wajib diisi kalau `action` adalah REJECT (divalidasi di backend,
 * lempar 400 jika kosong).
 */
export interface VerifyPaymentPayload {
  action: VerificationAction;
  note?: string;
}

// ── Response ─────────────────────────────────────────────────────────────────

/** Response dari POST/GET registrations (RegistrationResponseDto) */
export interface Registration {
  id: string;
  competitionId: string;
  competitionName: string;
  waveName: string;
  teamName: string | null;
  teamLeaderId: string | null;
  /** Nama user jika ini registrasi individu */
  participantName: string | null;
  participantAvatar: string | null;
  participantEmail: string | null;
  participantPhone: string | null;
  institution?: string | null;
  members?: { name: string; avatar: string | null; email: string | null; phone: string | null }[];
  status: RegistrationStatus;
  championTitle: ChampionTitle;
  registeredAt: string;

  /** URL bukti pembayaran yang diunggah peserta (null jika belum unggah). */
  proofOfPaymentUrl: string | null;
  /** Array URL kartu identitas / tanda siswa yang diunggah peserta. */
  identityCardUrls: string[];
  /** Waktu bukti pembayaran diunggah. */
  proofUploadedAt: string | null;

  /** Catatan bendahara — terutama diisi kalau status REJECTED. */
  verificationNote: string | null;
  /** Waktu verifikasi (approve/reject) oleh bendahara. */
  verifiedAt: string | null;

  paymentAttempts: {
    id: string;
    proofOfPaymentUrl: string;
    identityCardUrls?: string[];
    status: string;
    rejectionReason?: string | null;
    verifiedAt?: string | null;
    uploadedAt: string;
  }[];

  /** Tautan grup WhatsApp koordinasi. Hanya tersedia jika status VERIFIED dan admin sudah mengisi. */
  whatsappGroupUrl: string | null;
}

/**
 * Label Bahasa Indonesia untuk tiap status, memudahkan pemetaan badge/warna di UI.
 * (bukan dari backend — murni util tampilan FE)
 */
export const REGISTRATION_STATUS_LABEL: Record<RegistrationStatus, string> = {
  [RegistrationStatus.PENDING_PAYMENT]: 'Menunggu Pembayaran',
  [RegistrationStatus.PENDING_VERIFICATION]: 'Menunggu Verifikasi',
  [RegistrationStatus.VERIFIED]: 'Terverifikasi',
  [RegistrationStatus.REJECTED]: 'Ditolak',
  [RegistrationStatus.CANCELLED]: 'Dibatalkan',
};

export const CHAMPION_TITLE_LABEL: Record<ChampionTitle, string> = {
  [ChampionTitle.NONE]: '-',
  [ChampionTitle.JUARA_1]: 'Juara 1',
  [ChampionTitle.JUARA_2]: 'Juara 2',
  [ChampionTitle.JUARA_3]: 'Juara 3',
  [ChampionTitle.HONORABLE_MENTION]: 'Honorable Mention',
};
