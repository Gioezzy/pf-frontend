"use client"

import { useEffect, useState } from "react"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { Switch } from "@/src/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Textarea } from "@/src/components/ui/textarea"

import * as competitionService from "@/src/services/competition.service"

import {
  PARTICIPANT_TYPE_OPTIONS,
  type Competition,
  type DetailFormState,
  type ParticipantType,
  type UpdateCompetitionPayload,
  type UpdateWavePayload,
  type WaveFormRow,
} from "../_types"
import { toDatetimeLocalValue } from "../_lib/format"
import { WaveEditRow } from "./wave-edit-row"

interface EditCompetitionDialogProps {
  competition: Competition | null
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

function toDetailForm(competition: Competition): DetailFormState {
  const isActive = competition.isActive === true || String(competition.isActive) === "1" || String(competition.isActive) === "true";
  const isSubmission = competition.requiresSubmission === true || String(competition.requiresSubmission) === "1" || String(competition.requiresSubmission) === "true";
  
  return {
    name: competition.name,
    participantType: competition.participantType,
    minTeamMembers: String(competition.minTeamMembers),
    maxTeamMembers: String(competition.maxTeamMembers),
    description: competition.description ?? "",
    isActive: isActive,
    requiresSubmission: isSubmission,
    whatsappGroupUrl: competition.whatsappGroupUrl ?? "",
  }
}

function toWaveDrafts(competition: Competition): Record<string, WaveFormRow> {
  const drafts: Record<string, WaveFormRow> = {}
  for (const wave of competition.waves) {
    if (!wave.id) continue
    drafts[wave.id] = {
      name: wave.name,
      price: String(wave.price),
      startDate: toDatetimeLocalValue(wave.startDate),
      endDate: toDatetimeLocalValue(wave.endDate),
    }
  }
  return drafts
}

export function EditCompetitionDialog({
  competition,
  onOpenChange,
  onUpdated,
}: EditCompetitionDialogProps) {
  const [activeTab, setActiveTab] = useState("detail")
  const [form, setForm] = useState<DetailFormState | null>(null)
  const [waves, setWaves] = useState<Competition["waves"]>([])
  const [waveDrafts, setWaveDrafts] = useState<Record<string, WaveFormRow>>({})
  const [isSubmittingDetail, setIsSubmittingDetail] = useState(false)
  const [savingWaveId, setSavingWaveId] = useState<string | null>(null)

  useEffect(() => {
    if (competition) {
      setActiveTab("detail")
      setForm(toDetailForm(competition))
      setWaves(competition.waves)
      setWaveDrafts(toWaveDrafts(competition))
    }
  }, [competition])

  async function handleDetailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!competition?.id || !form) return

