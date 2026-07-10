"use client"

import * as React from "react"
import { useProfile } from "@/src/hooks/use-profile"
import { Bell } from "lucide-react"

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
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">

        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 h-4 data-[orientation=vertical]:self-auto"
          />
          <h1 className="text-base font-medium">Dashboard {roleDisplay}</h1>
        </div>

        <div className="flex items-center gap-2">
          <NotificationDropdown />
        </div>

      </div>
    </header>
  )
}