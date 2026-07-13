import type { Metadata } from "next"

import { AppSidebar } from "@/src/components/dashboard/app-sidebar"
import { SiteHeader } from "@/src/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Admin | Physics Festival",
  description: "Panel administrasi pendaftaran dan kelola lomba",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col bg-muted/30">
          <div className="@container/main flex flex-1 flex-col gap-2 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:gap-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
