"use client";

import { useProfile } from "@/src/hooks/use-profile";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { User, Phone, School, Mail, KeyRound, Clock, Activity, Zap } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/3 rounded-lg" />
          <Skeleton className="h-5 w-1/4 rounded-lg" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[250px] rounded-2xl" />
          <Skeleton className="h-[250px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <div className="p-4 rounded-full bg-destructive/10">
          <Activity className="size-8 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Oops! Sesuatu Salah</h1>
          <p className="text-muted22-foreground mt-2">Gagal memuat profil pengguna. Silakan muat ulang halaman.</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">Coba Lagi</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Premium Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5C7C99]/20 via-[#5C7C99]/5 to-background border p-8 md:p-12 transition-all duration-500 hover:shadow-lg hover:border-[#5C7C99]/30 border-[#5C7C99]/20 group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
          <Zap className="w-64 h-64 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full border border-[#5C7C99]/20 bg-[#5C7C99]/10 px-3 py-1 text-sm font-medium text-[#5C7C99] shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#5C7C99] mr-2 animate-pulse"></span>
              Siswa Terdaftar
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Selamat Datang, <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5C7C99] to-[#3A506B]">
                {profile.fullName || profile.email}
              </span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-lg mt-2 leading-relaxed">
              Ini adalah pusat komando Anda. Pantau status pendaftaran lomba, gabung dengan tim, dan kumpulkan karya terbaik Anda.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/registrations/new">
              <Button size="lg" className="rounded-full shadow-md hover:shadow-xl transition-all font-semibold">
                Daftar Lomba Baru
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profil Detail Card */}
        <Card className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#5C7C99]/10 text-[#5C7C99] group-hover:scale-110 transition-transform duration-300">
                <User className="h-5 w-5" />
              </div>
              Data Pribadi
            </CardTitle>
            <CardDescription>Informasi identitas akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="group/item border-b border-muted/30 pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> Nama Lengkap
              </p>
              <p className="font-medium text-foreground">{profile.fullName || "-"}</p>
            </div>
            <div className="group/item border-b border-muted/30 pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> Alamat Email
              </p>
              <p className="font-medium text-foreground">{profile.email}</p>
            </div>
            <div className="group/item border-b border-muted/30 pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" /> Nomor Telepon
              </p>
              <p className="font-medium text-foreground">{profile.phoneNumber || "-"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Instansi Card */}
        <Card className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#5C7C99]/10 text-[#5C7C99] group-hover:scale-110 transition-transform duration-300">
                <School className="h-5 w-5" />
              </div>
              Kesiswaan
            </CardTitle>
            <CardDescription>Detail instansi dan status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="group/item border-b border-muted/30 pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <School className="h-3.5 w-3.5" /> Asal Sekolah / Instansi
              </p>
              <p className="font-medium text-foreground">{profile.institution || "-"}</p>
            </div>
            <div className="group/item border-b border-muted/30 pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <KeyRound className="h-3.5 w-3.5" /> Peran Pengguna
              </p>
              <div className="mt-1">
                <Badge className="bg-[#5C7C99]/20 text-[#5C7C99] border-[#5C7C99]/30 hover:bg-primary/30 transition-colors">
                  {profile.role}
                </Badge>
              </div>
            </div>
            <div className="group/item border-b border-muted/30 pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Tanggal Bergabung
              </p>
              <p className="font-medium text-foreground">
                {new Date(profile.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Akses Cepat Card */}
        <Card className="group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#5C7C99]/10 text-[#5C7C99] group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-5 w-5" />
              </div>
              Akses Cepat
            </CardTitle>
            <CardDescription>Jalan pintas ke fitur utama</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/registrations" className="w-full">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-muted-foreground/20 hover:border-[#5C7C99]/50 hover:bg-[#5C7C99]/5 transition-all">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-3"></span>
                Status Pendaftaran Lomba
              </Button>
            </Link>
            <Link href="/teams" className="w-full">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-muted-foreground/20 hover:border-[#5C7C99]/50 hover:bg-[#5C7C99]/5 transition-all">
                <span className="w-2 h-2 rounded-full bg-purple-500 mr-3"></span>
                Manajemen Tim
              </Button>
            </Link>
            <Link href="/submissions" className="w-full">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-muted-foreground/20 hover:border-[#5C7C99]/50 hover:bg-[#5C7C99]/5 transition-all">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-3"></span>
                Pengumpulan Karya
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
