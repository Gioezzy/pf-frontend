"use client";

import { useSubmissions } from "./_hooks/use-submissions";
import { SubmissionList } from "./_components/submission-list";
import { FileText } from "lucide-react";

export default function SubmissionsPage() {
  const { registrations, submissions, isLoading, refetch } = useSubmissions();

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5C7C99]/20 via-[#5C7C99]/5 to-background border p-8 transition-all duration-500 hover:shadow-lg hover:border-[#5C7C99]/40 border-[#5C7C99]/20 group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
          <FileText className="w-48 h-48 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-[#5C7C99]/20 bg-[#5C7C99]/10 px-3 py-1 text-sm font-medium text-[#5C7C99] shadow-sm backdrop-blur-md mb-3">
            Pengumpulan Karya
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Karya Lomba
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Kumpulkan karya untuk lomba yang Anda ikuti dan pantau status penilaiannya dari dewan juri secara real-time.
          </p>
        </div>
      </div>

      <SubmissionList 
        registrations={registrations} 
        submissions={submissions} 
        isLoading={isLoading} 
        onMutate={refetch} 
      />
    </div>
  );
}
