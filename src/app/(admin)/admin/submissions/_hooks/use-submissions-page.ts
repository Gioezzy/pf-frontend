"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import * as competitionService from "@/src/services/competition.service"
import { submissionService } from "@/src/services"
import type { Competition, SubmissionRow } from "../_types"

export function useSubmissionsPage() {
  // 1. KITA HAPUS useRouter dan useSearchParams
  // 2. Ganti murni menggunakan local state React
  const [competitionId, setCompetitionId] = useState<string>("")

  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(true)

  const [submissions, setSubmissions] = useState<SubmissionRow[]>([])
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false)

  // State khusus untuk pancingan refetch
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  // EFFECT 1: Ambil daftar lomba (HANYA BERJALAN 1x SAAT HALAMAN DIBUKA)
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    async function fetchCompetitions() {
      setIsLoadingCompetitions(true)
      try {
        const data = await competitionService.getAllCompetitions({ signal: controller.signal })
        // Hanya lomba yang memang punya kriteria requiresSubmission yang
        // relevan di halaman ini, karena backend menolak (400) request
        // submissions untuk lomba yang requiresSubmission = false.
        const submissionCompetitions = data.filter((c) => c.requiresSubmission)

        if (isMounted) {
          setCompetitions(submissionCompetitions)
          // Secara otomatis pilih lomba pertama TANPA merusak URL
          if (submissionCompetitions.length > 0 && submissionCompetitions[0].id) {
            setCompetitionId(submissionCompetitions[0].id)
          }
        }
      } catch (error: unknown) {
        const isCanceled = error instanceof Error &&
          (error.name === 'CanceledError' || error.message?.includes('canceled'));
        if (isCanceled) return;
        console.error("Gagal memuat daftar lomba:", error)
        toast.error("Gagal memuat daftar lomba.")
      } finally {
        if (isMounted) setIsLoadingCompetitions(false)
      }
    }

    void fetchCompetitions()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, []) // <-- Dependency array kosong, aman dari looping.

  // EFFECT 2: Ambil data submission setiap kali Pilihan Lomba berubah
  useEffect(() => {
    if (!competitionId) {
      setSubmissions([])
      return
    }

    let isMounted = true

    const controller = new AbortController()

    async function fetchSubmissions() {
      setIsLoadingSubmissions(true)
      try {
        const data = await submissionService.getSubmissionsByCompetition(competitionId, { signal: controller.signal })
        if (isMounted) {
          if (isMounted) setSubmissions(data)
        }
      } catch (err: unknown) {
        const isCanceled = err instanceof Error &&
          (err.name === 'CanceledError' || err.message?.includes('canceled'));
        if (isCanceled) return;
        console.error("Gagal memuat data karya:", err)
        toast.error("Gagal memuat data karya peserta")
      } finally {
        if (isMounted) setIsLoadingSubmissions(false)
      }
    }

    void fetchSubmissions()
    return () => { 
      isMounted = false 
      controller.abort()
    }
  }, [competitionId, refetchTrigger])

  // Fungsi untuk mengganti lomba yang sedang aktif dilihat
  function handleCompetitionChange(id: string) {
    setCompetitionId(id) // Cukup ubah state, URL akan tetap bersih
  }

  const refetchSubmissions = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1)
  }, [])

  return {
    competitions,
    isLoadingCompetitions,
    competitionId,
    handleCompetitionChange,
    submissions,
    isLoadingSubmissions,
    refetchSubmissions,
  }
}