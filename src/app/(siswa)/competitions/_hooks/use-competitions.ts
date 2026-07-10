import { useEffect, useState } from "react";
import { toast } from "sonner";
import { competitionService } from "@/src/services";
import type { Competition } from "@/src/types/competition.types";

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCompetitions() {
      setIsLoading(true);
      try {
        const data = await competitionService.getActiveCompetitions();
        if (isMounted) {
          setCompetitions(data);
        }
      } catch (error) {
        console.error("Gagal memuat daftar lomba:", error);
        toast.error("Gagal memuat daftar lomba");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadCompetitions();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    competitions,
    isLoading,
  };
}
