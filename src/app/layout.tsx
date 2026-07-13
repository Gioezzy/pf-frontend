import type { Metadata } from "next"
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/src/components/ui/sonner"
import { UserProvider } from "@/src/contexts/user-context"
import { NotificationProvider } from "@/src/contexts/notification-context"


const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: {
    template: "%s | Physics Festival XXV",
    default: "Physics Festival XXV",
  },
  description: "Platform resmi untuk pendaftaran dan manajemen perlombaan Physics Festival",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
          <UserProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </UserProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
