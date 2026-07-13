"use client";

import { useCompetitions } from "./_hooks/use-competitions";
import { useRegistrations } from "../registrations/_hooks/use-registrations";
import { CompetitionList } from "./_components/competition-list";
import { Trophy } from "lucide-react";

export default function CompetitionsPage() {
  const { competitions, isLoading } = useCompetitions();
  const { registrations, isLoading: isRegLoading } = useRegistrations();

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5C7C99]/20 via-[#5C7C99]/5 to-background border border-[#5C7C99]/20 p-8 transition-all duration-500 hover:shadow-lg hover:border-[#5C7C99]/40 group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
          <Trophy className="w-48 h-48 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-[#5C7C99]/20 bg-[#5C7C99]/10 px-3 py-1 text-sm font-medium text-[#5C7C99] shadow-sm backdrop-blur-md mb-3">
            Eksplorasi Lomba
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Daftar Lomba Tersedia
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Temukan dan ikuti berbagai lomba menarik di Physics Festival. Perhatikan batas waktu gelombang dan syarat pendaftaran masing-masing lomba.
          </p>
        </div>
      </div>

      <CompetitionList 
        competitions={competitions} 
        isLoading={isLoading || isRegLoading} 
        registrations={registrations} 
      />
    </div>
  );
}
