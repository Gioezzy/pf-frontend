import { useState, useEffect } from "react";
import { toast } from "sonner";
import { teamService, userService } from "@/src/services";
import type { User } from "@/src/types/auth.types";
import { useDebounce } from "@/src/hooks/use-debounce";
import { useProfile } from "@/src/hooks/use-profile";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { UsersIcon, UserPlusIcon, StarIcon, Trash2Icon, LogOutIcon, ArrowRightLeftIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import axios from "axios";
import { Team } from "@/src/types";

interface ErrorResponse {
  message: string;
}

export function TeamViewCard({
  team,
  isLoading,
  onMutate,
}: {
  team: Team | null;
  isLoading: boolean;
  onMutate: () => void;
}) {
  const [teamName, setTeamName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [peers, setPeers] = useState<User[]>([]);
  const [isLoadingPeers, setIsLoadingPeers] = useState(false);

  const { profile } = useProfile();

  // Modals state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [memberToTransfer, setMemberToTransfer] = useState<string | null>(null);

  useEffect(() => {
    async function performSearch() {
      if (debouncedSearch.length < 3) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const users = await userService.searchParticipants(debouncedSearch);
        setSearchResults(users);
      } catch (err) {
        console.error("Gagal mencari peserta", err);
      } finally {
        setIsSearching(false);
      }
    }
    performSearch();
  }, [debouncedSearch]);

  useEffect(() => {
    async function fetchPeers() {
      if (!team) return;
      setIsLoadingPeers(true);
      try {
        const data = await teamService.getInstitutionPeers();
        // Filter out members who are already in the team (leader + members)
        const teamMemberIds = new Set(team.members.map(m => m.userId));
        teamMemberIds.add(team.leader.id);
        const filteredPeers = data.filter(peer => !teamMemberIds.has(peer.id));
        setPeers(filteredPeers);
      } catch (err) {
        console.error("Gagal memuat peserta se-institusi", err);
      } finally {
        setIsLoadingPeers(false);
      }
    }
    fetchPeers();
  }, [team]);

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!teamName.trim()) return toast.error("Nama tim wajib diisi");

    setIsSubmitting(true);
    try {
      await teamService.createTeam({ name: teamName });
      toast.success("Tim berhasil dibuat!");
      setTeamName("");
      onMutate();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)){
        toast.error(
          error.response?.data?.message ?? "Gagal membuat tim"
        );
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!memberEmail.trim()) return toast.error("Email anggota wajib diisi");

    setIsSubmitting(true);
    try {
      await teamService.addMember({ email: memberEmail });
      toast.success("Anggota berhasil ditambahkan!");
      setMemberEmail("");
      onMutate();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)){
        toast.error(
          error.response?.data?.message ?? "Gagal menambahkan anggota"
        );
      } else {
        toast.error("Terjadi kesalahan yang tidak ketahui");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLeaveTeam() {
    setIsSubmitting(true);
    try {
      await teamService.leaveTeam();
      toast.success(profile?.id === team?.leader.id ? "Tim berhasil dibubarkan." : "Berhasil keluar dari tim.");
      setIsLeaveModalOpen(false);
      onMutate();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)){
        toast.error(error.response?.data?.message ?? "Gagal memproses permintaan");
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemoveMember() {
    if (!memberToRemove) return;
    setIsSubmitting(true);
    try {
      await teamService.removeMember(memberToRemove);
      toast.success("Anggota berhasil dikeluarkan.");
      setMemberToRemove(null);
      onMutate();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)){
        toast.error(error.response?.data?.message ?? "Gagal mengeluarkan anggota");
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleTransferLeadership() {
    if (!memberToTransfer) return;
    setIsSubmitting(true);
    try {
      await teamService.transferLeadership(memberToTransfer);
      toast.success("Kepemimpinan berhasil dipindahkan.");
      setMemberToTransfer(null);
      onMutate();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)){
        toast.error(error.response?.data?.message ?? "Gagal memindahkan kepemimpinan");
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!team) {
    return (
      <Card className="max-w-xl group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card">
        <CardHeader>
          <CardTitle>Buat Tim Baru</CardTitle>
          <CardDescription>
            Anda belum tergabung dalam tim manapun. Buat tim baru untuk mulai mendaftar lomba beregu.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleCreateTeam}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="teamName">Nama Tim</Label>
                <Input
                  id="teamName"
                  placeholder="Masukkan nama tim..."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Buat Tim"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  const isLeader = profile?.id === team.leader.id;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UsersIcon className="size-5 text-primary" />
              <CardTitle>{team.name}</CardTitle>
            </div>
            <CardDescription>{team.institution}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold">Ketua Tim</h4>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => setIsLeaveModalOpen(true)} 
                    disabled={isSubmitting || team.isRegistered} 
                    className="h-7 text-xs px-2"
                    title={team.isRegistered ? "Tim sedang dalam proses pendaftaran lomba" : ""}
                  >
                    {isLeader ? (
                      <><Trash2Icon className="h-3 w-3 mr-1" />Batalkan Tim</>
                    ) : (
                      <><LogOutIcon className="h-3 w-3 mr-1" />Keluar Tim</>
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl border border-muted">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={team.leader.avatarUrl || ""} alt={team.leader.fullName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {team.leader.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                      <StarIcon className="size-4 text-yellow-500 fill-yellow-500 drop-shadow-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <span className="font-semibold text-sm leading-none block">{team.leader.fullName}</span>
                      <span className="text-xs text-muted-foreground">{team.leader.email}</span>
                    </div>
                    {(team.leader.institution || team.leader.npsn) && (
                      <div className="text-xs bg-background/50 rounded px-2 py-1 border border-border/50 inline-flex flex-col gap-0.5 w-fit">
                        {team.leader.institution && <span className="font-medium text-foreground/80">{team.leader.institution}</span>}
                        {team.leader.npsn && <span className="text-muted-foreground">NPSN: {team.leader.npsn}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  Anggota Tim 
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    {team.members.length}
                  </span>
                </h4>
                {team.members.length === 0 ? (
                  <div className="bg-muted/30 border border-dashed border-muted-foreground/20 rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground">Belum ada anggota yang bergabung.</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between gap-3 bg-card p-3 rounded-xl border border-muted/60 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatarUrl || ""} alt={member.fullName} />
                            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                              {member.fullName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1.5">
                            <div>
                              <span className="text-sm font-medium leading-none block">{member.fullName}</span>
                              <span className="text-xs text-muted-foreground">Bergabung {new Date(member.joinedAt).toLocaleDateString("id-ID")}</span>
                            </div>
                            {(member.institution || member.npsn) && (
                              <div className="text-xs bg-muted/30 rounded px-2 py-1 border border-border/40 inline-flex flex-col gap-0.5 w-fit">
                                {member.institution && <span className="font-medium text-foreground/80">{member.institution}</span>}
                                {member.npsn && <span className="text-muted-foreground">NPSN: {member.npsn}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        {isLeader && (
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setMemberToTransfer(member.userId)} 
                              disabled={isSubmitting || team.isRegistered} 
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                              title={team.isRegistered ? "Tim sedang dalam proses pendaftaran lomba" : "Jadikan Ketua"}
                            >
                              <ArrowRightLeftIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setMemberToRemove(member.userId)} 
                              disabled={isSubmitting || team.isRegistered} 
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                              title={team.isRegistered ? "Tim sedang dalam proses pendaftaran lomba" : "Keluarkan Anggota"}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isLeader && (
          <div className="flex flex-col gap-6">
            <Card className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card">
              <CardHeader>
                <CardTitle>Tambah Anggota</CardTitle>
                <CardDescription>
                  Tambahkan anggota ke dalam tim menggunakan alamat email mereka.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleAddMember}>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Cari Peserta (Email)</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="Masukkan email peserta..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                          disabled={isSubmitting || team.isRegistered}
                        />
                        {showDropdown && searchQuery.length >= 3 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-muted/60 shadow-md rounded-xl overflow-hidden z-10 max-h-60 overflow-y-auto">
                            {isSearching ? (
                              <div className="p-3 text-sm text-muted-foreground text-center animate-pulse">Mencari...</div>
                            ) : searchResults.length > 0 ? (
                              <div className="flex flex-col">
                                {searchResults.map((u) => (
                                  <div 
                                    key={u.id}
                                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setMemberEmail(u.email);
                                      setSearchQuery(u.email);
                                      setShowDropdown(false);
                                    }}
                                  >
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={u.avatarUrl || ""} alt={u.fullName || u.email} />
                                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                        {(u.fullName || u.email).charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium leading-none">{u.fullName || 'Tanpa Nama'}</span>
                                      <span className="text-xs text-muted-foreground mt-1">{u.email}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-3 text-sm text-muted-foreground text-center">Peserta tidak ditemukan</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting || team.isRegistered}>
                    <UserPlusIcon className="size-4 mr-2" />
                    {isSubmitting ? "Menambahkan..." : "Tambah Anggota"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {peers.length > 0 && (
              <Card className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Saran Anggota</CardTitle>
                  <CardDescription>
                    Peserta dari institusi yang sama dengan Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 max-h-60 overflow-y-auto">
                    {peers.map((peer) => (
                      <div key={peer.id} className="flex items-center justify-between gap-3 bg-card p-3 rounded-xl border border-muted/60 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={peer.avatarUrl || ""} alt={peer.fullName || "User Avatar"} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {peer.fullName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium leading-none">{peer.fullName || 'Tanpa Nama'}</span>
                            <span className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">{peer.email}</span>
                          </div>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={async () => {
                            if (isSubmitting) return;
                            setIsSubmitting(true);
                            try {
                              await teamService.addMember({ email: peer.email });
                              toast.success("Anggota berhasil ditambahkan!");
                              onMutate();
                            } catch (error: unknown) {
                              if (axios.isAxiosError<ErrorResponse>(error)){
                                toast.error(
                                  error.response?.data?.message ?? "Gagal menambahkan anggota"
                                );
                              } else {
                                toast.error("Terjadi kesalahan yang tidak ketahui");
                              }
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                          disabled={isSubmitting || team.isRegistered}
                          className="h-7 text-xs"
                          title={team.isRegistered ? "Tim sedang dalam proses pendaftaran lomba" : ""}
                        >
                          Tambah
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Leave/Disband Modal */}
      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isLeader ? "Batalkan Tim?" : "Keluar dari Tim?"}</DialogTitle>
            <DialogDescription>
              {isLeader 
                ? "Apakah Anda yakin ingin membubarkan tim ini? Seluruh anggota akan dikeluarkan dan aksi ini tidak dapat dibatalkan."
                : "Apakah Anda yakin ingin keluar dari tim ini? Anda harus diundang kembali jika ingin bergabung lagi."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveModalOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleLeaveTeam} disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Ya, Lanjutkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Modal */}
      <Dialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keluarkan Anggota?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengeluarkan anggota ini dari tim?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberToRemove(null)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember} disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Ya, Keluarkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Leadership Modal */}
      <Dialog open={!!memberToTransfer} onOpenChange={(open) => !open && setMemberToTransfer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jadikan Ketua Tim?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin memindahkan status ketua tim ke anggota ini? Anda akan menjadi anggota biasa setelah aksi ini.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberToTransfer(null)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button variant="default" onClick={handleTransferLeadership} disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Ya, Jadikan Ketua"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
