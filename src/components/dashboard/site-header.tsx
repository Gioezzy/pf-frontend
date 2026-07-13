"use client"

import * as React from "react"
import { useProfile } from "@/src/hooks/use-profile"
import { Bell } from "lucide-react"
import Link from "next/link";

import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"
// IMPORT buttonVariants DARI SHADCN
import { buttonVariants } from "../ui/button"
import { NotificationDropdown } from "../NotificationDropdown"

export function SiteHeader() {
  const { profile } = useProfile()
  
  let roleDisplay = "Admin"
  if (profile?.role === "PARTICIPANT") roleDisplay = "Siswa"
  else if (profile?.role === "COMMITTEE") roleDisplay = "Panitia"
  else if (profile?.role === "TREASURER") roleDisplay = "Bendahara"

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background shadow-sm">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">

        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 h-4 data-[orientation=vertical]:self-auto"
          />
          <Link href={profile?.role === "ADMIN" ? "/admin/dashboard" : profile?.role === "COMMITTEE" ? "/committee/dashboard" : profile?.role === "TREASURER" ? "/treasurer/dashboard" : "/dashboard"}>
            <h1 className="text-sm sm:text-base font-medium hover:text-blue-600 transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-xs">
              Dashboard {roleDisplay}
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdown />
        </div>

      </div>
    </header>
  )
}