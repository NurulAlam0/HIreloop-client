import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Inter, JetBrains_Mono } from "next/font/google"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { normalizeRole, type DashboardUser } from "@/lib/dashboard"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-dashboard-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-dashboard-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Dashboard — HireLoop",
    template: "%s — HireLoop",
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const role = normalizeRole(session.user.role)
  const user: DashboardUser = {
    name: session.user.name?.trim() || session.user.email,
    email: session.user.email,
    role,
  }

  return (
    <div className={cn(inter.variable, jetbrainsMono.variable)}>
      <DashboardShell
        role={role}
        user={user}
        fontClassName={inter.className}
      >
        {children}
      </DashboardShell>
    </div>
  )
}
