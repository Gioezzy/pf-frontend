import type * as registrationService from "@/src/services/registration.service"

export type Registration = Awaited<
  ReturnType<typeof registrationService.getVerifiedParticipants>
>[number]
export type ChampionTitle = Registration["championTitle"]

export const CHAMPION_OPTIONS: { value: ChampionTitle; label: string }[] = [
  { value: "NONE" as ChampionTitle, label: "Belum ditentukan" },
  { value: "JUARA_1" as ChampionTitle, label: "Juara 1" },
  { value: "JUARA_2" as ChampionTitle, label: "Juara 2" },
  { value: "JUARA_3" as ChampionTitle, label: "Juara 3" },
  { value: "HONORABLE_MENTION" as ChampionTitle, label: "Honorable Mention" },
]

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PENDING_VERIFICATION: "Menunggu Verifikasi",
  VERIFIED: "Terverifikasi",
  REJECTED: "Ditolak",
  CANCELLED: "Dibatalkan",
}

export function statusLabel(status: Registration["status"]): string {
  return STATUS_LABELS[status as string] ?? String(status)
}
