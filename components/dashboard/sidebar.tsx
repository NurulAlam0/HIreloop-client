"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Bookmark,
  Briefcase,
  Building2,
  CirclePlus,
  CreditCard,
  FileUp,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  type LucideIcon,
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
  DASHBOARD_ROUTES,
  ROLE_LABELS,
  type DashboardRole,
  type DashboardUser,
} from "@/lib/dashboard"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  icon: LucideIcon
  href?: string
}

const NAV_ITEMS: Record<DashboardRole, NavItem[]> = {
  "job-seeker": [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: DASHBOARD_ROUTES["job-seeker"],
    },
    { label: "Jobs", icon: Briefcase },
    {
      label: "Saved Jobs",
      icon: Bookmark,
      href: `${DASHBOARD_ROUTES["job-seeker"]}/saved-jobs`,
    },
    {
      label: "Applications",
      icon: FileText,
      href: `${DASHBOARD_ROUTES["job-seeker"]}/applications`,
    },
    {
      label: "Billing",
      icon: CreditCard,
      href: `${DASHBOARD_ROUTES["job-seeker"]}/billing`,
    },
    {
      label: "Settings",
      icon: Settings,
      href: `${DASHBOARD_ROUTES["job-seeker"]}/settings`,
    },
  ],
  recruiter: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: DASHBOARD_ROUTES.recruiter,
    },
    {
      label: "Add Job",
      icon: CirclePlus,
      href: `${DASHBOARD_ROUTES.recruiter}/add-job`,
    },
    {
      label: "Manage Jobs",
      icon: Briefcase,
      href: `${DASHBOARD_ROUTES.recruiter}/manage-jobs`,
    },
    { label: "Applications", icon: FileText },
    { label: "Settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, href: DASHBOARD_ROUTES.admin },
    { label: "Users", icon: Users, href: `${DASHBOARD_ROUTES.admin}/users` },
    { label: "Companies", icon: Building2 },
    { label: "Jobs", icon: Briefcase, href: `${DASHBOARD_ROUTES.admin}/jobs` },
    { label: "Payments", icon: CreditCard, href: `${DASHBOARD_ROUTES.admin}/payments` },
    { label: "Settings", icon: Settings },
  ],
}

