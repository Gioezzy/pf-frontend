// types/competition.types.ts
// Sesuai: src/modules/festival/competitions (pf-backend)

/** Tipe peserta lomba — menentukan apakah butuh teamId saat registrasi */
export enum CompetitionParticipantType {
  INDIVIDUAL = 'INDIVIDUAL',
  TEAM = 'TEAM',
}

/** Satu gelombang (wave) pendaftaran dalam sebuah lomba */
export interface CompetitionWave {
  id: string | null;
  name: string;
  price: number;
  startDate: string;
  endDate: string;
}

/** Response dari GET /competitions dan GET /competitions/:id (CompetitionResponseDto) */
export interface Competition {
  id: string | null;
  name: string;
  participantType: CompetitionParticipantType;
  minTeamMembers: number;
  maxTeamMembers: number;
  description: string | null;
  requiresSubmission: boolean;
  /** true jika lomba belum ditutup paksa DAN ada wave yang sedang berlangsung hari ini */
  isOpen: boolean;
  /** false jika lomba di-soft-delete/disembunyikan admin */
  isActive: boolean;
  /** Wave yang sedang aktif saat ini, null jika tidak ada */
  activeWave: CompetitionWave | null;
  waves: CompetitionWave[];
  /** Tautan grup WhatsApp koordinasi. Null jika belum diatur admin. */
  whatsappGroupUrl: string | null;
}

// ── Payload (Request Body, khusus ADMIN) ────────────────────────────────────

/** Item wave saat membuat lomba baru */
export interface CreateCompetitionWavePayload {
  name: string;
  price: number;
  /** ISO date string, mis. "2026-08-01T00:00:00.000Z" */
  startDate: Date;
  /** ISO date string */
  endDate: Date;
}

/** Body untuk POST /competitions */
export interface CreateCompetitionPayload {
  name: string;
  participantType: CompetitionParticipantType;
  minTeamMembers: number;
  maxTeamMembers: number;
  description?: string;
  requiresSubmission?: boolean;
  waves?: CreateCompetitionWavePayload[];
  /** Tautan grup WhatsApp koordinasi peserta lomba. Opsional. */
  whatsappGroupUrl?: string;
}

/**
 * Body untuk PATCH /competitions/:id
 * Catatan: field "waves" TIDAK bisa diubah lewat endpoint ini,
 * gunakan updateWave() / PATCH /competitions/waves/:waveId.
 */
export type UpdateCompetitionPayload = Partial<
  Omit<CreateCompetitionPayload, 'waves'>
> & {
  /** Set false untuk soft-disable (menyembunyikan) lomba */
  isActive?: boolean;
};

/** Body untuk PATCH /competitions/waves/:waveId */
export interface UpdateWavePayload {
  name?: string;
  price?: number;
  startDate?: Date;
  endDate?: Date;
}