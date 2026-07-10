// admin/users/page.tsx
import { UsersIcon } from "lucide-react"
import { CreateUserCard } from "./_components/create-user-card"
import { UsersTable } from "./_components/users-table"

export default function UsersPage() {
  return (
    <div className="flex flex-col px-4 py-8 lg:px-8">
      {/* Pembungkus utama agar posisinya tepat di tengah layar */}
      <div className="mx-auto w-full max-w-2xl">

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
        <CreateUserCard />

        {/* Tabel Daftar Pengguna */}
        <UsersTable />
      </div>
    </div>
  )
}