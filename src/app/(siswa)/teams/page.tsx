"use client";

import { useTeams } from "./_hooks/use-teams";
import { TeamViewCard } from "./_components/team-view-card";
import { Users } from "lucide-react";

export default function TeamsPage() {
  const { team, isLoading, refetch } = useTeams();

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5C7C99]/20 via-[#5C7C99]/5 to-background border p-8 transition-all duration-500 hover:shadow-lg hover:border-[#5C7C99]/40 border-[#5C7C99]/20 group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
          <Users className="w-48 h-48 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-[#5C7C99]/20 bg-[#5C7C99]/10 px-3 py-1 text-sm font-medium text-[#5C7C99] shadow-sm backdrop-blur-md mb-3">
            Manajemen Tim
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Kelola Tim Anda
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Buat tim baru atau kelola anggota tim Anda sebelum mendaftar lomba berkelompok. Pastikan seluruh anggota telah membuat akun di platform.
          </p>
        </div>
      </div>

      <TeamViewCard team={team} isLoading={isLoading} onMutate={refetch} />
    </div>
  );
}
