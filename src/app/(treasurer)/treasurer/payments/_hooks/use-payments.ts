// admin/payments/_hooks/use-payments.ts
"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import type { Payment, VerifyPaymentPayload } from "../_types"
import { registrationService } from "@/src/services"
import { RegistrationStatus, VerificationAction } from "@/src/types/registration.types"
import axios from "axios";

interface ErrorResponse {
  message: string;
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPayments = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const data = await registrationService.getPendingVerifications()

      const mappedPayments: Payment[] = data.map((reg) => ({
        id: reg.id,
        registration: {
          id: reg.id,
          participantName: reg.participantName || "Peserta Individu",
          participantAvatar: reg.participantAvatar,
          participantEmail: reg.participantEmail,
          participantPhone: reg.participantPhone,
          teamName: reg.teamName,
          competitionName: reg.competitionName,
          institution: reg.institution,
          members: reg.members,
        },
        amount: 0, // Backend tidak menyimpan nominal, bisa disesuaikan jika perlu
        paymentMethod: "Transfer",
        senderName: reg.participantName || reg.teamName || "Peserta",
        proofUrl: reg.proofOfPaymentUrl || "",
        status: reg.status === RegistrationStatus.PENDING_VERIFICATION ? "PENDING" :
                reg.status === RegistrationStatus.VERIFIED ? "VERIFIED" : "REJECTED",
        createdAt: reg.proofUploadedAt || reg.registeredAt,
        verifiedAt: reg.verifiedAt,
        rejectionReason: reg.verificationNote,
        paymentAttempts: reg.paymentAttempts,
      }))

      setPayments(mappedPayments)
    } catch (error) {
      console.error("Gagal memuat data pembayaran:", error)
      toast.error("Gagal memuat data pembayaran.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [])

  async function verifyPayment(id: string, payload: VerifyPaymentPayload) {
    const action = payload.status === "VERIFIED" ? "memverifikasi" : "menolak"
    const loadingId = toast.loading(`Sedang ${action} pembayaran...`)

    try {
      await registrationService.verifyPayment(id, {
        action: payload.status === "VERIFIED" ? VerificationAction.APPROVE : VerificationAction.REJECT,
        note: payload.rejectionReason || undefined,
      })
      toast.success(`Pembayaran berhasil diubah menjadi ${payload.status}`, { id: loadingId })
      fetchPayments(true) // Silent refresh
    } catch (error: unknown) {
      console.error(`Gagal ${action}:`, error);

      const message = axios.isAxiosError<ErrorResponse>(error)
        ? error.response?.data?.message ??
          `Terjadi kesalahan saat ${action} pembayaran.`
        : `Terjadi kesalahan saat ${action} pembayaran.`;

      toast.error(message, { id: loadingId });
    }
  }

  return { payments, isLoading, verifyPayment }
}
