"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Import fungsi logout dari service auth kamu
import { logout } from "../../services/auth.service"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"
import { EllipsisVerticalIcon, CircleUserRoundIcon, LogOutIcon } from "lucide-react"

// ── FUNGSI PEMBANTU: Mengambil Inisial ───────────────────────────────
function getInitials(name: string) {
  if (!name) return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    role?: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const initials = getInitials(user.name)

  const handleLogout = async () => {
    const loadingId = toast.loading("Sedang keluar...");

    try {
      await logout();
      } catch (_error) {
      } finally {
        try {
          await fetch('/api/auth/clear', { method: 'POST' });
        } catch (err) {
          // console.error("Gagal memanggil endpoint clear cookie lokal", err);
        }

        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        toast.success("Berhasil log out.", { id: loadingId });

        // Gunakan full reload ke halaman login untuk membersihkan seluruh state React, memory cache, dan Router Cache Next.js
        window.location.href = "/login";
      }
  };

  const handleProfileRedirect = () => {
    let prefix = "";
    if (user.role === "COMMITTEE") prefix = "/committee";
    else if (user.role === "ADMIN") prefix = "/admin";
    else if (user.role === "TREASURER") prefix = "/treasurer";
    
    router.push(`${prefix}/profile`);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-foreground/70">
                {user.email}
              </span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileRedirect} className="cursor-pointer">
                <CircleUserRoundIcon className="mr-2 size-4" />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOutIcon className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}