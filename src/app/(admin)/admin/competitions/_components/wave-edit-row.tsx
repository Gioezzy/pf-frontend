"use client"

import { Loader2Icon } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"

import type { WaveFormRow } from "../_types"

interface WaveEditRowProps {
  name: string
  wave: WaveFormRow
  isSaving: boolean
  onChange: (field: keyof WaveFormRow, value: string) => void
  onSave: () => void
}

export function WaveEditRow({
  name,
  wave,
  isSaving,
  onChange,
  onSave,
}: WaveEditRowProps) {

  // Formatter Rupiah
  const displayPrice = wave.price 
    ? new Intl.NumberFormat("id-ID").format(Number(wave.price)) 
    : "";

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    onChange("price", rawValue);
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:border-primary/20">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold">{name}</p>
        <Button type="button" size="sm" disabled={isSaving} onClick={onSave}>
          {isSaving && <Loader2Icon className="size-4 animate-spin mr-2" />}
          Simpan Perubahan
        </Button>
      </div>
      
      {/* Layout dirapikan menjadi 2 Baris agar lapang */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Nama Gelombang</Label>
          <Input
            value={wave.name}
            onChange={(e) => onChange("name", e.target.value)}
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
              className="pl-9"
              value={displayPrice}
              onChange={handlePriceChange}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">Waktu Mulai</Label>
          <Input
            type="datetime-local"
            value={wave.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid gap-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">Waktu Selesai</Label>
          <Input
            type="datetime-local"
            value={wave.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
