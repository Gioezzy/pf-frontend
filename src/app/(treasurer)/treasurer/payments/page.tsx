// admin/payments/page.tsx
"use client"

import { WalletIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { PaymentsTableCard } from "./_components/payments-table-card"
import { useProfile } from "@/src/hooks/use-profile"
import { usePayments } from "./_hooks/use-payments"

export default function PaymentsPage() {
  const { payments, isLoading, verifyPayment } = usePayments()
  const { profile } = useProfile()

  const pendingPayments = payments.filter((p) => p.status === "PENDING")
  const verifiedPayments = payments.filter((p) => p.status === "VERIFIED")
  const rejectedPayments = payments.filter((p) => p.status === "REJECTED")

  return (
    <div className="flex flex-col gap-8 px-4 py-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">

        {/* Premium Banner Section */}
        <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-background border border-emerald-500/20 p-8 md:p-12 transition-all duration-500 hover:shadow-lg hover:border-emerald-500/40 group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
            <WalletIcon className="w-64 h-64 rotate-12 text-emerald-600" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Divisi Bendahara
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Selamat Datang, <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
                  {profile?.fullName || profile?.email || "Bendahara"}
                </span>
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg mt-2 leading-relaxed">
                Panel khusus bendahara untuk mengecek bukti transfer dan memvalidasi pendaftaran peserta secara manual.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Menunggu Verifikasi ({pendingPayments.length})
            </TabsTrigger>
            <TabsTrigger value="verified">
              Disetujui ({verifiedPayments.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Ditolak ({rejectedPayments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <PaymentsTableCard
              payments={pendingPayments}
              isLoading={isLoading}
              onVerify={verifyPayment}
              emptyMessage="Hore! Tidak ada antrean pembayaran saat ini."
            />
          </TabsContent>

          <TabsContent value="verified">
            <PaymentsTableCard
              payments={verifiedPayments}
              isLoading={isLoading}
              onVerify={verifyPayment}
              emptyMessage="Belum ada pembayaran yang disetujui."
            />
          </TabsContent>

          <TabsContent value="rejected">
            <PaymentsTableCard
              payments={rejectedPayments}
              isLoading={isLoading}
              onVerify={verifyPayment}
              emptyMessage="Belum ada pembayaran yang ditolak."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}