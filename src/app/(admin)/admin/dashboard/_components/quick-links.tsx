import Link from "next/link"
import { ClipboardCheckIcon, TrophyIcon, UsersIcon } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"

const QUICK_LINKS = [
  {
    href: "/admin/competitions",
    icon: TrophyIcon,
    title: "Manajemen Lomba",
    description: "Tambah, ubah, atau nonaktifkan lomba dan gelombangnya.",
  },
  {
    href: "/admin/registrations",
    icon: ClipboardCheckIcon,
    title: "Data Pendaftaran",
    description: "Lihat peserta terverifikasi dan tetapkan gelar juara.",
  },
  {
    href: "/admin/users",
    icon: UsersIcon,
    title: "Buat Akun Pengguna",
    description: "Buat akun panitia atau admin baru secara manual.",
  },
] as const

export function QuickLinks() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {QUICK_LINKS.map(({ href, icon: Icon, title, description }) => (
        <Link key={href} href={href} className="flex-1">
          <Card className="h-full group rounded-2xl border-muted/60 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#5C7C99]/30 hover:bg-card">
            <CardHeader>
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#5C7C99]/10 text-[#5C7C99] group-hover:scale-110 transition-transform duration-300">
                <Icon className="size-5" />
              </div>
              <CardTitle className="pt-2 text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
