import type { Metadata } from "next"
import {
  Bell,
  ChevronDown,
  Download,
  HelpCircle,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { CARD_CLASS, InitialAvatar, TH_CLASS } from "@/components/dashboard/primitives"

export const metadata: Metadata = {
  title: "User Management — HireLoop",
}

type UserRow = {
  name: string
  email: string
  role: "Seeker" | "Recruiter"
  joined: string
  status: "Active" | "Suspended"
}

const USERS: UserRow[] = [
  {
    name: "Jordan Davis",
    email: "jordan.davis@example.com",
    role: "Seeker",
    joined: "Oct 12, 2023",
    status: "Active",
  },
  {
    name: "Elena Rodriguez",
    email: "elena.r@talentflow.io",
    role: "Recruiter",
    joined: "Sep 28, 2023",
    status: "Active",
  },
  {
    name: "Marcus Webb",
    email: "m.webb@outlook.com",
    role: "Seeker",
    joined: "Aug 05, 2023",
    status: "Suspended",
  },
  {
    name: "Tom Hiddleston",
    email: "t.hiddleston@loki-tech.com",
    role: "Recruiter",
    joined: "Nov 01, 2023",
    status: "Active",
  },
]

const ROLE_TONE: Record<UserRow["role"], string> = {
  Seeker: "border-white/[0.07] bg-[#222228] text-[#a0a0ab]",
  Recruiter: "border-[#8f88ff]/30 bg-[#8f88ff]/15 text-[#8f88ff]",
}

const STATUS_TONE: Record<UserRow["status"], string> = {
  Active: "border-[#22c55e]/30 bg-[#22c55e]/15 text-[#22c55e]",
  Suspended: "border-[#ef4444]/30 bg-[#ef4444]/15 text-[#ef4444]",
}

export default function AdminUsersPage() {
  return (
    <div className="p-4 pb-24 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      {/* Top bar: search + global actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="w-full sm:w-[420px] rounded-lg border border-white/10 bg-[#0b0b0c]">
          <div className="flex items-center gap-2 px-4 py-2.5">
            <Search aria-hidden="true" className="size-4 text-[#a0a0ab]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search by email..."
              className="flex-1 bg-transparent text-xs text-[#ededef] placeholder:text-[#6e6e78] outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="rounded-lg p-2 text-[#a0a0ab] transition-colors hover:text-white hover:bg-white/[0.05]"
          >
            <Bell aria-hidden="true" className="size-5" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label="Help"
            className="rounded-lg p-2 text-[#a0a0ab] transition-colors hover:text-white hover:bg-white/[0.05]"
          >
            <HelpCircle aria-hidden="true" className="size-5" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label="Manage Roles"
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#0b0b0c] px-3 py-2 text-[13px] leading-5 text-[#ededef] transition-colors hover:bg-[#141418]"
          >
            Manage Roles
            <ChevronDown aria-hidden="true" className="size-4 text-[#a0a0ab]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Heading + filter/export */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
            User Management
          </h1>
          <p className="text-[13px] leading-5 text-[#a0a0ab]">
            Review, filter, and manage platform access for all users.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-col sm:flex-row">
          <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#0b0b0c] px-3 py-2 text-[13px] leading-5 text-[#ededef] transition-colors hover:bg-[#141418]">
            All Roles
            <ChevronDown aria-hidden="true" className="size-4 text-[#a0a0ab]" strokeWidth={1.5} />
          </div>
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg bg-[#fafafa] px-4 text-[13px] leading-5 font-medium text-[#0b0b0c] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white"
          >
            <Download className="size-3.5" strokeWidth={1.8} />
            Export List
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <section aria-label="User metrics" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
        <div className={cn(CARD_CLASS, "p-[25px] pb-[23px]")}>
          <p className="text-[13px] leading-5 text-[#a0a0ab]">Total Active Users</p>
          <p className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
            12,842
          </p>
          <p className="mt-1 text-[12px] leading-4 text-[#22c55e]">+12% vs last month</p>
        </div>
        <div className={cn(CARD_CLASS, "p-[25px] pb-[23px]")}>
          <p className="text-[13px] leading-5 text-[#a0a0ab]">Recruiter Growth</p>
          <p className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
            843
          </p>
          <p className="mt-1 text-[12px] leading-4 text-[#22c55e]">High demand</p>
        </div>
        <div className={cn(CARD_CLASS, "p-[25px] pb-[23px]")}>
          <p className="text-[13px] leading-5 text-[#a0a0ab]">Suspended Accounts</p>
          <p className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
            124
          </p>
          <p className="mt-1 text-[12px] leading-4 text-[#a0a0ab]">0.8% of total</p>
        </div>
        <div className={cn(CARD_CLASS, "p-[25px] pb-[23px]")}>
          <p className="text-[13px] leading-5 text-[#a0a0ab]">New Signups (24h)</p>
          <p className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
            42
          </p>
          <p className="mt-1 text-[12px] leading-4 text-[#f59e0b]">Steady activity</p>
        </div>
      </section>

      {/* Users table */}
      <section aria-label="User list" className="mt-6">
        <div className={cn(CARD_CLASS, "overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <colgroup>
                <col className="w-[20%]" />
                <col className="w-[26%]" />
                <col className="w-[14%]" />
                <col className="w-[15%]" />
                <col className="w-[12%]" />
                <col className="w-[13%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#1a1a1f]">
                  <th scope="col" className={TH_CLASS}>
                    USER NAME
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    EMAIL ADDRESS
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    ROLE
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    JOIN DATE
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    STATUS
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {USERS.map((user) => {
                  const isSuspended = user.status === "Suspended"
                  return (
                    <tr
                      key={user.email}
                      className="h-16 border-t border-white/[0.07] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4">
                        <div className="flex items-center gap-3">
                          <InitialAvatar name={user.name} />
                          <p className="text-[13px] leading-5 font-medium text-[#ededef]">
                            {user.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 text-[13px] leading-5 text-[#a0a0ab]">
                        {user.email}
                      </td>
                      <td className="px-4">
                        <span
                          className={cn(
                            "inline-flex h-[21px] items-center rounded-full border px-2.5 text-[12px] leading-[15px] whitespace-nowrap font-medium",
                            ROLE_TONE[user.role],
                          )}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4">
                        <span
                          className="font-[family-name:var(--font-dashboard-mono)] text-[12px] leading-4 whitespace-nowrap text-[#a0a0ab]"
                        >
                          {user.joined}
                        </span>
                      </td>
                      <td className="px-4">
                        <span
                          className={cn(
                            "inline-flex h-[21px] items-center rounded-full border px-2.5 text-[12px] leading-[15px] whitespace-nowrap font-medium",
                            STATUS_TONE[user.status],
                          )}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4">
                        {isSuspended ? (
                          <>
                            <a
                              href="#"
                              className="text-[12px] leading-4 text-[#22c55e] hover:text-[#4ade80]"
                            >
                              Activate
                            </a>
                            <a
                              href="#"
                              className="ml-2 text-[12px] leading-4 text-[#a0a0ab] hover:text-white"
                            >
                              Delete
                            </a>
                          </>
                        ) : (
                          <>
                            <a
                              href="#"
                              className="text-[12px] leading-4 text-[#a0a0ab] hover:text-white"
                            >
                              {user.role === "Seeker" ? "Make Recruiter" : "Make Seeker"}
                            </a>
                            <a
                              href="#"
                              className="ml-2 text-[12px] leading-4 text-[#ef4444] hover:text-[#f74c4c]"
                            >
                              Suspend
                            </a>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
