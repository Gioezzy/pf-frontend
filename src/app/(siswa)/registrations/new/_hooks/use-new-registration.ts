import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { competitionService, registrationService, teamService } from "@/src/services";
import type { Competition } from "@/src/types/competition.types";
import type { Team } from "@/src/types/team.types";
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

export function useNewRegistration(competitionId: string | null) {
  const router = useRouter();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (!competitionId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const comp = await competitionService.getCompetitionById(competitionId);
        if (isMounted) setCompetition(comp);

        // Fetch team if competition requires team
        if (comp.participantType === "TEAM") {
          try {
            const myTeam = await teamService.getMyTeam();

            if (isMounted) {
              setTeam(myTeam);
            }
          } catch (error: unknown) {
            if (error instanceof AxiosError) {
              // Normal jika user belum memiliki tim
              if (error.response?.status !== 404) {
                console.error(error);
              }
            } else {
              console.error(error);
            }
          }
        }
      } catch (error) {
        console.error("Gagal memuat detail lomba:", error);
        toast.error("Gagal memuat detail lomba");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void fetchData();
    return () => {
      isMounted = false;
    };
  }, [competitionId]);

  async function handleRegister() {
    if (!competition) return;
    if (!competition.activeWave) {
      return toast.error("Gelombang pendaftaran lomba ini sedang tidak aktif.");
    }

    if (competition.participantType === "TEAM") {
      if (!team) {
        return toast.error("Anda harus membuat tim terlebih dahulu sebelum mendaftar.");
      }
      if (team.members.length + 1 < competition.minTeamMembers || team.members.length + 1 > competition.maxTeamMembers) {
        return toast.error(`Jumlah anggota tim harus antara ${competition.minTeamMembers} - ${competition.maxTeamMembers} orang (termasuk ketua).`);
      }
    }

    setIsSubmitting(true);
    try {
      await registrationService.registerCompetition({
        competitionId: competition.id!,
        waveId: competition.activeWave.id!,
        ...(competition.participantType === "TEAM" && team ? { teamId: team.id } : {}),
      });
      toast.success("Berhasil mendaftar lomba!");
      router.push("/registrations");
    } catch (error: unknown) {
        if (axios.isAxiosError<ErrorResponse>(error)) {
          toast.error(
            error.response?.data?.message ??
              "Gagal melakukan pendaftaran lomba"
          );
        } else {
          toast.error("Terjadi kesalahan yang tidak diketahui");
        }
      }finally {
      setIsSubmitting(false);
    }
  }

  return {
    competition,
    team,
    isLoading,
    isSubmitting,
    handleRegister,
  };
}
