// admin/payments/_components/payments-table-card.tsx
"use client"

import { useState } from "react"
import { CheckCircleIcon, EyeIcon, XCircleIcon, ReceiptIcon, MailIcon, PhoneIcon } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { FilePreviewDialog } from "@/src/components/ui/file-preview-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Textarea } from "@/src/components/ui/textarea"
import { Skeleton } from "@/src/components/ui/skeleton"
import type { Payment, VerifyPaymentPayload } from "../_types"

interface PaymentsTableCardProps {
  payments: Payment[]
  isLoading: boolean
  emptyMessage: string
  onVerify: (id: string, payload: VerifyPaymentPayload) => Promise<void>
}

export function PaymentsTableCard({
  payments,
  isLoading,
  emptyMessage,
  onVerify,
}: PaymentsTableCardProps) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null)

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount)

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(dateString))

  const handleApprove = (id: string) => {
    void onVerify(id, { status: "VERIFIED" })
  }

  const handleRejectSubmit = () => {
    if (!rejectingId) return
    void onVerify(rejectingId, { status: "REJECTED", rejectionReason: rejectReason })
    setRejectingId(null)
    setRejectReason("")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
          <CardDescription>
            {isLoading ? "Memuat data..." : `${payments.length} transaksi ditemukan.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex flex-col gap-3">
               {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
             </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
              <ReceiptIcon className="size-8" />
              <p className="text-sm">{emptyMessage}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Pengirim & Lomba</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead className="text-center">Bukti</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{payment.senderName}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.registration.teamName ?? payment.registration.participantName} • {payment.registration.competitionName}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{payment.paymentMethod}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedPayment(payment)}>
                        <EyeIcon className="size-4 text-blue-500" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setRejectingId(payment.id)}>
                            <XCircleIcon className="size-4 mr-1" /> Tolak
                          </Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(payment.id)}>
                            <CheckCircleIcon className="size-4 mr-1" /> Terima
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2 items-center">
                          <Badge variant="outline" className={`mr-2 ${payment.status === "VERIFIED" ? "border-emerald-500 text-emerald-500" : "border-red-500 text-red-500"}`}>
                            {payment.status === "VERIFIED" ? "Disetujui" : "Ditolak"}
                          </Badge>
                          {payment.status === "VERIFIED" && (
                            <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 h-7 text-xs px-2" onClick={() => setRejectingId(payment.id)}>
                              Ubah ke Tolak
                            </Button>
                          )}
                          {payment.status === "REJECTED" && (
                            <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 h-7 text-xs px-2" onClick={() => handleApprove(payment.id)}>
                              Ubah ke Terima
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Lihat Bukti Transfer */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Bukti Transfer</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6 py-4">
            {selectedPayment && (
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-start shadow-sm">
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Informasi Pendaftar</p>
                    {selectedPayment.registration.teamName ? (
                      <div>
                        <div className="flex flex-col gap-0.5 mb-3">
                          <span className="text-sm text-gray-500">Nama Tim</span>
                          <span className="font-bold text-gray-900 text-lg">{selectedPayment.registration.teamName}</span>
                        </div>
                        <div className="flex gap-3 items-center">
                          <Avatar className="size-10 border border-gray-100">
                            <AvatarImage src={selectedPayment.registration.participantAvatar || ""} />
                            <AvatarFallback className="bg-blue-50 text-blue-700">{selectedPayment.registration.participantName.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-xs text-gray-500">Ketua Tim</span>
                            <span className="font-semibold text-gray-900 truncate">{selectedPayment.registration.participantName}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3 items-center">
                        <Avatar className="size-12 border border-gray-100">
                          <AvatarImage src={selectedPayment.registration.participantAvatar || ""} />
                          <AvatarFallback className="bg-blue-50 text-blue-700 text-lg">{selectedPayment.registration.participantName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-bold text-gray-900 text-lg truncate">{selectedPayment.registration.participantName}</span>
                          <span className="text-sm text-gray-500">{selectedPayment.registration.institution || "-"}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1 mt-4">
                      {selectedPayment.registration.participantEmail && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MailIcon className="size-4 text-gray-400 shrink-0" />
                          <span className="truncate">{selectedPayment.registration.participantEmail}</span>
                        </div>
                      )}
                      {selectedPayment.registration.participantPhone && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <PhoneIcon className="size-4 text-gray-400 shrink-0" />
                          <span>{selectedPayment.registration.participantPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedPayment.registration.teamName && selectedPayment.registration.members && selectedPayment.registration.members.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Anggota Lainnya</p>
                      <div className="flex flex-col gap-3">
                        {selectedPayment.registration.members.map((m, i: number) => {
                          const memberName = m.name;
                          return (
                            <div key={i} className="flex gap-2 items-start">
                              <Avatar className="size-8 border border-gray-100">
                                <AvatarImage src={m.avatar || ""} />
                                <AvatarFallback className="bg-gray-100 text-gray-600 text-[10px]">{memberName.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0">
                                <p className="text-xs font-medium text-gray-800 truncate">{memberName}</p>
                                {m.phone && (
                                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <PhoneIcon className="size-2.5 text-gray-400 shrink-0" />
                                    <span>{m.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                      <p className="text-xs text-gray-500 mb-0.5">Asal Sekolah</p>
                      <p className="font-medium text-gray-900 text-sm">{selectedPayment.registration.institution || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Nama Lomba</p>
                      <p className="font-medium text-gray-900 text-sm">{selectedPayment.registration.competitionName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Pengirim Rekening</p>
                      <p className="font-medium text-gray-900 text-sm">{selectedPayment.senderName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Metode Transfer</p>
                      <Badge variant="secondary" className="font-normal">{selectedPayment.paymentMethod}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedPayment?.paymentAttempts && selectedPayment.paymentAttempts.length > 0 ? (
              <div className="grid gap-6">
                {selectedPayment.paymentAttempts.map((attempt, index) => (
                  <div key={attempt.id} className="border rounded-lg p-4 space-y-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        Percobaan {selectedPayment.paymentAttempts!.length - index}
                      </span>
                      <Badge variant={
                        attempt.status === 'APPROVED' ? 'default' :
                        attempt.status === 'REJECTED' ? 'destructive' : 'secondary'
                      }>
                        {attempt.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Bukti Pembayaran</p>
                        <div 
                          className="flex justify-center bg-background rounded-md p-2 border cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setPreviewFile({ url: attempt.proofOfPaymentUrl, name: `Bukti Pembayaran - Percobaan ${selectedPayment.paymentAttempts!.length - index}` })}
                        >
                          <img src={attempt.proofOfPaymentUrl} alt="Bukti Pembayaran" className="max-h-[40vh] rounded-md object-contain" />
                        </div>
                      </div>
                      
                      {attempt.identityCardUrls && attempt.identityCardUrls.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            Kartu Pelajar / KTS ({attempt.identityCardUrls.length} File)
                          </p>
                          <div className="flex flex-wrap gap-4">
                            {attempt.identityCardUrls.map((url, i) => {
                              const participants = [];
                              if (selectedPayment.registration.teamName) {
                                participants.push({ label: `Ketua (${selectedPayment.registration.participantName})` });
                                selectedPayment.registration.members?.forEach((m, idx) => {
                                  participants.push({ label: `Anggota ${idx + 1} (${m.name})` });
                                });
                              } else {
                                participants.push({ label: `Peserta (${selectedPayment.registration.participantName})` });
                              }
                              
                              const label = participants[i]?.label || `File ${i+1}`;
                              
                              return (
                                <div 
                                  key={i} 
                                  className="flex flex-col items-center gap-2 bg-background rounded-md p-2 border cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => setPreviewFile({ url, name: `Kartu Pelajar - ${label}` })}
                                >
                                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
                                  <img src={url} alt={`Kartu Pelajar ${label}`} className="max-h-[30vh] rounded-md object-contain" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-col gap-1">
                      <p>Diunggah: {formatDate(attempt.uploadedAt)}</p>
                      {attempt.rejectionReason && (
                        <p className="text-destructive font-medium mt-1">
                          Catatan: {attempt.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center p-4">
                {selectedPayment?.proofUrl ? (
                  <div 
                    className="cursor-pointer hover:bg-muted/50 transition-colors p-2 rounded-md border"
                    onClick={() => setPreviewFile({ url: selectedPayment.proofUrl!, name: 'Bukti Pembayaran (Lama)' })}
                  >
                    <img src={selectedPayment.proofUrl} alt="Bukti Pembayaran" className="max-h-[60vh] rounded-md object-contain" />
                  </div>
                ) : (
                  <p className="text-muted-foreground">Tidak ada bukti pembayaran</p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Alasan Penolakan */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tolak Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Masukkan alasan penolakan (misal: Bukti transfer buram, nominal kurang)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
            <Button variant="destructive" onClick={handleRejectSubmit} disabled={!rejectReason.trim()}>
              Konfirmasi Tolak
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <FilePreviewDialog 
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileUrl={previewFile?.url || null}
        fileName={previewFile?.name}
      />
    </>
  )
}
