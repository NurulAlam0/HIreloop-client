import type { Metadata } from "next"
import Link from "next/link"
import {
  Briefcase,
  Building2,
  CalendarDays,
  Download,
  UserRound,
  Users,
  Wallet,
} from "lucide-react"

import {
  AdminMetricCard,
  CARD_CLASS,
  InitialAvatar,
  TH_CLASS,
} from "@/components/dashboard/primitives"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Admin Console",
}

type Transaction = {
  email: string
  company: string
  plan: string
  planEmphasis?: boolean
  transaction: string
  amount: string
  date: string
  status: "Success" | "Pending" | "Failed"
}

const TRANSACTIONS: Transaction[] = [
  {
    email: "marcus.k@techcorp.io",
    company: "TechCorp Inc.",
    plan: "Enterprise Monthly",
    planEmphasis: true,
    transaction: "#TXN-902341",
    amount: "$1,299.00",
    date: "Oct 24, 2023, 14:20",
    status: "Success",
  },
  {
    email: "sarah.l@creativestudio.com",
    company: "Creative Studio",
    plan: "Professional Annual",
    transaction: "#TXN-882103",
    amount: "$499.00",
    date: "Oct 24, 2023, 11:05",
    status: "Success",
  },
  {
    email: "j.doe@freelance.org",
    company: "Independent",
    plan: "Starter Monthly",
    transaction: "#TXN-774129",
    amount: "$49.00",
    date: "Oct 23, 2023, 16:45",
    status: "Pending",
  },
  {
    email: "admin@retailglobal.net",
    company: "Retail Global",
    plan: "Enterprise Monthly",
    planEmphasis: true,
    transaction: "#TXN-552014",
    amount: "$1,299.00",
    date: "Oct 23, 2023, 09:12",
    status: "Failed",
  },
]

const STATUS_TONE: Record<Transaction["status"], { dot: string; text: string }> = {
  Success: { dot: "bg-[#22c55e]", text: "text-[#22c55e]" },
  Pending: { dot: "bg-[#f59e0b]", text: "text-[#f59e0b]" },
  Failed: { dot: "bg-[#ef4444]", text: "text-[#f74c4c]" },
}

export default function AdminDashboardPage() {
  return (
    <div className="p-4 pb-24 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
            Dashboard Overview
          </h1>
          <p className="text-[13px] leading-5 text-[#a0a0ab]">
            Real-time platform performance and growth metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-[#1a1a1f] px-4 text-[13px] leading-5 font-medium text-[#ededef] transition-colors hover:bg-[#222228]"
          >
            <CalendarDays className="size-3.5" strokeWidth={1.8} />
            Last 30 Days
          </button>
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg bg-[#fafafa] px-4 text-[13px] leading-5 font-medium text-[#0b0b0c] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white"
          >
            <Download className="size-3.5" strokeWidth={1.8} />
            Export Report
          </button>
        </div>
      </div>

      <section
        aria-label="Platform metrics"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6"
      >
        <AdminMetricCard
          label="Total Users"
          value="124,892"
          delta="12%"
          icon={Users}
        />
        <AdminMetricCard
          label="Total Recruiters"
          value="12,405"
          delta="8%"
          icon={UserRound}
        />
        <AdminMetricCard
          label="Total Companies"
          value="4,281"
          delta="0%"
          trend="flat"
          icon={Building2}
        />
        <AdminMetricCard
          label="Jobs Posted"
          value="8,920"
          delta="24%"
          icon={Briefcase}
        />
        <AdminMetricCard
          label="Platform Revenue"
          value="$245,800"
          delta="18.5%"
          icon={Wallet}
        />
      </section>

      <section aria-label="Recent subscription transactions" className="mt-6">
        <div className={cn(CARD_CLASS, "overflow-hidden")}>
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-5 sm:px-6 sm:py-6">
            <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
              Recent Subscription Transactions
            </h2>
            <Link
              href="/dashboard/admin"
              className="shrink-0 text-[13px] leading-5 font-medium text-[#ededef] transition-colors hover:text-white"
            >
              View All Activity
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <colgroup>
                <col className="w-[26%]" />
                <col className="w-[18%]" />
                <col className="w-[15.5%]" />
                <col className="w-[12.5%]" />
                <col className="w-[16.5%]" />
                <col className="w-[11.5%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#1a1a1f]">
                  <th scope="col" className={TH_CLASS}>
                    USER/RECRUITER
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    PLAN TYPE
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    TRANSACTION ID
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    AMOUNT
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    DATE
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((row) => {
                  const tone = STATUS_TONE[row.status]
                  return (
                    <tr
                      key={row.transaction}
                      className="h-16 border-t border-white/[0.07] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4">
                        <div className="flex items-center gap-3">
                          <InitialAvatar name={row.email} />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] leading-5 font-medium text-[#ededef]">
                              {row.email}
                            </p>
                            <p className="truncate text-[12px] leading-[15px] text-[#a0a0ab]">
                              {row.company}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4">
                        <span
                          className={cn(
                            "inline-flex h-[21px] items-center rounded-full border px-2.5 text-[12px] leading-[15px] whitespace-nowrap",
                            row.planEmphasis
                              ? "border-white/10 bg-white/10 text-[#ededef]"
                              : "border-white/[0.07] bg-[#222228] text-[#a0a0ab]",
                          )}
                        >
                          {row.plan}
                        </span>
                      </td>
                      <td className="px-4 font-[family-name:var(--font-dashboard-mono)] text-[12px] leading-4 whitespace-nowrap text-[#a0a0ab]">
                        {row.transaction}
                      </td>
                      <td className="px-4 text-[13px] leading-5 whitespace-nowrap text-[#ededef]">
                        {row.amount}
                      </td>
                      <td className="px-4 text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]">
                        {row.date}
                      </td>
                      <td className="px-4">
                        <span className="flex items-center gap-2 text-[12px] leading-[15px]">
                          <span
                            aria-hidden="true"
                            className={cn("size-1.5 rounded-full", tone.dot)}
                          />
                          <span className={tone.text}>{row.status}</span>
                        </span>
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
