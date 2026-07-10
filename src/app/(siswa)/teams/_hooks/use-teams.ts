import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { teamService } from "@/src/services";
import type { Team } from "@/src/types/team.types";

export function useTeams() {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => setRefetchTrigger((prev) => prev + 1), []);

  useEffect(() => {
    let isMounted = true;
    async function loadTeam() {
      setIsLoading(true);
      try {
        const data = await teamService.getMyTeam();
        if (isMounted) setTeam(data);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          // Normal if the user doesn't have a team yet
          if (isMounted) setTeam(null);
        } else {
          console.error("Gagal memuat tim:", error);
          toast.error("Gagal memuat informasi tim");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void loadTeam();
    return () => {
      isMounted = false;
    };
  }, [refetchTrigger]);

  return {
    team,
    isLoading,
    refetch,
  };
}
