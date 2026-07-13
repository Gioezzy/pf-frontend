// admin/users/_components/create-user-card.tsx
"use client"

import { useState } from "react" // 1. Tambahkan import useState
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  ShieldCheckIcon,
  UserPlusIcon,
} from "lucide-react" // 2. Tambahkan ikon Eye
import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { useCreateUserForm } from "../_hooks/use-create-user-form"
import { ROLE_OPTIONS, type UserRole } from "../_lib/roles"

export function CreateUserCard({ onSuccess }: { onSuccess?: () => void }) {
  const { form, setField, isSubmitting, submit } = useCreateUserForm(onSuccess)

  // 3. Tambahkan state untuk mengontrol visibilitas password
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Card className="w-full border-muted/60 shadow-sm transition-all hover:shadow-md">
      <form onSubmit={submit}>
        <CardHeader className="border-b bg-muted/20 px-6 py-5">
          <div className="flex items-center gap-2">
            <UserPlusIcon className="size-5 text-primary" />
            <CardTitle className="text-lg">Form Pembuatan Akun</CardTitle>
          </div>
          <CardDescription className="pt-2">
            Catatan: Saat ini backend belum menyediakan rute untuk melihat daftar
            pengguna, sehingga halaman ini difokuskan khusus untuk pembuatan akun.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="user-fullname" className="text-sm font-medium">Nama Lengkap</Label>
              <Input
                id="user-fullname"
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                placeholder="Misal: Budi Santoso"
                required
                className="transition-colors hover:border-primary/50 focus-visible:ring-primary/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email" className="text-sm font-medium">Alamat Email</Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="admin@physicsfestival.id"
                required
                className="transition-colors hover:border-primary/50 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {/* 4. Modifikasi Input Password */}
          <div className="grid gap-2">
            <Label htmlFor="user-password" className="text-sm font-medium">Password Baru</Label>
            <div className="relative">
              <Input
                id="user-password"
                type={showPassword ? "text" : "password"} // Dinamis berdasarkan state
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Masukkan minimal 6 karakter"
                required
                minLength={6}
                // Tambahkan pr-10 agar teks tidak tertimpa tombol ikon mata
                className="pr-10 transition-colors hover:border-primary/50 focus-visible:ring-primary/20" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
            {form.password.length > 0 && form.password.length < 6 && (
              <p className="mt-1 text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                Password saat ini {form.password.length} karakter (butuh {6 - form.password.length} lagi).
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-muted/30 p-4 transition-colors hover:border-primary/20">
            <div className="grid gap-3">
              <Label className="text-sm font-medium">Hak Akses (Role)</Label>
              <Select
                value={form.role}
                onValueChange={(value) => setField("role", value as UserRole)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-1 flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-primary/70" />
                <p>{ROLE_OPTIONS.find((opt) => opt.value === form.role)?.description}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/10 px-6 py-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto w-full sm:w-auto"
          >
            {isSubmitting ? (
              <Loader2Icon className="mr-2 size-4 animate-spin" />
            ) : (
              <UserPlusIcon className="mr-2 size-4" />
            )}
            Buat Akun Sekarang
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}