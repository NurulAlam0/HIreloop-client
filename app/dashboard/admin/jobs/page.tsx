import type { Metadata } from "next"
import {
  Bell,
  ChevronDown,
  HelpCircle,
  Plus,
  Search,
  Trash2,
  Eye,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { CARD_CLASS, InitialAvatar, TH_CLASS } from "@/components/dashboard/primitives"

export const metadata: Metadata = {
  title: "Manage Jobs — HireLoop",
}

type JobRow = {
  title: string
  ref: string
  company: string
  companyInitial: string
  category: string
  type: string
  posted: string
  status: "Active" | "Closed"
}

const JOBS: JobRow[] = [
  {
    title: "Senior Product Designer",
    ref: "HL-90210",
    company: "Nexus Lab",
    companyInitial: "N",
    category: "Design",
    type: "Full-time",
    posted: "Oct 24, 2023",
    status: "Active",
  },
  {
    title: "Full-stack Engineer",
    ref: "HL-88231",
    company: "Quantum",
    companyInitial: "Q",
    category: "Engineering",
    type: "Contract",
    posted: "Oct 22, 2023",
    status: "Active",
  },
  {
    title: "Marketing Director",
    ref: "HL-11022",
    company: "Vanguard",
    companyInitial: "V",
    category: "Marketing",
    type: "Full-time",
    posted: "Oct 15, 2023",
    status: "Closed",
  },
  {
    title: "Backend Architect",
    ref: "HL-99032",
    company: "CloudScale",
    companyInitial: "C",
    category: "Engineering",
    type: "Remote",
    posted: "Oct 20, 2023",
    status: "Active",
  },
  {
    title: "UX Research Lead",
    ref: "HL-44112",
    company: "Humanize",
    companyInitial: "H",
    category: "Design",
    type: "Hybrid",
    posted: "Oct 19, 2023",
    status: "Active",
  },
]

const STATUS_TONE: Record<JobRow["status"], string> = {
  Active: "border-[#22c55e]/30 bg-[#22c55e]/15 text-[#22c55e]",
  Closed: "border-white/[0.07] bg-[#222228] text-[#a0a0ab]",
}

export default function ManageJobsPage() {
  return (
    <div className="p-4 pb-24 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      {/* Top bar: search + admin view */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="w-full sm:w-[420px] rounded-lg border border-white/10 bg-[#0b0b0c]">
          <div className="flex items-center gap-2 px-4 py-2.5">
            <Search aria-hidden="true" className="size-4 text-[#a0a0ab]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search transactions, users, or IDs..."
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
            aria-label="Admin View"
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#0b0b0c] px-3 py-2 text-[13px] leading-5 text-[#ededef] transition-colors hover:bg-[#141418]"
          >
            Admin View
            <ChevronDown aria-hidden="true" className="size-4 text-[#a0a0ab]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Heading + Create Job */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
            Manage Jobs
          </h1>
          <p className="text-[13px] leading-5 text-[#a0a0ab]">
            Oversee all active listings and historical job posts across the platform.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#fafafa] px-4 py-2 text-[13px] leading-5 font-medium text-[#0b0b0c] transition-colors hover:bg-white"
        >
          <Plus aria-hidden="true" className="size-4" strokeWidth={1.8} />
          Create Job
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4 mb-4">
        <div className="rounded-lg border border-white/10 bg-[#0b0b0c]">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-[12px] leading-4 font-medium text-[#a0a0ab]">Status</p>
            <ChevronDown className="size-4 text-[#6e6e78]" strokeWidth={1.5} />
          </div>
          <div className="px-4 py-2">
            <p className="text-[13px] leading-5 text-[#ededef]">All Statuses</p>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-[#0b0b0c]">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-[12px] leading-4 font-medium text-[#a0a0ab]">Category</p>
            <ChevronDown className="size-4 text-[#6e6e78]" strokeWidth={1.5} />
          </div>
          <div className="px-4 py-2">
            <p className="text-[13px] leading-5 text-[#ededef]">All Categories</p>
          </div>
        </div>
        <div className="lg:col-span-2 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-lg border border-white/[0.07] bg-[#141418] px-3 py-2 text-left text-[13px] leading-5 text-[#ededef] transition-colors hover:bg-white/[0.03]"
          >
            Active (128)
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg border border-white/[0.07] bg-[#141418] px-3 py-2 text-left text-[13px] leading-5 text-[#ededef] transition-colors hover:bg-white/[0.03]"
          >
            Closed (45)
          </button>
        </div>
      </div>

      {/* Jobs table */}
      <div className={cn(CARD_CLASS, "overflow-hidden")}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[20%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[14%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead>
              <tr className="bg-[#1a1a1f]">
                <th scope="col" className={TH_CLASS}>
                  TITLE
                </th>
                <th scope="col" className={TH_CLASS}>
                  COMPANY
                </th>
                <th scope="col" className={TH_CLASS}>
                  CATEGORY
                </th>
                <th scope="col" className={TH_CLASS}>
                  TYPE
                </th>
                <th scope="col" className={TH_CLASS}>
                  DATE POSTED
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
              {JOBS.map((job) => {
                return (
                  <tr
                    key={job.ref}
                    className="h-16 border-t border-white/[0.07] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <InitialAvatar name={job.company} className="size-8" />
                        <div className="min-w-0">
                          <p className="text-[13px] leading-5 font-medium text-[#ededef]">
                            {job.title}
                          </p>
                          <p className="text-[11px] leading-[14px] text-[#a0a0ab]">
                            Ref: {job.ref}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <InitialAvatar name={job.company} className="size-7" />
                        <p className="text-[13px] leading-5 text-[#a0a0ab]">{job.company}</p>
                      </div>
                    </td>
                    <td className="px-4">
                      <span
                        className="inline-flex h-[21px] items-center rounded-full border px-2.5 text-[12px] leading-[15px] whitespace-nowrap font-medium border-white/[0.07] bg-[#222228] text-[#a0a0ab]"
                      >
                        {job.category}
                      </span>
                    </td>
                    <td className="px-4 text-[13px] leading-5 text-[#a0a0ab]">{job.type}</td>
                    <td className="px-4 text-[13px] leading-5 text-[#a0a0ab]">{job.posted}</td>
                    <td className="px-4">
                      <span
                        className={cn(
                          "inline-flex h-[21px] items-center rounded-full border px-2.5 text-[12px] leading-[15px] whitespace-nowrap font-medium",
                          STATUS_TONE[job.status],
                        )}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`View ${job.title}`}
                          className="rounded p-1.5 text-[#a0a0ab] transition-colors hover:text-white hover:bg-white/[0.05]"
                        >
                          <Eye aria-hidden="true" className="size-3.5" strokeWidth={1.6} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${job.title}`}
                          className="rounded p-1.5 text-[#a0a0ab] transition-colors hover:text-[#f74c4c] hover:bg-white/[0.05]"
                        >
                          <Trash2 aria-hidden="true" className="size-3.5" strokeWidth={1.6} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom stat cards */}
      <section aria-label="Job metrics" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
        <div className={cn(CARD_CLASS, "p-[25px] pb-[23px]")}>
          <div className="flex items-center gap-2">
            <span
              className="text-[#22c55e] text-[11px] leading-4 font-medium"
              aria-hidden="true"
            >
              ↗
            </span>
            <p className="text-[12px] leading-4 text-[#a0a0ab]">Engagement Rate</p>
          </div>
          <p className="mt-1 text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
            82.4%
          </p>
          <p className="mt-1 text-[11px] leading-4 text-[#22c55e]">+5.2% from last month</p>
        </div>
        <div className={cn(CARD_CLASS, "p-[25px] pb-[23px]")}>
          <div className="flex items-center gap-2">
            <span className="text-[#a0a0ab] text-[11px] leading-4 font-medium" aria-hidden="true">
              ⏱
            </span>
            <p className="text-[12px] leading-4 text-[#a0a0ab]">Avg. Time to Fill</p>
          </div>
          <p className="mt-1 text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
            14 Days
          </p>
          <p className="mt-1 text-[11px] leading-4 text-[#a0a0ab]">Stable performance</p>
        </div>
        <div className={cn(CARD_CLASS, "p-[25px] pb-[23px]")}>
          <div className="flex items-center gap-2">
            <span className="text-[#a0a0ab] text-[11px] leading-4 font-medium" aria-hidden="true">
              ✉
            </span>
            <p className="text-[12px] leading-4 text-[#a0a0ab]">Total Applications</p>
          </div>
          <p className="mt-1 text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
            12,840
          </p>
          <p className="mt-1 text-[11px] leading-4 text-[#f59e0b]">-2.1% across tech sectors</p>
        </div>
      </section>
    </div>
  )
}
