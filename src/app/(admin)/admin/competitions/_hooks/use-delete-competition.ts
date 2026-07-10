"use client"

import { useState } from "react"
import { toast } from "sonner"

import * as competitionService from "@/src/services/competition.service"

import type { Competition } from "../_types"

export function useDeleteCompetition(onDeleted: () => void) {
  const [target, setTarget] = useState<Competition | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function confirmDelete() {
    if (!target?.id) return
    setIsDeleting(true)
    try {
      await competitionService.deleteCompetition(target.id)
      toast.success(`Lomba "${target.name}" berhasil dinonaktifkan.`)
      setTarget(null)
      onDeleted()
    } catch (error) {
      console.error("Gagal menonaktifkan lomba:", error)
      toast.error("Gagal menonaktifkan lomba.")
    } finally {
      setIsDeleting(false)
    }
  }

  return { target, setTarget, isDeleting, confirmDelete }
}
