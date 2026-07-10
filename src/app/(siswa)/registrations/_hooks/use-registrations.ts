import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { registrationService } from "@/src/services";
import type { Registration } from "@/src/types/registration.types";

export function useRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => setRefetchTrigger((prev) => prev + 1), []);

  useEffect(() => {
    let isMounted = true;
    async function loadRegistrations() {
      setIsLoading(true);
      try {
        const data = await registrationService.getMyRegistrations();
        if (isMounted) setRegistrations(data);
      } catch (error) {
        console.error("Gagal memuat pendaftaran:", error);
        toast.error("Gagal memuat riwayat pendaftaran");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadRegistrations();
    return () => {
      isMounted = false;
    };
  }, [refetchTrigger]);

  return {
    registrations,
    isLoading,
    refetch,
  };
}
