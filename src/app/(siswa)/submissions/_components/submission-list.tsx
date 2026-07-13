import { useState } from "react";
import { toast } from "sonner";
import { submissionService } from "@/src/services";
import type { Registration } from "@/src/types/registration.types";
import type { Submission } from "@/src/types/submission.types";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { FileTextIcon } from "lucide-react";
import axios from "axios";
import { FilePreviewDialog } from "@/src/components/ui/file-preview-dialog";

interface ErrorResponse {
  message: string;
}

export function SubmissionList({
  registrations,
  submissions,
  isLoading,
  onMutate,
}: {
  registrations: Registration[];
  submissions: Record<string, Submission | null>;
  isLoading: boolean;
  onMutate: () => void;
}) {
  const [activeRegId, setActiveRegId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [originalityFile, setOriginalityFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string; } | null>(null);

  async function handleSubmitForm(e: React.FormEvent, regId: string) {
    e.preventDefault();
    if (!title || !file) return toast.error("Judul dan File wajib diisi");

    setIsSubmitting(true);
    try {
      // Langsung kirim file mentah ke backend. Backend akan otomatis mengunggahnya ke storage.
      await submissionService.createSubmission({
        registrationId: regId,
        title,
        description,
        file: file,
        originalityFile: originalityFile || undefined,
      });

      toast.success("Karya berhasil dikumpulkan!");
      setActiveRegId(null);
      setTitle("");
      setDescription("");
      setFile(null);
      setOriginalityFile(null);
      onMutate();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message ?? "Gagal mengumpulkan karya"
        );
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Anda tidak terdaftar pada lomba yang membutuhkan pengumpulan karya.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {registrations.map((reg) => {
        const sub = submissions[reg.id];

        return (
          <Card key={reg.id} className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{reg.competitionName}</CardTitle>
                  <CardDescription>
                    {reg.teamName ? `Tim: ${reg.teamName}` : `Peserta: ${reg.participantName || "Individu"}`}
                  </CardDescription>
                </div>
                {sub ? (
                  <Badge variant={sub.status === 'GRADED' ? 'default' : 'secondary'}>
                    {sub.status === 'GRADED' ? 'Telah Dinilai' : 'Menunggu Penilaian'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Belum Mengumpulkan
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {sub ? (
                <div className="space-y-4 rounded-md border p-4 bg-muted/20">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Judul Karya</h4>
                    <p className="text-base">{sub.title}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Deskripsi</h4>
                    <p className="text-sm">{sub.description || "-"}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setPreviewFile({ url: sub.fileUrl, name: `Karya - ${sub.title}` })}
                    >
                      <FileTextIcon className="size-4 mr-2" />
                      Lihat Karya
                    </Button>
                    {sub.originalityFileUrl && (
                      <Button 
                        variant="outline" 
                        className="text-amber-600 border-amber-300 hover:bg-amber-50"
                        onClick={() => setPreviewFile({ url: sub.originalityFileUrl!, name: `Orisinalitas - ${sub.title}` })}
                      >
                        <FileTextIcon className="size-4 mr-2" />
                        Tanda Orisinalitas
                      </Button>
                    )}
                    {sub.score !== null && (
                      <div className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                        Nilai: {sub.score}
                      </div>
                    )}
                  </div>
                </div>
              ) : reg.status === 'REJECTED' ? (
                <div className="space-y-4">
                  <div className="text-sm p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                    Pendaftaran Anda ditolak. Silakan periksa alasan penolakan dan unggah ulang bukti pembayaran yang valid di menu Riwayat Pendaftaran.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRegId === reg.id ? (
                    <form onSubmit={(e) => handleSubmitForm(e, reg.id)} className="space-y-4 border p-4 rounded-md">
                      {reg.competitionName.toLowerCase().includes("video") && (
                        <div className="bg-blue-50/50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm mb-2 shadow-sm">
                          <strong>📝 Panduan Khusus Lomba Video Kreatif:</strong><br />
                          <span className="opacity-90">
                            Mohon <span className="font-semibold text-red-600">JANGAN</span> mengunggah file video mentah (mp4/mkv) ke dalam sistem ini. 
                            Silakan unggah dokumen berformat <strong>PDF</strong> atau <strong>Word</strong> yang memuat format laporan: 
                            <br/>• Nama Kelompok<br/>• Daftar Anggota<br/>• Asal Sekolah<br/>• <strong>Tautan (Link) Video</strong> (Google Drive / YouTube).
                          </span>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label>Judul Karya</Label>
                        <Input 
                          placeholder="Masukkan judul karya..." 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Deskripsi Singkat (Opsional)</Label>
                        <Textarea 
                          placeholder="Ceritakan sedikit tentang karya ini..." 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Berkas Karya (PDF / Gambar)</Label>
                        <Input 
                          type="file" 
                          accept=".pdf,image/*" 
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2 pt-2 border-t mt-4">
                        <Label>Berkas Tanda Orisinalitas (Opsional / Wajib untuk LKTI, Video, Poster)</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Silakan unggah scan tanda orisinalitas bermaterai sesuai format lomba Anda.
                        </p>
                        <Input 
                          type="file" 
                          accept=".pdf,image/*" 
                          onChange={(e) => setOriginalityFile(e.target.files?.[0] || null)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Mengunggah..." : "Submit Karya"}
                        </Button>
                        <Button type="button" variant="ghost" disabled={isSubmitting} onClick={() => setActiveRegId(null)}>
                          Batal
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button onClick={() => setActiveRegId(reg.id)} disabled={reg.status !== 'VERIFIED'}>
                      Kumpulkan Karya
                    </Button>
                  )}
                  {reg.status !== 'VERIFIED' && !sub && (
                    <p className="text-xs text-muted-foreground mt-2">
                      * Anda baru bisa mengumpulkan karya setelah pendaftaran dan pembayaran diverifikasi.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <FilePreviewDialog 
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileUrl={previewFile?.url || null}
        fileName={previewFile?.name}
      />
    </div>
  );
}
