"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "../ui/sidebar"

import { isAxiosError } from "axios"

import {
  LayoutDashboardIcon,
  TrophyIcon,
  ClipboardCheckIcon,
  UsersIcon,
  FileTextIcon,
  RocketIcon,
  UploadCloudIcon,
  Loader2Icon,
  Banknote
} from "lucide-react"

// Import types dan service
import { UserRole } from "../../types/auth.types"
import { useProfileContext } from "../../contexts/user-context"

// ── Tipe Data Menu ────────────────────────────────────────────────────────
export interface NavSubItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface NavItem {
  title: string;
  url: string;
  icon: React.ReactNode;
  isActive?: boolean;
  items?: NavSubItem[];
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

// ── Konfigurasi Label Role ────────────────────────────────────────────────
const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Admin Panel",
  [UserRole.COMMITTEE]: "Panel Panitia",
  [UserRole.PARTICIPANT]: "Area Peserta",
  [UserRole.TREASURER]: 'Area Bendahara',
}

// ── Konfigurasi Menu Berdasarkan Role ─────────────────────────────────────
const SIDEBAR_CONFIG: Record<UserRole, NavGroup[]> = {
  [UserRole.ADMIN]: [
    {
      items: [
        { title: "Dashboard", url: "/admin/dashboard", icon: <LayoutDashboardIcon /> },
      ],
    },
    {
      label: "Manajemen Lomba",
      items: [
        { title: "Daftar Lomba", url: "/admin/competitions", icon: <TrophyIcon /> },
      ],
    },
    {
      label: "Registrasi & Penilaian",
      items: [
        { title: "Data Pendaftaran", url: "/admin/registrations", icon: <ClipboardCheckIcon /> },
        { title: "Karya & Submission", url: "/admin/submissions", icon: <FileTextIcon /> },
      ],
    },
    {
      label: "Pengguna",
      items: [
        { title: "Buat Akun Pengguna", url: "/admin/users", icon: <UsersIcon /> },
      ],
    },
  ],

  [UserRole.COMMITTEE]: [
    {
      items: [
        { title: "Dashboard", url: "/committee/dashboard", icon: <LayoutDashboardIcon /> },
      ],
    },
    {
      label: "Registrasi",
      items: [
        { title: "Pendaftaran Peserta", url: "/committee/registrations", icon: <ClipboardCheckIcon /> },
      ],
    },
    {
      label: "Penilaian Lomba",
      items: [
        { title: "Karya & Penilaian", url: "/committee/submissions", icon: <FileTextIcon /> },
      ],
    },
  ],

  [UserRole.PARTICIPANT]: [
    {
      items: [
        { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboardIcon /> },
      ],
    },
    {
      label: "Eksplorasi",
      items: [
        // GET /competitions (public) & GET /competitions/:id (public)
        { title: "Daftar Lomba", url: "/competitions", icon: <TrophyIcon /> },
        // POST /teams, POST /teams/members, GET /teams/my-team
        { title: "Tim Saya", url: "/teams", icon: <UsersIcon /> },
      ],
    },
    {
      label: "Aktivitas",
      items: [
        // POST /registrations, GET /registrations/my-registrations
        { title: "Pendaftaran Saya", url: "/registrations", icon: <ClipboardCheckIcon /> },
        // POST /submissions, GET /submissions/my-submission/:registrationId,
        // DELETE /submissions/:id
        { title: "Karya Saya", url: "/submissions", icon: <UploadCloudIcon /> },
      ],
    },
  ],

  [UserRole.TREASURER]: [
    {
      items: [
        { title: "Verifikasi Pembayaran", url: "/treasurer/payments", icon: <Banknote /> }
      ]
    }
  ]
}

// ── Fungsi Pembantu (Helper) ──────────────────────────────────────────────
function formatNameFromEmail(email: string): string {
  if (!email) return "User"
  const namePart = email.split("@")[0]
  if (!namePart) return "User"

  return namePart
    .split(/[._-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .replace(/[0-9]/g, "")
    .trim()
}

// ── Komponen Utama ────────────────────────────────────────────────────────
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { profile: user, isLoading } = useProfileContext()

  const checkIsActive = (url: string) => {
    if (!url || url === "#") return false
    // Memastikan active state presisi agar tidak tumpang tindih
    return pathname === url || pathname.startsWith(`${url}/`)
  }

  const injectActiveState = (items: NavItem[]): NavItem[] => {
    return items.map((item) => {
      const isItemActive = checkIsActive(item.url)
      const hasActiveSubItem = item.items?.some((sub) => checkIsActive(sub.url))

      return {
        ...item,
        isActive: isItemActive || hasActiveSubItem,
        items: item.items?.map((sub) => ({
          ...sub,
          isActive: checkIsActive(sub.url),
        })),
      }
    })
  }

  if (isLoading) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarContent className="flex items-center justify-center h-full text-muted-foreground">
          <Loader2Icon className="size-6 animate-spin" />
        </SidebarContent>
      </Sidebar>
    )
  }

  if (!user) return null

  const rawNavGroups = SIDEBAR_CONFIG[user.role] ?? []
  const dynamicNavGroups = rawNavGroups.map((group) => ({
    ...group,
    items: injectActiveState(group.items),
  }))

  const displayName = user.fullName || formatNameFromEmail(user.email)
  const roleLabel = ROLE_LABELS[user.role] || "Dashboard"

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href={dynamicNavGroups[0]?.items[0]?.url || "#"} />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <RocketIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Physics Festival</span>
                <span className="truncate text-xs text-muted-foreground">{roleLabel}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {dynamicNavGroups.map((group, index) => (
          <SidebarGroup key={index}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <NavMain items={group.items} />
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: displayName,
            email: user.email,
            avatar: user.avatarUrl || "",
            role: user.role,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}