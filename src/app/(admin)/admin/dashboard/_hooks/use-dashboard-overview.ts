"use client"

import { useEffect, useState } from "react"

import * as competitionService from "@/src/services/competition.service"

export type Competition = Awaited<
  ReturnType<typeof competitionService.getAllCompetitions>
>[number]

export interface DashboardStats {
  total: number
  active: number
  open: number
}

function computeStats(competitions: Competition[]): DashboardStats {
  return {
    total: competitions.length,
    active: competitions.filter((c) => c.isActive).length,
    open: competitions.filter((c) => c.isOpen).length,
  }
}

export function useDashboardOverview() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const data = await competitionService.getAllCompetitions()
        setCompetitions(data)
      } catch (error) {
        console.error("Gagal memuat ringkasan dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }
    void fetchCompetitions()
  }, [])

  return {
    stats: computeStats(competitions),
    openCompetitions: competitions.filter((c) => c.isOpen),
    isLoading,
  }
}
