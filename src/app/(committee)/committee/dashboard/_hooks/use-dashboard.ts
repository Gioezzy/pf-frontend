"use client";

import { useEffect, useState } from "react";
import {
  competitionService,
  registrationService,
  submissionService,
} from "@/src/services";
import type { Competition } from "@/src/types/competition.types";

export interface CompetitionStat {
  competitionId: string;
  verifiedCount: number;
  submissionCount: number;
}

export function useDashboard() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(true);
  const [stats, setStats] = useState<Record<string, CompetitionStat>>({});
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCompetitions() {
      setIsLoadingCompetitions(true);
      try {
        const data = await competitionService.getActiveCompetitions();
        if (isMounted) setCompetitions(data);
      } catch (err) {
        console.error("Gagal memuat daftar lomba:", err);
      } finally {
        if (isMounted) setIsLoadingCompetitions(false);
      }
    }
    void loadCompetitions();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (competitions.length === 0) {
      setIsLoadingStats(false);
      return;
    }
    let isMounted = true;
    async function loadStats() {
      setIsLoadingStats(true);
      const entries = await Promise.all(
        competitions.map(async (competition) => {
          if (!competition.id) {
            return [
              "",
              { competitionId: "", verifiedCount: 0, submissionCount: 0 },
            ] as const;
          }
          try {
            const [verified, submissions] = await Promise.all([
              registrationService.getVerifiedParticipants(competition.id),
              competition.requiresSubmission 
                ? submissionService.getSubmissionsByCompetition(competition.id) 
                : Promise.resolve([]),
            ]);
            return [
              competition.id,
              {
                competitionId: competition.id,
                verifiedCount: verified.length,
                submissionCount: submissions.length,
              },
            ] as const;
          } catch {
            return [
              competition.id,
              { competitionId: competition.id, verifiedCount: 0, submissionCount: 0 },
            ] as const;
          }
        }),
      );

      if (isMounted) {
        setStats(Object.fromEntries(entries));
        setIsLoadingStats(false);
      }
    }
    void loadStats();
    return () => {
      isMounted = false;
    };
  }, [competitions]);

  const totalVerified = Object.values(stats).reduce(
    (sum, s) => sum + s.verifiedCount,
    0,
  );
  const totalSubmissions = Object.values(stats).reduce(
    (sum, s) => sum + s.submissionCount,
    0,
  );

  return {
    competitions,
    isLoadingCompetitions,
    stats,
    isLoadingStats,
    totalVerified,
    totalSubmissions,
  };
}
