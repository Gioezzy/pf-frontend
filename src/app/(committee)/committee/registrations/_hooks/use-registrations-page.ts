"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import * as competitionService from "@/src/services/competition.service"
import * as registrationService from "@/src/services/registration.service"

import type { ChampionTitle, Registration } from "../_lib/status"

type Competition = Awaited<
  ReturnType<typeof competitionService.getActiveCompetitions>
>[number]

export function useRegistrationsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(true)
  const [activeCompetition, setActiveCompetition] = useState("")

  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false)

  useEffect(() => {
    async function fetchCompetitions() {
      setIsLoadingCompetitions(true)
      try {
        const data = await competitionService.getActiveCompetitions()
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
      } catch (error) {
        console.error("Gagal memuat data pendaftaran:", error)
        toast.error("Gagal memuat data pendaftaran untuk lomba ini.")
      } finally {
        setIsLoadingRegistrations(false)
      }
    }
    void fetchRegistrations(activeCompetition)
  }, [activeCompetition])

  return {
    competitions,
    isLoadingCompetitions,
    activeCompetition,
    setActiveCompetition,
    registrations,
    isLoadingRegistrations,
  }
}