    setIsSubmittingDetail(true)
    try {
      const payload: UpdateCompetitionPayload = {
        name: form.name.trim(),
        participantType: form.participantType,
        minTeamMembers: Number(form.minTeamMembers) || 1,
        maxTeamMembers: Number(form.maxTeamMembers) || 1,
        description: form.description.trim() || undefined,
        isActive: form.isActive,
        requiresSubmission: form.requiresSubmission,
        whatsappGroupUrl: form.whatsappGroupUrl.trim() || undefined,
      }
      await competitionService.updateCompetition(competition.id, payload)
      toast.success("Detail lomba berhasil diperbarui.")
      onOpenChange(false)
      onUpdated()
    } catch (error) {
      console.error("Gagal memperbarui lomba:", error)
      toast.error("Gagal memperbarui lomba.")
    } finally {
      setIsSubmittingDetail(false)
    }
  }

  async function handleSaveWave(waveId: string) {
    const draft = waveDrafts[waveId]
    if (!draft) return

    setSavingWaveId(waveId)
    try {
      const payload: UpdateWavePayload = {
        name: draft.name.trim(),
        price: Number(draft.price) || 0,
        startDate: new Date(draft.startDate),
        endDate: new Date(draft.endDate),
      }
      const updated = await competitionService.updateWave(waveId, payload)
      toast.success(`Gelombang "${updated.name}" berhasil diperbarui.`)
      setWaves((prev) => prev.map((w) => (w.id === waveId ? { ...w, ...updated } : w)))
      onUpdated()
    } catch (error) {
      console.error("Gagal memperbarui gelombang:", error)
      toast.error("Gagal memperbarui gelombang.")
    } finally {
      setSavingWaveId(null)
    }
  }

  return (
    <Dialog open={!!competition} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Edit Lomba</DialogTitle>
          <DialogDescription>{competition?.name}</DialogDescription>
        </DialogHeader>

        {form && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="border-b px-6 pt-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="detail">Detail</TabsTrigger>
                <TabsTrigger value="waves">Gelombang</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="detail" className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
              <form
                id="edit-competition-detail-form"
                onSubmit={handleDetailSubmit}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nama Lomba</Label>
                  <Input
                    id="edit-name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => f && { ...f, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>Tipe Peserta</Label>
                    <Select
                      value={form.participantType}
                      onValueChange={(value) =>
                        setForm(
                          (f) =>
                            f && { ...f, participantType: value as ParticipantType },
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTICIPANT_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-min">Min. Anggota Tim</Label>
                    <Input
                      id="edit-min"
                      type="number"
                      min={1}
                      value={form.minTeamMembers}
                      onChange={(e) =>
                        setForm((f) => f && { ...f, minTeamMembers: e.target.value })
                      }
                      disabled={form.participantType === "INDIVIDUAL"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-max">Maks. Anggota Tim</Label>
                    <Input
                      id="edit-max"
                      type="number"
                      min={1}
                      value={form.maxTeamMembers}
                      onChange={(e) =>
                        setForm((f) => f && { ...f, maxTeamMembers: e.target.value })
                      }
                      disabled={form.participantType === "INDIVIDUAL"}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Deskripsi</Label>
                  <Textarea
                    id="edit-description"
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => f && { ...f, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-wa-url">Link Grup WhatsApp (opsional)</Label>
                  <Input
                    id="edit-wa-url"
                    type="url"
                    value={form.whatsappGroupUrl}
                    onChange={(e) =>
                      setForm((f) => f && { ...f, whatsappGroupUrl: e.target.value })
                    }
                    placeholder="https://chat.whatsapp.com/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Link ini akan otomatis dikirimkan ke peserta yang pembayarannya terverifikasi.
                  </p>
                </div>

                {/* Komponen Switch untuk requiresSubmission */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-requires-submission">Wajib Unggah Karya (Submission)</Label>
                    <p className="text-xs text-muted-foreground">
                      Aktifkan jika peserta wajib mengunggah file/karya setelah mendaftar.
                    </p>
                  </div>
                  <Switch
                    id="edit-requires-submission"
                    checked={form.requiresSubmission}
                    onCheckedChange={(checked) =>
                      setForm((f) => f && { ...f, requiresSubmission: checked })
                    }
                  />
                </div>

                {/* Komponen Switch untuk Lomba Aktif */}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="edit-active">Lomba Aktif</Label>
                    <p className="text-xs text-muted-foreground">
                      Nonaktifkan untuk menyembunyikan lomba dari katalog publik.
                    </p>
                  </div>
                  <Switch
                    id="edit-active"
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      setForm((f) => f && { ...f, isActive: checked })
                    }
                  />
                </div>
              </form>
            </TabsContent>

            <TabsContent value="waves" className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-5">
              <div className="flex flex-col gap-3">
                <p className="text-xs text-muted-foreground">
                  Gelombang baru hanya dapat ditambahkan saat membuat lomba baru.
                  Di sini kamu hanya bisa memperbarui jadwal dan harga gelombang
                  yang sudah ada.
                </p>
                {waves.map((wave) => {
                  if (!wave.id) return null
                  const draft = waveDrafts[wave.id]
                  if (!draft) return null
                  return (
                    <WaveEditRow
                      key={wave.id}
                      name={wave.name}
                      wave={draft}
                      isSaving={savingWaveId === wave.id}
                      onChange={(field, value) =>
                        setWaveDrafts((prev) => ({
                          ...prev,
                          [wave.id as string]: { ...draft, [field]: value },
                        }))
                      }
                      onSave={() => handleSaveWave(wave.id as string)}
                    />
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter className="border-t px-6 py-4">
          {activeTab === "detail" ? (
            <Button
              type="submit"
              form="edit-competition-detail-form"
              disabled={isSubmittingDetail}
            >
              {isSubmittingDetail && <Loader2Icon className="size-4 animate-spin mr-2" />}
              Simpan Perubahan
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
