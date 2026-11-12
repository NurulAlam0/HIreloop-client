"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Settings,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth-client"
import {
  ROLE_LABELS,
  type DashboardRole,
  type DashboardUser,
} from "@/lib/dashboard"
import { cn } from "@/lib/utils"

const SEARCH_PLACEHOLDER: Record<DashboardRole, string> = {
  "job-seeker": "Search for opportunities...",
  recruiter: "Search candidates, jobs...",
  admin: "Global search...",
}

function Dot({ tone }: { tone: "red" | "green" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute top-[6px] right-[7px] size-2 rounded-full ring-2 ring-[#0e0e11]",
        tone === "red" ? "bg-[#ef4444]" : "bg-[#22c55e]",
      )}
    />
  )
}

export function DashboardTopbar({
  role,
  user,
  fontClassName,
  onOpenSidebar,
}: {
  role: DashboardRole
  user: DashboardUser
  fontClassName?: string
  onOpenSidebar: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  const isSeeker = role === "job-seeker"
  const placeholder = isSeeker
    ? pathname.startsWith("/dashboard/seeker/applications")
      ? "Search applications..."
      : "Search jobs, companies, or skills..."
    : SEARCH_PLACEHOLDER[role]

  const initial =
    user.name.trim().charAt(0).toUpperCase() ||
    user.email.charAt(0).toUpperCase() ||
    "?"

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      router.push("/")
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header
      className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 rounded-t-[11px] border-b border-white/[0.07] bg-[#0e0e11] px-4 lg:px-8"
    >
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="-ml-1 flex size-9 items-center justify-center rounded-lg text-[#c4c7c8] transition-colors hover:bg-white/5 hover:text-white lg:hidden"
      >
        <Menu className="size-5" strokeWidth={1.8} />
      </button>

      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="relative w-full max-w-[320px]"
      >
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-[#c4c7c8]"
          strokeWidth={1.7}
        />
        <input
          type="search"
          name="q"
          aria-label="Search"
          placeholder={placeholder}
          className="h-9 w-full rounded-lg border border-white/10 bg-[#0c0c0f] pr-3 pl-10 text-[13px] text-[#ededef] outline-none transition placeholder:text-[#828997] focus:border-[#5c53fe]/60 focus:ring-2 focus:ring-[#5c53fe]/15"
        />
      </form>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {isSeeker ? (
          <>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-8 w-9 items-center justify-center rounded-lg text-[#c4c7c8] transition-colors hover:bg-white/5 hover:text-white"
            >
              <Bell className="size-[18px]" strokeWidth={1.7} />
              <Dot tone="green" />
            </button>

            <button
              type="button"
              title="Coming soon"
              className="ml-1 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#f0f0f2] px-3 text-[13px] leading-5 font-semibold text-[#111318] transition-colors hover:bg-white sm:gap-2 sm:px-4"
            >
              <Plus aria-hidden="true" className="size-4" strokeWidth={2.4} />
              <span className="hidden sm:inline">Upload Resume</span>
              <span className="sm:hidden">Resume</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-8 w-9 items-center justify-center rounded-lg text-[#c4c7c8] transition-colors hover:bg-white/5 hover:text-white"
            >
              <Bell className="size-[18px]" strokeWidth={1.7} />
              <Dot tone="red" />
            </button>

            {role === "admin" ? (
              <button
                type="button"
                aria-label="Settings"
                className="flex h-8 w-9 items-center justify-center rounded-lg text-[#c4c7c8] transition-colors hover:bg-white/5 hover:text-white"
              >
                <Settings className="size-[18px]" strokeWidth={1.7} />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Messages"
                className="relative flex h-8 w-9 items-center justify-center rounded-lg text-[#c4c7c8] transition-colors hover:bg-white/5 hover:text-white"
              >
                <MessageSquare className="size-[18px]" strokeWidth={1.7} />
                <Dot tone="green" />
              </button>
            )}
          </>
        )}

        {!isSeeker && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Account menu"
                  className="ml-1 grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8079ff] to-[#4a42d8] text-[12px] font-semibold text-white ring-1 ring-white/15 transition hover:brightness-110"
                >
                  {initial}
                </button>
              }
            />

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className={cn(
                "w-64 rounded-xl border border-white/10 bg-[#141418] p-1.5 text-[#ededef] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.85)]",
                fontClassName,
              )}
            >
              <div className="px-2.5 py-2">
                <p className="truncate text-[13px] font-semibold text-[#f4f4f5]">
                  {user.name}
                </p>
                <p className="truncate text-[12px] text-[#8f909e]">{user.email}</p>
                <span className="mt-2 inline-flex items-center rounded-full border border-[#5c53fe]/30 bg-[#5c53fe]/15 px-2 py-0.5 text-[11px] font-semibold text-[#b7b1ff]">
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
              <DropdownMenuSeparator className="my-1.5 bg-white/[0.07]" />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#c6c6ce] outline-none focus:bg-white/[0.06] focus:text-white"
              >
                <LayoutDashboard className="size-4" strokeWidth={1.7} />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={signingOut}
                onClick={handleSignOut}
                className="gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#f87171] outline-none focus:bg-[#ef4444]/10 focus:text-[#f87171] data-[disabled]:opacity-50"
              >
                <LogOut className="size-4" strokeWidth={1.7} />
                {signingOut ? "Signing out…" : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
