"use client"

import { Trash2Icon } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

import type { WaveFormRow } from "../_types"

interface WaveFormFieldsProps {
  index: number
  wave: WaveFormRow
  onChange: (field: keyof WaveFormRow, value: string) => void
  onRemove: () => void
  removeDisabled: boolean
}

export function WaveFormFields({
  index,
  wave,
  onChange,
  onRemove,
  removeDisabled,
}: WaveFormFieldsProps) {

  // Fungsi format ke tampilan Rupiah
  const displayPrice = wave.price
    ? new Intl.NumberFormat("id-ID").format(Number(wave.price))
    : "";

  // Fungsi mengubah input kembali menjadi angka murni untuk disimpan ke state
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Hapus semua selain angka
    onChange("price", rawValue);
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:border-primary/20">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold">Gelombang {index + 1}</p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 hover:bg-destructive/10"
          disabled={removeDisabled}
          onClick={onRemove}
        >
          <Trash2Icon className="size-4 text-destructive" />
        </Button>
      </div>

      {/* Baris 1: Nama dan Harga */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Nama Gelombang</Label>
          <Input
            value={wave.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Contoh: Early Bird"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Harga Pendaftaran</Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-sm text-muted-foreground font-medium">Rp</span>
            </div>
            <Input
              type="text"
              className="pl-9" // Memberi ruang agar teks tidak tertimpa "Rp"
              value={displayPrice}
              onChange={handlePriceChange}
              placeholder="150.000"
            />
          </div>
        </div>
      </div>

      {/* Baris 2: Waktu Mulai dan Selesai (Diberi ruang sendiri agar tidak berhimpitan) */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">Waktu Mulai</Label>
          <Input
            type="datetime-local"
            value={wave.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            className="w-full"
            required
          />
        </div>
        <div className="grid gap-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">Waktu Selesai</Label>
          <Input
            type="datetime-local"
            value={wave.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            className="w-full"
            required
          />
        </div>
      </div>
    </div>
  )
}