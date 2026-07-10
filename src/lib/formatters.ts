// lib/formatters.ts
// Kumpulan fungsi utilitas untuk memformat data dari pf-backend agar
// siap ditampilkan di UI (mata uang, tanggal, ukuran file, countdown, dll).

import {
  ChampionTitle,
  CHAMPION_TITLE_LABEL,
  RegistrationStatus,
  REGISTRATION_STATUS_LABEL,
} from '../types/registration.types';

// ── Mata Uang ────────────────────────────────────────────────────────────

/**
 * Format angka menjadi Rupiah, mis. 150123 -> "Rp150.123"
 * Dipakai untuk menampilkan harga wave / billingAmount registrasi.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Tanggal & Waktu ──────────────────────────────────────────────────────

/** Format tanggal singkat, mis. "6 Juli 2026" */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/** Format tanggal + jam, mis. "6 Juli 2026, 14:30" */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  /** true jika waktu sudah lewat (expiresAt < sekarang) */
  expired: boolean;
}

/**
 * Hitung sisa waktu menuju sebuah deadline (mis. batas 24 jam pembayaran
 * registrasi). Cocok dipakai bersama setInterval untuk countdown di UI.
 */
export function getTimeRemaining(expiresAt: string | Date): TimeRemaining {
  const target =
    typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const diffMs = target.getTime() - Date.now();

  if (diffMs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds, expired: false };
}

/** Format TimeRemaining menjadi string "HH:MM:SS", mis. "23:59:59" */
export function formatCountdown(time: TimeRemaining): string {
  if (time.expired) return '00:00:00';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
}

// ── Teks & Nama ──────────────────────────────────────────────────────────

/** Ambil inisial dari nama lengkap, mis. "Budi Santoso" -> "BS" (maks 2 huruf) */
export function getInitials(fullName: string | null | undefined): string {
  if (!fullName) return '?';
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return initials.join('') || '?';
}

/** Potong teks panjang dengan elipsis, mis. untuk deskripsi lomba di card */
export function truncateText(text: string, maxLength = 120): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

// ── Ukuran File ──────────────────────────────────────────────────────────

/**
 * Format ukuran file dalam bytes menjadi satuan yang mudah dibaca.
 * Dipakai untuk preview upload di storage.service / submission.service
 * (batas maksimum backend: 20MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${exponent === 0 ? value : value.toFixed(2)} ${units[exponent]}`;
}

// ── Label Enum (Registrasi) ────────────────────────────────────────────────
// Re-export helper agar komponen UI cukup import dari satu tempat (formatters)

/** Ambil label Bahasa Indonesia untuk status registrasi */
export function getRegistrationStatusLabel(
  status: RegistrationStatus,
): string {
  return REGISTRATION_STATUS_LABEL[status] ?? status;
}

/** Ambil label Bahasa Indonesia untuk gelar juara */
export function getChampionTitleLabel(title: ChampionTitle): string {
  return CHAMPION_TITLE_LABEL[title] ?? title;
}

/**
 * Mapping warna badge (kompatibel dengan util Tailwind/shadcn) berdasarkan
 * status registrasi — sesuaikan nama warna dengan tema project Anda.
 */
export function getRegistrationStatusColor(
  status: RegistrationStatus,
): 'yellow' | 'blue' | 'green' | 'red' | 'gray' {
  switch (status) {
    case RegistrationStatus.PENDING_PAYMENT:
      return 'yellow';
    case RegistrationStatus.PENDING_VERIFICATION:
      return 'blue';
    case RegistrationStatus.VERIFIED:
      return 'green';
    case RegistrationStatus.REJECTED:
      return 'red';
    case RegistrationStatus.CANCELLED:
      return 'gray';
    default:
      return 'gray';
  }
}
