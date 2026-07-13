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
import { UsersIcon, UserPlusIcon, StarIcon, Trash2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
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
  const { profile } = useProfile();

  // Effect for debounced search
  
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
    if (!confirm("Apakah Anda yakin ingin membubarkan tim ini? Aksi ini tidak dapat dibatalkan.")) return;
    
    setIsSubmitting(true);
    try {
      await teamService.leaveTeam();
      toast.success("Tim berhasil dibubarkan.");
      onMutate();
    } catch (error: unknown) {
      if (axios.isAxiosError<ErrorResponse>(error)){
        toast.error(error.response?.data?.message ?? "Gagal membubarkan tim");
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    } finally {
      setIsSubmitting(false);
    }
  async function handleRemoveMember(memberId: string) {
    if (!confirm("Apakah Anda yakin ingin mengeluarkan anggota ini?")) return;
    
    setIsSubmitting(true);
    try {
      await teamService.removeMember(memberId);
      toast.success("Anggota berhasil dikeluarkan.");
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

  return (
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
                {profile?.id === team.leader.id && (
                  <Button variant="destructive" size="sm" onClick={handleLeaveTeam} disabled={isSubmitting} className="h-7 text-xs px-2">
                    <Trash2Icon className="h-3 w-3 mr-1" />
                    Batalkan Tim
                  </Button>
                )}
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
                <div className="flex flex-col">
                  <span className="font-semibold text-sm leading-none">{team.leader.fullName}</span>
                  <span className="text-xs text-muted-foreground mt-1">{team.leader.email}</span>
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
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none">{member.fullName}</span>
                          <span className="text-xs text-muted-foreground mt-1">Bergabung {new Date(member.joinedAt).toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>
                      {profile?.id === team.leader.id && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveMember(member.id)} 
                          disabled={isSubmitting} 
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
                    disabled={isSubmitting}
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
                              onClick={() => {
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
            <Button type="submit" disabled={isSubmitting}>
              <UserPlusIcon className="size-4 mr-2" />
              {isSubmitting ? "Menambahkan..." : "Tambah Anggota"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
