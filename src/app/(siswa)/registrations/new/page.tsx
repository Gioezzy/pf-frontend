"use client";

import { useSearchParams } from "next/navigation";
import { useNewRegistration } from "./_hooks/use-new-registration";
import { RegistrationForm } from "./_components/registration-form";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";

function NewRegistrationContent() {
  const searchParams = useSearchParams();
  const competitionId = searchParams.get("competitionId");
  const { competition, team, isLoading, isSubmitting, handleRegister } = useNewRegistration(competitionId);

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-8 w-full max-w-4xl mx-auto">
      <div className="text-center space-y-2 max-w-xl">
        <div className="inline-flex items-center rounded-full border border-[#5C7C99]/20 bg-[#5C7C99]/10 px-3 py-1 text-sm font-medium text-[#5C7C99] shadow-sm backdrop-blur-md mb-3">
          Pendaftaran Lomba
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Konfirmasi Pendaftaran</h1>
        <p className="text-base text-muted-foreground">
          Selesaikan pendaftaran Anda untuk lomba yang dipilih. Periksa kembali informasi gelombang, biaya, dan persyaratan keanggotaan.
        </p>
      </div>

      <RegistrationForm 
        competitionId={competitionId} 
        competition={competition} 
        team={team} 
        isLoading={isLoading} 
        isSubmitting={isSubmitting} 
        onRegister={handleRegister} 
      />
    </div>
  );
}

export default function NewRegistrationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8"><Loader2Icon className="animate-spin size-6" /></div>}>
      <NewRegistrationContent />
    </Suspense>
  );
}
