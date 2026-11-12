"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import type { DashboardRole, DashboardUser } from "@/lib/dashboard"
import { cn } from "@/lib/utils"

import { DashboardSidebar } from "./sidebar"
import { DashboardTopbar } from "./topbar"

/**
 * The chrome (sidebar + topbar) follows the dashboard being viewed, so
 * `/dashboard/seeker` always renders the seeker layout even when a recruiter
 * or admin account is previewing it.
 */
function roleFromPathname(pathname: string, fallback: DashboardRole) {
  switch (pathname.split("/")[2]) {
    case "seeker":
      return "job-seeker"
    case "recruiter":
      return "recruiter"
    case "admin":
      return "admin"
    default:
      return fallback
  }
}

export function DashboardShell({
  role,
  user,
  fontClassName,
  children,
}: {
  role: DashboardRole
  user: DashboardUser
  fontClassName?: string
  children: React.ReactNode
}) {
  const [navOpen, setNavOpen] = useState(false)
  const pathname = usePathname()
  const shellRole = roleFromPathname(pathname, role)
  const isSeekerSettings = pathname === "/dashboard/seeker/settings"

  return (
    <div
      className={cn(
        "min-h-svh bg-[#08080a] text-[#ededef]",
        isSeekerSettings
          ? "min-[900px]:flex min-[900px]:h-svh min-[900px]:overflow-hidden min-[900px]:py-2 min-[900px]:pr-2"
          : "lg:flex lg:h-svh lg:overflow-hidden lg:py-2 lg:pr-2",
        fontClassName
      )}
    >
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0",
          isSeekerSettings ? "min-[900px]:block" : "lg:block",
          isSeekerSettings ? "w-[170px]" : "w-[248px]"
        )}
      >
        <DashboardSidebar role={shellRole} user={user} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent
          side="left"
          className={cn(
            "w-[268px] gap-0 border-0 bg-[#0b0b0c] p-0 sm:max-w-[268px]",
            fontClassName
          )}
        >
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Primary navigation for your HireLoop dashboard.
          </SheetDescription>
          <DashboardSidebar
            role={shellRole}
            user={user}
            onNavigate={() => setNavOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col bg-[#0e0e11]",
          isSeekerSettings
            ? "min-[900px]:h-full min-[900px]:rounded-xl min-[900px]:border min-[900px]:border-white/[0.07]"
            : "lg:h-full lg:rounded-xl lg:border lg:border-white/[0.07]"
        )}
      >
        {isSeekerSettings ? (
          <div className="min-[900px]:hidden">
            <DashboardTopbar
              role={shellRole}
              user={user}
              fontClassName={fontClassName}
              onOpenSidebar={() => setNavOpen(true)}
            />
          </div>
        ) : (
          <DashboardTopbar
            role={shellRole}
            user={user}
            fontClassName={fontClassName}
            onOpenSidebar={() => setNavOpen(true)}
          />
        )}
        <main
          className={cn(
            "min-w-0 flex-1",
            isSeekerSettings
              ? "min-[900px]:overflow-y-auto"
              : "lg:overflow-y-auto"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
