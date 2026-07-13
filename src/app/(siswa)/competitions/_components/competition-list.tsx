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
import type { Competition } from "@/src/types/competition.types";
import { UsersIcon, UserIcon } from "lucide-react";

import type { Registration } from "@/src/types/registration.types";

export function CompetitionList({
  competitions,
  isLoading,
  registrations = [],
}: {
  competitions: Competition[];
  isLoading: boolean;
  registrations?: Registration[];
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (competitions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Belum ada lomba yang aktif saat ini.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {competitions.map((competition) => (
        <Card key={competition.id} className="flex flex-col h-full group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{competition.name}</CardTitle>
              {competition.isOpen ? (
                <Badge>Buka</Badge>
              ) : (
                <Badge variant="secondary">Tutup</Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2 mt-1">
              {competition.description ?? "Tidak ada deskripsi."}
            </CardDescription>
            {competition.requiresSubmission && (
              <Badge variant="outline" className="w-fit mt-2 border-[#5C7C99]/30 text-[#5C7C99] bg-[#5C7C99]/5">
                Wajib Unggah Karya
              </Badge>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {competition.participantType === "TEAM" ? (
                <>
                  <UsersIcon className="size-4" />
                  <span>
                    Tim ({competition.minTeamMembers} - {competition.maxTeamMembers} orang)
                  </span>
                </>
              ) : (
                <>
                  <UserIcon className="size-4" />
                  <span>Individu</span>
                </>
              )}
            </div>
            {competition.activeWave && (
              <div className="mt-4 pt-3 border-t border-muted/30 text-sm">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">Gelombang Aktif: {competition.activeWave.name}</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#5C7C99] text-lg">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(competition.activeWave.price)}
                  </span>
                  <span className="text-muted-foreground text-xs">/ {competition.participantType === "TEAM" ? "tim" : "peserta"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Hingga: {new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(competition.activeWave.endDate))}
                </p>
              </div>
            )}
            {competition.waves && competition.waves.length > 0 && !competition.activeWave && (
              <div className="mt-4 pt-3 border-t border-muted/30 text-sm">
                <p className="text-xs text-muted-foreground italic">Menunggu gelombang dibuka atau pendaftaran telah ditutup sepenuhnya.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {(() => {
              const isAlreadyRegistered = registrations.some(r => r.competitionId === competition.id && r.status !== 'CANCELLED' && r.status !== 'REJECTED');
              
              if (isAlreadyRegistered) {
                return (
                  <Button disabled className="w-full bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/10 hover:text-emerald-600 border border-emerald-600/20 opacity-100">
                    Sudah Terdaftar
                  </Button>
                );
              }
              
              if (competition.isOpen) {
                return (
                  <Link href={`/registrations/new?competitionId=${competition.id}`} className="w-full">
                    <Button className="w-full bg-[#5C7C99] hover:bg-[#4A647B] text-white shadow-none">Daftar Sekarang</Button>
                  </Link>
                );
              }
              
              return (
                <Button disabled className="w-full" variant="secondary">
                  Pendaftaran Ditutup
                </Button>
              );
            })()}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
