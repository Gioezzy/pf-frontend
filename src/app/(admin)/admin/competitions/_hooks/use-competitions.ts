// admin/competitions/_hooks/use-competitions.ts
"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import * as competitionService from "@/src/services/competition.service"
import type { Competition } from "../_types"

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Tambahkan parameter silent
  async function fetchCompetitions(silent = false) {
    if (!silent) setIsLoading(true) // Hanya trigger skeleton jika tidak silent

    try {
      const data = await competitionService.getAllCompetitions()
      setCompetitions(data)
    } catch (error) {
      console.error("Gagal memuat daftar lomba:", error)
      toast.error("Gagal memuat daftar lomba. Coba muat ulang halaman.")
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchCompetitions()
  }, [])

  // Ekspor setCompetitions jika sewaktu-waktu butuh manipulasi manual
  return { competitions, setCompetitions, isLoading, refetch: fetchCompetitions }
}
