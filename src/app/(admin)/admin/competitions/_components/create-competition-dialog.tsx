"use client"

import { useState } from "react"
import { Loader2Icon, PlusIcon } from "lucide-react"
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
import { Separator } from "@/src/components/ui/separator"
import { Textarea } from "@/src/components/ui/textarea"
import { Switch } from "@/src/components/ui/switch" // Tambahkan import Switch

import * as competitionService from "@/src/services/competition.service"

import {
  EMPTY_DETAIL_FORM,
  EMPTY_WAVE_ROW,
  PARTICIPANT_TYPE_OPTIONS,
  type CreateCompetitionPayload,
  type DetailFormState,
  type ParticipantType,
  type WaveFormRow,
} from "../_types"
import { WaveFormFields } from "./wave-form-fields"

interface CreateCompetitionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function CreateCompetitionDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateCompetitionDialogProps) {
  const [form, setForm] = useState<DetailFormState>(EMPTY_DETAIL_FORM)
  const [waves, setWaves] = useState<WaveFormRow[]>([{ ...EMPTY_WAVE_ROW }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  function reset() {
    setForm(EMPTY_DETAIL_FORM)
    setWaves([{ ...EMPTY_WAVE_ROW }])
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) reset()
  }

  function addWaveRow() {
    setWaves((prev) => [...prev, { ...EMPTY_WAVE_ROW }])
  }

  function removeWaveRow(index: number) {
    setWaves((prev) => prev.filter((_, i) => i !== index))
  }

  function updateWaveRow(index: number, field: keyof WaveFormRow, value: string) {
    setWaves((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Nama lomba wajib diisi.")
      return
    }
    if (waves.some((w) => !w.name.trim() || !w.startDate || !w.endDate)) {
      toast.error(
        "Setiap gelombang wajib memiliki nama, tanggal mulai, dan tanggal selesai.",
      )
      return
    }

    setIsSubmitting(true)
    try {
      const payload: CreateCompetitionPayload = {
        name: form.name.trim(),
        participantType: form.participantType,
        minTeamMembers: Number(form.minTeamMembers) || 1,
        maxTeamMembers: Number(form.maxTeamMembers) || 1,
        description: form.description.trim() || undefined,
        requiresSubmission: form.requiresSubmission,
        whatsappGroupUrl: form.whatsappGroupUrl.trim() || undefined,
        waves: waves.map((w) => ({
          name: w.name.trim(),
          price: Number(w.price) || 0,
          startDate: new Date(w.startDate),
          endDate: new Date(w.endDate),
        })),
      }
      await competitionService.createCompetition(payload)
      toast.success("Lomba berhasil ditambahkan.")
      handleOpenChange(false)
      onCreated()
    } catch (error) {
      console.error("Gagal membuat lomba:", error)
      toast.error("Gagal membuat lomba. Periksa kembali data yang diisi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>Tambah Lomba</DialogTitle>
            <DialogDescription>
              Lengkapi detail lomba beserta minimal satu gelombang pendaftaran.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 overflow-x-hidden">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="create-name">Nama Lomba</Label>
                <Input
                  id="create-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Contoh: Galaxy Research Odyssey (LKTI)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Tipe Peserta</Label>
                  <Select
                    value={form.participantType}
                    onValueChange={(value) =>
                      setForm((f) => ({
                        ...f,
                        participantType: value as ParticipantType,
                      }))
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
                  <Label htmlFor="create-min">Min. Anggota Tim</Label>
                  <Input
                    id="create-min"
                    type="number"
                    min={1}
                    value={form.minTeamMembers}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, minTeamMembers: e.target.value }))
                    }
                    disabled={form.participantType === "INDIVIDUAL"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-max">Maks. Anggota Tim</Label>
                  <Input
                    id="create-max"
                    type="number"
                    min={1}
                    value={form.maxTeamMembers}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, maxTeamMembers: e.target.value }))
                    }
                    disabled={form.participantType === "INDIVIDUAL"}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="create-description">Deskripsi (opsional)</Label>
                <Textarea
                  id="create-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Ringkasan singkat mengenai lomba ini..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="create-wa-url">Link Grup WhatsApp (opsional)</Label>
                <Input
                  id="create-wa-url"
                  type="url"
                  value={form.whatsappGroupUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, whatsappGroupUrl: e.target.value }))
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
                  <Label htmlFor="create-requires-submission">Wajib Unggah Karya (Submission)</Label>
                  <p className="text-xs text-muted-foreground">
                    Aktifkan jika peserta wajib mengunggah file/karya setelah mendaftar.
                  </p>
                </div>
                <Switch
                  id="create-requires-submission"
                  checked={form.requiresSubmission}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, requiresSubmission: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Gelombang Pendaftaran</p>
                  <p className="text-xs text-muted-foreground">
                    Minimal satu gelombang wajib diisi.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addWaveRow}>
                  <PlusIcon className="size-4" />
                  Tambah Gelombang
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {waves.map((wave, index) => (
                  <WaveFormFields
                    key={index}
                    index={index}
                    wave={wave}
                    onChange={(field, value) => updateWaveRow(index, field, value)}
                    onRemove={() => removeWaveRow(index)}
                    removeDisabled={waves.length === 1}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="size-4 animate-spin mr-2" />}
              Simpan Lomba
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}