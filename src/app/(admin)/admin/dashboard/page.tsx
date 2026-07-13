"use client"

import { OpenCompetitionsCard } from "./_components/open-competitions-card"
import { QuickLinks } from "./_components/quick-links"
import { useDashboardOverview } from "./_hooks/use-dashboard-overview"
import { useProfile } from "@/src/hooks/use-profile"
import { ShieldAlert, Activity } from "lucide-react"

export default function DashboardPage() {
  const { openCompetitions, isLoading } = useDashboardOverview()
  const { profile } = useProfile()

  return (
    <div className="flex flex-col gap-8 pb-10 px-4 lg:px-6">
      {/* Premium Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5C7C99]/20 via-[#5C7C99]/5 to-background border border-[#5C7C99]/20 p-8 md:p-12 transition-all duration-500 hover:shadow-lg hover:border-[#5C7C99]/40 group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
          <ShieldAlert className="w-64 h-64 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full border border-[#5C7C99]/20 bg-[#5C7C99]/10 px-3 py-1 text-sm font-medium text-[#5C7C99] shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#5C7C99] mr-2 animate-pulse"></span>
              Administrator Pusat
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Selamat Datang, <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5C7C99] to-[#3A506B]">
                {profile?.fullName || profile?.email || "Admin PF"}
              </span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg mt-2 leading-relaxed">
              Ini adalah pusat komando Anda. Pantau status lomba, manajemen data pendaftaran, dan atur kompetisi secara menyeluruh.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Open Competitions spanning 2 cols */}
        <div className="md:col-span-2">
          <OpenCompetitionsCard competitions={openCompetitions} isLoading={isLoading} />
        </div>
        
        {/* Quick Links in 1 col */}
        <div>
          <QuickLinks />
        </div>
      </div>
    </div>
  )
}
