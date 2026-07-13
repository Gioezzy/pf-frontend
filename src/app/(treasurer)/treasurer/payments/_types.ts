// admin/payments/_types.ts

// 1. Status Pembayaran yang valid di database
export type PaymentStatus = "PENDING" | "VERIFIED" | "REJECTED"

// 2. Ringkasan data pendaftaran untuk ditampilkan di tabel pembayaran
export interface RegistrationSummary {
  id: string
  participantName: string
  participantAvatar?: string | null
  participantEmail?: string | null
  participantPhone?: string | null
  teamName: string | null // Null jika lomba individu
  competitionName: string
  institution?: string | null
  members?: { name: string; avatar: string | null; email: string | null; phone: string | null }[]
}

// 3. Struktur utama data Pembayaran yang dikirim oleh Backend
export interface Payment {
  id: string
  registration: RegistrationSummary
  amount: number
  paymentMethod: string // Contoh: "BCA", "Mandiri", "GoPay"
  senderName: string // Nama pengirim di rekening/ewallet
  proofUrl: string // URL gambar bukti transfer
  status: PaymentStatus
  createdAt: string // ISO 8601 Date String
  verifiedAt: string | null // Kapan diverifikasi
  rejectionReason: string | null // Alasan jika ditolak
  paymentAttempts?: {
    id: string
    proofOfPaymentUrl: string
    identityCardUrls?: string[] | null
    status: string
    rejectionReason?: string | null
    verifiedAt?: string | null
    uploadedAt: string
  }[]
}

// 4. Payload yang dikirim dari Frontend ke Backend saat melakukan aksi
export interface VerifyPaymentPayload {
  status: "VERIFIED" | "REJECTED"
  rejectionReason?: string // Wajib diisi jika status REJECTED
}
