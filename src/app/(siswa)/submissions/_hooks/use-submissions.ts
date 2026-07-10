import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { registrationService, submissionService, competitionService } from "@/src/services";
import type { Registration } from "@/src/types/registration.types";
import type { Submission } from "@/src/types/submission.types";

export function useSubmissions() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => setRefetchTrigger((prev) => prev + 1), []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [regs, comps] = await Promise.all([
          registrationService.getMyRegistrations(),
          competitionService.getActiveCompetitions(),
        ]);
        
        // Buat map ID lomba ke objek lomba untuk akses cepat
        const compMap = new Map(comps.map(c => [c.id, c]));

        // Filter registrations yang lombanya membutuhkan pengumpulan karya
        const submissionRegs = regs.filter((r) => {
          const comp = compMap.get(r.competitionId);
          return comp?.requiresSubmission === true;
        });
        
        if (isMounted) setRegistrations(submissionRegs);

        const subMap: Record<string, Submission | null> = {};
        for (const reg of submissionRegs) {
          try {
            const sub = await submissionService.getMySubmission(reg.id);
            subMap[reg.id] = sub;
          } catch (error) {
            if (isAxiosError(error) && error.response?.status === 404) {
              subMap[reg.id] = null;
            } else {
              subMap[reg.id] = null;
            }
          }
        }
        if (isMounted) setSubmissions(subMap);
      } catch (error) {
        console.error("Gagal memuat data karya:", error);
        toast.error("Gagal memuat data karya Anda");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadData();
    return () => {
      isMounted = false;
    };
  }, [refetchTrigger]);

  return {
    registrations,
    submissions,
    isLoading,
    refetch,
  };
}