export function DashboardSidebar({
  role,
  user,
  onNavigate,
}: {
  role: DashboardRole
  user: DashboardUser
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isSeeker = role === "job-seeker"
  const isSeekerSettings =
    isSeeker && pathname === `${DASHBOARD_ROUTES["job-seeker"]}/settings`
  const initial =
    user.name.trim().charAt(0).toUpperCase() ||
    user.email.charAt(0).toUpperCase() ||
    "?"

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-[#0b0b0c] pb-4",
        isSeekerSettings ? "px-2 pt-4" : "px-3 pt-5"
      )}
    >
      <Link
        href="/"
        aria-label="HireLoop home"
        className={cn(
          "inline-flex h-6 w-fit items-center",
          isSeekerSettings ? "ml-2" : "ml-2.5 h-8"
        )}
      >
        <Image
          src="/hireloop-logo.png"
          alt="HireLoop"
          width={206}
          height={66}
          priority
          className={cn("w-auto", isSeekerSettings ? "h-6" : "h-8")}
        />
      </Link>

      {isSeekerSettings && (
        <div className="mt-3 flex h-[42px] items-center gap-2 rounded-lg border border-white/[0.07] bg-[#141416] px-2">
          <span
            aria-hidden="true"
            className="grid size-[22px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8079ff] to-[#4a42d8] text-[9px] font-semibold text-white ring-1 ring-white/10"
          >
            {initial}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] leading-[18px] font-semibold text-[#f4f4f5]">
              Seeker Portal
            </span>
            <span className="block truncate text-[10px] leading-[14px] text-[#8a8a93]">
              Professional Tier
            </span>
          </span>
        </div>
      )}

      <nav
        aria-label="Dashboard"
        className={cn(
          "flex flex-col gap-0.5",
          isSeekerSettings ? "mt-3" : "mt-5"
        )}
      >
        {NAV_ITEMS[role].map((item) => {
          const Icon = item.icon
          const isRoot = item.href === DASHBOARD_ROUTES[role]
          const active = item.href
            ? isRoot
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
            : false

          const content = (
            <>
              {active && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute h-4 w-0.5 rounded-full bg-[#5c53fe]",
                    isSeekerSettings ? "top-[5px]" : "top-[9px]",
                    isSeeker ? "left-0" : "right-2"
                  )}
                />
              )}
              <Icon
                aria-hidden="true"
                className={cn(
                  "size-[18px] shrink-0",
                  isSeeker && active && "text-[#9992ff]"
                )}
                strokeWidth={1.7}
              />
              <span className="truncate">{item.label}</span>
            </>
          )

          const className = cn(
            cn(
              "relative flex h-[34px] items-center gap-2.5 rounded-md pr-3 pl-2.5 text-[13px] font-medium transition-colors"
            ),
            active
              ? "bg-[#232327] text-[#f4f4f5]"
              : "text-[#a1a4aa] hover:bg-[#1b1b1e] hover:text-[#f4f4f5]"
          )

          if (!item.href) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                title="Coming soon"
                className={cn(className, "cursor-default")}
              >
                {content}
              </span>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={className}
            >
              {content}
            </Link>
          )
        })}
      </nav>

      {isSeekerSettings ? (
        <div className="mt-auto flex flex-col gap-2">
          <Link
            href={`${DASHBOARD_ROUTES["job-seeker"]}/settings#resume`}
            onClick={onNavigate}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#fafafa] text-[13px] leading-5 font-semibold text-[#111318] transition-colors hover:bg-white"
          >
            <FileUp aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
            Post Resume
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex h-7 items-center gap-2 px-2.5 text-[12px] text-[#a1a4aa] transition-colors hover:text-white"
          >
            <LogOut aria-hidden="true" className="size-3.5" strokeWidth={1.8} />
            Logout
          </button>
        </div>
      ) : isSeeker ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="Account menu"
                className="mt-auto flex h-[60px] w-full items-center gap-3 rounded-[10px] border border-white/[0.06] bg-[#141416] px-3 text-left transition-colors hover:bg-[#19191c]"
              >
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8079ff] to-[#4a42d8] text-[13px] font-semibold text-white ring-1 ring-white/10"
                >
                  {initial}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] leading-[19px] font-semibold text-[#f4f4f5]">
                    {user.name}
                  </span>
                  <span className="block truncate text-[12px] leading-4 text-[#8a8a93]">
                    Pro Member
                  </span>
                </span>
              </button>
            }
          />

          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={8}
            className="w-[224px] rounded-xl border border-white/10 bg-[#141418] p-1.5 text-[#ededef] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.85)]"
          >
            <div className="px-2.5 py-2">
              <p className="truncate text-[13px] font-semibold text-[#f4f4f5]">
                {user.name}
              </p>
              <p className="truncate text-[12px] text-[#8f909e]">
                {user.email}
              </p>
            </div>
            <DropdownMenuSeparator className="my-1.5 bg-white/[0.07]" />
            <DropdownMenuItem
              onClick={() => {
                onNavigate?.()
                router.push(DASHBOARD_ROUTES["job-seeker"])
              }}
              className="gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#c6c6ce] outline-none focus:bg-white/[0.06] focus:text-white"
            >
              <LayoutDashboard className="size-4" strokeWidth={1.7} />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={handleSignOut}
              className="gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#f87171] outline-none focus:bg-[#ef4444]/10 focus:text-[#f87171]"
            >
              <LogOut className="size-4" strokeWidth={1.7} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="mt-auto flex h-14 items-center gap-3 rounded-[10px] border border-white/[0.06] bg-[#141416] px-3">
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8079ff] to-[#4a42d8] text-[12px] font-semibold text-white ring-1 ring-white/10"
          >
            {initial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] leading-[18px] font-semibold text-[#f4f4f5]">
              {user.name}
            </p>
            <p className="truncate text-[12px] leading-4 text-[#7c7f87]">
              {ROLE_LABELS[user.role]}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
