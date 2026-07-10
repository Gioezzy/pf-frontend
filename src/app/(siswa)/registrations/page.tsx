"use client";

import { useRegistrations } from "./_hooks/use-registrations";
import { RegistrationList } from "./_components/registration-list";
import { ClipboardCheck } from "lucide-react";

export default function RegistrationsPage() {
  const { registrations, isLoading, refetch } = useRegistrations();

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5C7C99]/20 via-[#5C7C99]/5 to-background border p-8 transition-all duration-500 hover:shadow-lg hover:border-[#5C7C99]/40 border-[#5C7C99]/20 group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
          <ClipboardCheck className="w-48 h-48 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-[#5C7C99]/20 bg-[#5C7C99]/10 px-3 py-1 text-sm font-medium text-[#5C7C99] shadow-sm backdrop-blur-md mb-3">
            Pendaftaran Lomba
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Riwayat Pendaftaran
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Pantau status verifikasi dan unggah bukti pembayaran pendaftaran Anda di sini.
          </p>
        </div>
      </div>

      <RegistrationList registrations={registrations} isLoading={isLoading} onMutate={refetch} />
    </div>
  );
}
