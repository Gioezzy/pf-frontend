import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { AppSidebar } from "../../components/dashboard/app-sidebar";
import { SiteHeader } from "../../components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";

export const metadata: Metadata = {
  title: "Bendahara | Physics Festival",
  description: "Area bendahara verifikasi pembayaran",
};

export default function SiswaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">{children}</div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

