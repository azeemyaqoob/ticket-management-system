import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { TicketProvider } from "@/contexts/ticket-context"
import { AlertProvider } from "@/contexts/alert-context"
import { AlertBanner } from "@/components/alerts/alert-banner"
import { ExpirationMonitor } from "@/components/alerts/expiration-monitor"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "811 Ticket Management System",
  description: "Professional 811 ticket tracking and management system",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <TicketProvider>
              <AlertProvider>
                {children}
                <AlertBanner />
                <ExpirationMonitor />
              </AlertProvider>
            </TicketProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
