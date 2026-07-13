// admin/users/page.tsx
"use client"

import { useState } from "react"
import { UsersIcon } from "lucide-react"
import { CreateUserCard } from "./_components/create-user-card"
import { UsersTable } from "./_components/users-table"

export default function UsersPage() {
  const [mutationKey, setMutationKey] = useState(0)

  return (
    <div className="flex flex-col px-4 py-8 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">

        {/* Header Halaman */}
        <div className="mb-8 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UsersIcon className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Buat akun panitia atau admin baru secara manual. Akun yang dibuat melalui
              panel ini akan langsung terverifikasi tanpa perlu konfirmasi OTP email.
            </p>
          </div>
        </div>

        {/* Container Form */}
        <CreateUserCard onSuccess={() => setMutationKey((k) => k + 1)} />

        {/* Tabel Daftar Pengguna — otomatis refresh saat mutationKey berubah */}
        <UsersTable onMutate={mutationKey} />

      </div>
    </div>
  )
}