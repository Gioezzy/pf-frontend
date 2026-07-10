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
    async function fetchCompetitions() {
      setIsLoadingCompetitions(true)
      try {
        const data = await competitionService.getAllCompetitions()
        setCompetitions(data)
      } catch (error) {
        console.error("Gagal memuat daftar lomba:", error)
        toast.error("Gagal memuat daftar lomba.")
      } finally {
        setIsLoadingCompetitions(false)
      }
    }
    void fetchCompetitions()
  }, [])

  useEffect(() => {
    if (!activeCompetition) {
      setRegistrations([])
      return
    }
    async function fetchRegistrations(competitionId: string) {
      setIsLoadingRegistrations(true)
      try {
        const data =
          await registrationService.getVerifiedParticipants(competitionId)
        setRegistrations(data)
        setPendingTitles({})
      } catch (error) {
        console.error("Gagal memuat data pendaftaran:", error)
        toast.error("Gagal memuat data pendaftaran untuk lomba ini.")
      } finally {
        setIsLoadingRegistrations(false)
      }
    }
    void fetchRegistrations(activeCompetition)
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
