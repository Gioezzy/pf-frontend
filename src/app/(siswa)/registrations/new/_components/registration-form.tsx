import Link from "next/link";
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
import { Badge } from "@/src/components/ui/badge";
import type { Competition } from "@/src/types/competition.types";
import type { Team } from "@/src/types/team.types";

export function RegistrationForm({
  competitionId,
  competition,
  team,
  isLoading,
  isSubmitting,
  onRegister,
}: {
  competitionId: string | null;
  competition: Competition | null;
  team: Team | null;
  isLoading: boolean;
  isSubmitting: boolean;
  onRegister: () => void;
}) {
  if (!competitionId) {
    return (
      <Card className="group rounded-3xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-xl border-[#5C7C99]/30">
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          Lomba belum dipilih. Silakan kembali ke menu <Link href="/competitions" className="text-[#5C7C99] font-bold hover:underline">Eksplorasi Lomba</Link>.
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!competition) {
    return (
      <Card className="group rounded-3xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-xl border-[#5C7C99]/30">
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          Lomba tidak ditemukan.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="group rounded-3xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-xl border-[#5C7C99]/30 overflow-hidden">
        <div className="bg-gradient-to-br from-[#5C7C99]/20 via-[#5C7C99]/5 to-transparent p-6 md:p-8 border-b border-[#5C7C99]/20">
          <CardTitle className="text-2xl font-bold">{competition.name}</CardTitle>
          <CardDescription className="mt-2 text-base">{competition.description || "-"}</CardDescription>
        </div>
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gelombang Aktif</p>
              <p className="font-semibold text-base">{competition.activeWave ? competition.activeWave.name : "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Biaya Pendaftaran</p>
              <p className="font-bold text-lg text-[#5C7C99]">
                {competition.activeWave ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(competition.activeWave.price) : "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipe Peserta</p>
              <p className="font-semibold text-base">{competition.participantType === 'TEAM' ? 'Tim' : 'Individu'}</p>
            </div>
            {competition.participantType === 'TEAM' && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Batas Anggota Tim</p>
                <p className="font-semibold text-base">{competition.minTeamMembers} - {competition.maxTeamMembers} Orang</p>
              </div>
            )}
          </div>

          {competition.participantType === 'TEAM' && (
            <div className="rounded-xl border border-muted/60 p-5 bg-muted/10 shadow-inner">
              <h4 className="font-semibold mb-2 text-sm">Status Tim Anda</h4>
              {team ? (
                <div className="text-sm space-y-1">
                  <p><strong>Nama Tim:</strong> {team.name}</p>
                  <p><strong>Total Anggota:</strong> {team.members.length + 1} Orang (Termasuk Ketua)</p>
                  <Badge variant={team.members.length + 1 >= competition.minTeamMembers && team.members.length + 1 <= competition.maxTeamMembers ? 'default' : 'destructive'} className="mt-2">
                    {team.members.length + 1 >= competition.minTeamMembers && team.members.length + 1 <= competition.maxTeamMembers ? 'Memenuhi Syarat' : 'Tidak Memenuhi Syarat Anggota'}
                  </Badge>
                </div>
              ) : (
                <div className="text-sm text-destructive font-medium space-y-3 mt-2">
                  <p>Anda belum tergabung atau membuat tim apa pun. Harap buat tim sebelum mendaftar.</p>
                  <Link href="/teams">
                    <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:bg-muted/50">Buat Tim Sekarang</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {!competition.activeWave && (
            <div className="text-sm text-destructive font-medium border border-destructive/50 bg-destructive/10 p-4 rounded-xl flex items-center justify-center">
              Pendaftaran untuk lomba ini sedang ditutup karena tidak ada gelombang aktif.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 md:p-8 bg-muted/5 border-t border-muted/30">
          <Button 
            size="lg"
            className="w-full sm:w-auto bg-[#5C7C99] hover:bg-[#4A647B] text-white shadow-md rounded-full px-8"
            disabled={
              !competition.activeWave || 
              (competition.participantType === 'TEAM' && (!team || team.members.length + 1 < competition.minTeamMembers || team.members.length + 1 > competition.maxTeamMembers)) ||
              isSubmitting
            } 
            onClick={onRegister}
          >
            {isSubmitting ? "Memproses..." : "Konfirmasi & Daftar Lomba"}
          </Button>
          <Link href="/competitions" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full rounded-full" disabled={isSubmitting}>Batal</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
