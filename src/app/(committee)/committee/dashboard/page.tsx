"use client";

import { ClipboardCheck, FileText, Trophy, ShieldCheck } from "lucide-react";
import { useDashboard } from "./_hooks/use-dashboard";
import { SummaryCard } from "./_components/summary-card";
import { CompetitionStatsList } from "./_components/competition-stats-list";
import { useProfile } from "@/src/hooks/use-profile";

export default function DashboardPage() {
  const { profile } = useProfile();
  const {
    competitions,
    isLoadingCompetitions,
    stats,
    isLoadingStats,
    totalVerified,
    totalSubmissions,
  } = useDashboard();

  return (
    <div className="flex flex-col gap-8 pb-10 px-4 lg:px-6">
      {/* Premium Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E7A93C]/20 via-[#E7A93C]/5 to-background border border-[#E7A93C]/20 p-8 md:p-12 transition-all duration-500 hover:shadow-lg hover:border-[#E7A93C]/40 group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
          <ShieldCheck className="w-64 h-64 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full border border-[#E7A93C]/20 bg-[#E7A93C]/10 px-3 py-1 text-sm font-medium text-[#E7A93C] shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#E7A93C] mr-2 animate-pulse"></span>
              Panitia Cabang Lomba
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Selamat Datang, <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5C7C99] to-[#3A506B]">
                {profile?.fullName || profile?.email || "Committee"}
              </span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg mt-2 leading-relaxed">
              Pantau progres peserta pada lomba spesifik Anda. Verifikasi karya dan siapkan rekap juara.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <SummaryCard
          icon={Trophy}
          label="Lomba Aktif"
          value={competitions.filter((c) => c.isActive !== false).length}
          isLoading={isLoadingCompetitions}
        />
        <SummaryCard
          icon={ClipboardCheck}
          label="Peserta Terverifikasi"
          value={totalVerified}
          isLoading={isLoadingStats}
        />
        <SummaryCard
          icon={FileText}
          label="Karya Terkumpul"
          value={totalSubmissions}
          isLoading={isLoadingStats}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Daftar Lomba Anda
        </h2>
        <CompetitionStatsList
          competitions={competitions}
          stats={stats}
          isLoadingCompetitions={isLoadingCompetitions}
          isLoadingStats={isLoadingStats}
        />
      </div>
    </div>
  );
}
