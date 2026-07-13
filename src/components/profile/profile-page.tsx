"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useProfile } from "@/src/hooks/use-profile";
import { userService, storageService } from "@/src/services";
import { FilePurpose } from "@/src/types/storage.types";
import { isAxiosError } from "axios";

import Cropper, { Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import getCroppedImg from "@/src/lib/crop-image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import { InstitutionCombobox } from "@/src/components/ui/institution-combobox";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/components/ui/avatar";
import { Loader2, Upload, Camera } from "lucide-react";

export function ProfilePage() {
  const { profile, isLoading, refetch } = useProfile();

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [npsn, setNpsn] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Cache buster for avatar
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());

  // Crop State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName((prev) => prev || profile.fullName || "");
      setInstitution((prev) => prev || profile.institution || "");
      setNpsn((prev) => prev || profile.npsn || "");
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (newPassword && !currentPassword) {
      toast.error("Password saat ini harus diisi jika ingin mengubah password.");
      return;
    }
    if (currentPassword && !newPassword) {
      toast.error("Password baru harus diisi jika password saat ini diisi.");
      return;
    }

    setIsUpdatingProfile(true);
    const loadingId = toast.loading("Memperbarui profil...");

    try {
      await userService.updateProfile(profile.id, {
        fullName: fullName || undefined,
        institution: institution || undefined,
        npsn: npsn || undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      toast.success("Profil berhasil diperbarui", { id: loadingId });
      setCurrentPassword("");
      setNewPassword("");
      refetch();
    } catch (error) {
      let msg = "Gagal memperbarui profil";
      if (isAxiosError(error) && error.response?.data?.message) {
        msg = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(", ")
          : error.response.data.message;
      }
      toast.error(msg, { id: loadingId });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 2MB untuk foto profil.");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result?.toString() || "");
      setIsCropDialogOpen(true);
    });
    reader.readAsDataURL(file);
    
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploadingAvatar(true);
    setIsCropDialogOpen(false);
    const loadingId = toast.loading("Mengunggah foto profil...");

    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedFile) throw new Error("Gagal memotong gambar");

      // 1. Upload to storage
      const uploadResult = await storageService.uploadFile({
        file: croppedFile,
        purpose: FilePurpose.PROFILE_PHOTO,
        context: "avatar",
      });

      // 2. Update user avatar
      await userService.updateAvatar({ avatarUrl: uploadResult.fileUrl });

      setAvatarTimestamp(Date.now());
      toast.success("Foto profil berhasil diperbarui", { id: loadingId });
      refetch();
    } catch (error) {
      toast.error("Gagal mengunggah foto profil", { id: loadingId });
      console.error(error);
    } finally {
      setIsUploadingAvatar(false);
      setImageSrc(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Pengaturan Profil</h1>
          <p className="text-sm text-muted-foreground">Memuat informasi...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Pengaturan Profil</h1>
          <p className="text-sm text-red-500">Gagal memuat profil pengguna.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Pengaturan Profil</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi profil dan pengaturan keamanan akun Anda.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 items-start">
        {/* Kolom Foto Profil */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Foto Profil</CardTitle>
            <CardDescription>Ubah foto profil akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-sm">
                <AvatarImage src={profile.avatarUrl ? `${profile.avatarUrl}?t=${avatarTimestamp}` : ""} alt={profile.fullName || ""} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {profile.fullName?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div 
                className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 w-full">
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                disabled={isUploadingAvatar}
              />
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Pilih Foto Baru
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Format: JPG, PNG, WebP.<br />Maksimal 2MB.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Kolom Informasi Umum */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Akun</CardTitle>
            <CardDescription>
              Perbarui data diri dan kata sandi Anda di sini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Tidak dapat diubah)</Label>
                  <Input id="email" type="email" value={profile.email} disabled />
                </div>
                {profile.role === 'PARTICIPANT' && (
                  <div className="space-y-2">
                    <Label htmlFor="institution">Asal Sekolah/Instansi</Label>
                    <InstitutionCombobox 
                      id="institution"
                      value={institution}
                      onChange={setInstitution}
                      onNpsnChange={setNpsn}
                    />
                  </div>
                )}
              </div>



              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              <hr className="my-6" />
              <h3 className="font-medium text-sm text-foreground mb-4">Ganti Kata Sandi (Opsional)</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Kata Sandi Saat Ini</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCropDialogOpen} onOpenChange={(open) => !open && setIsCropDialogOpen(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sesuaikan Foto Profil</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[300px] bg-black sm:h-[400px]">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            )}
          </div>
          <div className="flex items-center gap-4 py-2">
            <span className="text-sm font-medium">Zoom:</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(Number(e.target.value));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleApplyCrop}>
              Terapkan Foto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
