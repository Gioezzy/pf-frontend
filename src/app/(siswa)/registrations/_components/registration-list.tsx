import { useState } from "react";
import { toast } from "sonner";
import { registrationService } from "@/src/services";
import { useProfileContext } from "@/src/contexts/user-context";
import type { Registration } from "@/src/types/registration.types";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { MessageCircle, CheckCircle2, Download, FileText } from "lucide-react";
import { AxiosError } from "axios";

export function RegistrationList({
  registrations,
  isLoading,
  onMutate,
}: {
  registrations: Registration[];
  isLoading: boolean;
  onMutate: () => void;
}) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [filesToUpload, setFilesToUpload] = useState<Record<string, { payment?: File; identity?: File[] }>>({});
  const { profile } = useProfileContext();
  const userId = profile?.id;

  function handleFileChange(regId: string, type: 'payment' | 'identity', files?: FileList | null) {
    if (!files) return;
    
    setFilesToUpload((prev) => {
      const existing = prev[regId] || {};
      
      if (type === 'payment') {
        return { ...prev, [regId]: { ...existing, payment: files[0] } };
      } else {
        const fileArray = Array.from(files);
        return { ...prev, [regId]: { ...existing, identity: fileArray } };
      }
    });
  }

  async function handleUploadPayment(id: string, isTeam: boolean) {
    const files = filesToUpload[id];
    if (!files?.payment || !files?.identity || files.identity.length === 0) {
      toast.error("Harap unggah bukti pembayaran dan kartu pelajar/identitas.");
      return;
    }
    
    if (isTeam && files.identity.length < 2) {
       toast.warning("Mohon unggah semua kartu pelajar anggota tim.");
    }

    setUploadingId(id);
    try {
      await registrationService.uploadPaymentProof(id, files.payment, files.identity);
      toast.success("Bukti pembayaran berhasil diunggah");
      onMutate();
    } catch (error: unknown) {
      const message =
      error instanceof AxiosError
        ? error.response?.data?.message ?? "Gagal mengunggah bukti pembayaran"
        : "Terjadi kesalahan yang tidak diketahui";

    toast.error(message);
    } finally {
      setUploadingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Anda belum mendaftar di lomba manapun.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {registrations.map((reg) => (
        <Card key={reg.id} className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card flex flex-col md:flex-row justify-between overflow-hidden">
          <div className="flex-1 flex flex-col p-6">
            <CardHeader className="p-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{reg.competitionName}</CardTitle>
                <Badge variant={
                  reg.status === 'VERIFIED' ? 'default' : 
                  reg.status === 'PENDING_VERIFICATION' ? 'secondary' : 
                  reg.status === 'REJECTED' ? 'destructive' : 'outline'
                }>
                  {reg.status}
                </Badge>
              </div>
              <CardDescription>
                Didaftarkan pada: {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(reg.registeredAt))}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <div className="text-sm">
                <p><strong>Gelombang:</strong> {reg.waveName}</p>
                {reg.teamName ? <p><strong>Tim:</strong> {reg.teamName}</p> : <p><strong>Individu:</strong> {reg.participantName}</p>}
                
                {reg.paymentAttempts && reg.paymentAttempts.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold mb-2 text-xs uppercase tracking-wider text-muted-foreground">Riwayat Unggah Bukti</p>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {reg.paymentAttempts.map((attempt, index) => (
                        <div key={attempt.id} className="bg-muted/30 p-3 rounded-md border text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-foreground">
                              Percobaan {reg.paymentAttempts.length - index}
                            </span>
                            <Badge variant={
                              attempt.status === 'APPROVED' ? 'default' :
                              attempt.status === 'REJECTED' ? 'destructive' : 'secondary'
                            } className="text-[10px] px-1 py-0 h-5">
                              {attempt.status}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground flex flex-col gap-1 mt-2">
                            <p>Waktu: {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(attempt.uploadedAt))}</p>
                            <a href={attempt.proofOfPaymentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline w-fit">
                              Lihat Bukti Pembayaran
                            </a>
                            {attempt.identityCardUrls && attempt.identityCardUrls.length > 0 && (
                              <div className="flex flex-col gap-1 mt-1">
                                {attempt.identityCardUrls.map((url, i) => (
                                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline w-fit">
                                    Lihat Kartu Pelajar {attempt.identityCardUrls!.length > 1 ? `Anggota ${i+1}` : ''}
                                  </a>
                                ))}
                              </div>
                            )}
                            {attempt.rejectionReason && (
                              <p className="text-destructive mt-1 bg-destructive/10 p-2 rounded">
                                <strong>Catatan Penolakan:</strong> {attempt.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
          
          <div className="md:w-[320px] shrink-0 border-t md:border-t-0 md:border-l border-muted/30 p-6 bg-muted/5 flex flex-col justify-center">
            {reg.status === 'PENDING_PAYMENT' || reg.status === 'REJECTED' ? (
              (!reg.teamName || reg.teamLeaderId === userId) ? (
                <div className="flex flex-col gap-4 w-full md:w-64">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`payment-${reg.id}`} className="text-xs text-muted-foreground">
                      1. Unggah Bukti Pembayaran
                    </Label>
                    <Input 
                      id={`payment-${reg.id}`}
                      type="file" 
                      accept="image/*,.pdf"
                      disabled={uploadingId === reg.id}
                      className="flex-1 text-xs"
                      onChange={(e) => handleFileChange(reg.id, 'payment', e.target.files)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`identity-${reg.id}`} className="text-xs text-muted-foreground">
                      2. Unggah Kartu Pelajar (Ketua & Anggota)
                    </Label>
                    <Input 
                      id={`identity-${reg.id}`}
                      type="file" 
                      multiple
                      accept="image/*,.pdf"
                      disabled={uploadingId === reg.id}
                      className="flex-1 text-xs"
                      onChange={(e) => handleFileChange(reg.id, 'identity', e.target.files)}
                    />
                    <span className="text-[10px] text-muted-foreground">Anda dapat memilih lebih dari satu file sekaligus. Harap lampirkan KTS untuk semua anggota tim.</span>
                  </div>
                  <Button 
                    size="sm" 
                    disabled={uploadingId === reg.id || !filesToUpload[reg.id]?.payment || !filesToUpload[reg.id]?.identity?.length}
                    onClick={() => handleUploadPayment(reg.id, !!reg.teamName)}
                  >
                    {uploadingId === reg.id ? "Mengunggah..." : "Kirim Berkas"}
                  </Button>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground p-3 border rounded bg-muted/20 text-center w-full md:w-64">
                  Hanya ketua tim yang dapat mengunggah bukti pembayaran.
                </div>
              )
            ) : reg.status === 'PENDING_VERIFICATION' ? (
              <Button disabled variant="outline" className="w-full md:w-auto">Menunggu Verifikasi</Button>
            ) : reg.status === 'VERIFIED' ? (
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Pembayaran Terverifikasi
                </div>
                {reg.whatsappGroupUrl && (
                  <a
                    href={reg.whatsappGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      className="w-full text-green-700 border-green-500 bg-green-50 hover:bg-green-100 gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Gabung Grup WhatsApp Lomba
                    </Button>
                  </a>
                )}
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Dokumen Peserta:</p>
                  <a href="/docs/kartu_peserta.pdf" download>
                    <Button variant="secondary" size="sm" className="w-full justify-start gap-2 text-xs">
                      <Download className="h-3.5 w-3.5" />
                      Unduh Kartu Peserta
                    </Button>
                  </a>
                  {reg.competitionName?.toLowerCase().includes("lkti") && (
                    <a href="/docs/Galaxy_Research_Odyssey_LKTI.docx" download>
                      <Button variant="secondary" size="sm" className="w-full justify-start gap-2 text-xs">
                        <FileText className="h-3.5 w-3.5" />
                        Pernyataan Orisinalitas (LKTI)
                      </Button>
                    </a>
                  )}
                  {reg.competitionName?.toLowerCase().includes("video") && (
                    <a href="/docs/Video_Kreatif.docx" download>
                      <Button variant="secondary" size="sm" className="w-full justify-start gap-2 text-xs">
                        <FileText className="h-3.5 w-3.5" />
                        Pernyataan Orisinalitas (Video)
                      </Button>
                    </a>
                  )}
                  {(reg.competitionName?.toLowerCase().includes("vortex") || reg.competitionName?.toLowerCase().includes("poster")) && (
                    <a href="/docs/VORTEX_DIGITAL POSTER.docx" download>
                      <Button variant="secondary" size="sm" className="w-full justify-start gap-2 text-xs">
                        <FileText className="h-3.5 w-3.5" />
                        Pernyataan Orisinalitas (Poster)
                      </Button>
                    </a>
                  )}
                </div>
              </div>
              ) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}
