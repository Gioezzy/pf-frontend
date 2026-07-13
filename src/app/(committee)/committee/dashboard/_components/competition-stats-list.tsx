import Link from "next/link";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import type { CompetitionStat } from "../_hooks/use-dashboard";
import type { Competition } from "@/src/types/competition.types";

export function CompetitionStatsList({
  competitions,
  stats,
  isLoadingCompetitions,
  isLoadingStats,
}: {
  competitions: Competition[];
  stats: Record<string, CompetitionStat>;
  isLoadingCompetitions: boolean;
  isLoadingStats: boolean;
}) {
  if (isLoadingCompetitions) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (competitions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Belum ada lomba yang dibuat.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {competitions.map((competition) => {
        const stat = stats[competition.id ?? ""];
        return (
          <Card key={competition.id} className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#E7A93C]/30 hover:bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base group-hover:text-[#E7A93C] transition-colors">{competition.name}</CardTitle>
                <Badge
                  variant={competition.isActive === false ? "secondary" : "default"}
                >
                  {competition.isActive === false ? "Nonaktif" : "Aktif"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 mt-1">
                {competition.description ?? "Tidak ada deskripsi."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 text-sm">
              <div>
                <p className="text-2xl font-semibold">
                  {isLoadingStats ? "…" : stat?.verifiedCount ?? 0}
                </p>
                <p className="text-muted-foreground">Peserta</p>
              </div>
              {competition.requiresSubmission && (
                <div>
                  <p className="text-2xl font-semibold">
                    {isLoadingStats ? "…" : stat?.submissionCount ?? 0}
                  </p>
                  <p className="text-muted-foreground">Karya masuk</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="gap-2 pt-2 border-t mt-4 border-muted/30">
              <Link href={`/committee/registrations?competitionId=${competition.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full shadow-none border-gray-200 text-gray-700 hover:bg-gray-50">
                  Lihat Peserta
                </Button>
              </Link>
              {competition.requiresSubmission && (
                <Link href={`/committee/submissions?competitionId=${competition.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full shadow-none border-[#E7A93C]/20 text-[#E7A93C] hover:bg-[#E7A93C]/10">
                    Lihat Karya
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
