"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import * as competitionService from "@/src/services/competition.service"
import * as registrationService from "@/src/services/registration.service"

import type { ChampionTitle, Registration } from "../_lib/status"

type Competition = Awaited<
  ReturnType<typeof competitionService.getAllCompetitions>
>[number]

export function useRegistrationsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(true)
  const [activeCompetition, setActiveCompetition] = useState("")

  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false)

  const [savingId, setSavingId] = useState<string | null>(null)
  const [pendingTitles, setPendingTitles] = useState<
    Record<string, ChampionTitle>
  >({})

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchCompetitions() {
      setIsLoadingCompetitions(true)
      try {
        const data = await competitionService.getAllCompetitions({ signal: controller.signal })
        if (isMounted) {
          setCompetitions(data)
          if (data.length > 0 && data[0].id) {
            setActiveCompetition(data[0].id)
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
      isMounted = false;
      controller.abort();
    }
  }, [])

  useEffect(() => {
    if (!activeCompetition) {
      setRegistrations([])
      return
    }

    const controller = new AbortController()

    async function fetchRegistrations(competitionId: string) {
      setIsLoadingRegistrations(true)
      try {
        const data =
          await registrationService.getVerifiedParticipants(competitionId, { signal: controller.signal })
        setRegistrations(data)
        setPendingTitles({})
      } catch (error: unknown) {
        const isCanceled = error instanceof Error &&
          (error.name === 'CanceledError' || error.message?.includes('canceled'));
        if (isCanceled) return;
        console.error("Gagal memuat data pendaftaran:", error)
        toast.error("Gagal memuat data pendaftaran untuk lomba ini.")
      } finally {
        setIsLoadingRegistrations(false)
      }
    }
    
    void fetchRegistrations(activeCompetition)

    return () => {
      controller.abort()
    }
  }, [activeCompetition])

  function setPendingTitle(registrationId: string, title: ChampionTitle) {
    setPendingTitles((prev) => ({ ...prev, [registrationId]: title }))
  }

  async function saveChampion(registrationId: string) {
    const title = pendingTitles[registrationId]
    if (!title) return

    setSavingId(registrationId)
    try {
      const updated = await registrationService.setChampionTitle(
        registrationId,
        { title },
      )
      setRegistrations((prev) =>
        prev.map((r) => (r.id === registrationId ? { ...r, ...updated } : r)),
      )
      toast.success("Gelar juara berhasil disimpan.")
    } catch (error) {
      console.error("Gagal menyimpan gelar juara:", error)
      toast.error("Gagal menyimpan gelar juara.")
    } finally {
      setSavingId(null)
    }
  }

  return {
    competitions,
    isLoadingCompetitions,
    activeCompetition,
    setActiveCompetition,
    registrations,
    isLoadingRegistrations,
    savingId,
    pendingTitles,
    setPendingTitle,
    saveChampion,
  }
}
