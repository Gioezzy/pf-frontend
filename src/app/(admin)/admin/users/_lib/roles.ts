import type * as userService from "@/src/services/user.service"

export type AdminCreateUserPayload = Parameters<
  typeof userService.adminCreateUser
>[0]
export type UserRole = AdminCreateUserPayload["role"]

export const ROLE_OPTIONS: {
  value: UserRole
  label: string
  description: string
}[] = [
  {
    value: "PARTICIPANT" as UserRole,
    label: "Peserta",
    description: "Bisa mendaftar lomba, membuat tim, dan mengunggah karya.",
  },
  {
    value: "COMMITTEE" as UserRole,
    label: "Panitia",
    description: "Bisa memverifikasi pendaftaran dan menilai karya.",
  },
  {
    value: "ADMIN" as UserRole,
    label: "Admin",
    description: "Akses penuh, termasuk mengelola lomba dan akun.",
  },
  {
    value: 'TREASURER' as UserRole,
    label: "Bendahara",
    description: 'Akses ke verifikasi pembayaran peserta.',
  }
]
