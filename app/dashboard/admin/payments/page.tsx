import type { Metadata } from "next"
import {
  Bell,
  ChevronDown,
  CreditCard,
  Download,
  HelpCircle,
  Search,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { CARD_CLASS, TH_CLASS } from "@/components/dashboard/primitives"

export const metadata: Metadata = {
  title: "Payments & Subscriptions — HireLoop",
}

type Transaction = {
  email: string
  avatar: string
  plan: "Enterprise" | "Pro" | "Starter"
  amount: string
  date: string
  relative: string
  transactionId: string
  status: "Success" | "Pending" | "Failed"
}

const TRANSACTIONS: Transaction[] = [
  {
    email: "jordan.daniels@enterprise.co",
    avatar: "JD",
    plan: "Enterprise",
    amount: "$4,500.00",
    date: "May 19, 2026",
    relative: "Just now",
    transactionId: "TXN-882910443",
    status: "Success",
  },
  {
    email: "sarah.k@techflow.io",
    avatar: "SK",
    plan: "Pro",
    amount: "$299.00",
    date: "May 18, 2026",
    relative: "1 day ago",
    transactionId: "TXN-773410291",
    status: "Success",
  },
  {
    email: "marcus.lee@gmail.com",
    avatar: "ML",
    plan: "Starter",
    amount: "$49.00",
    date: "May 17, 2026",
    relative: "2 days ago",
    transactionId: "TXN-110294857",
    status: "Pending",
  },
  {
    email: "e.lopez@globalfoundries.com",
    avatar: "EL",
    plan: "Enterprise",
    amount: "$12,000.00",
    date: "May 10, 2026",
    relative: "9 days ago",
    transactionId: "TXN-809485712",
    status: "Failed",
  },
]

const PLAN_TONE: Record<Transaction["plan"], string> = {
  Enterprise: "border-white/[0.07] bg-[#222228] text-[#a0a0ab]",
  Pro: "border-[#8f88ff]/30 bg-[#8f88ff]/15 text-[#8f88ff]",
  Starter: "border-white/[0.07] bg-[#222228] text-[#a0a0ab]",
}

const STATUS_TONE: Record<Transaction["status"], string> = {
  Success: "border-[#22c55e]/30 bg-[#22c55e]/15 text-[#22c55e]",
  Pending: "border-[#f59e0b]/30 bg-[#f59e0b]/15 text-[#f59e0b]",
  Failed: "border-[#ef4444]/30 bg-[#ef4444]/15 text-[#ef4444]",
}

const METRIC_ICONS: Record<string, { icon: React.ElementType; tone: string }> = {
  "Total Revenue": { icon: CreditCard, tone: "bg-[#22c55e]/10 text-[#22c55e]" },
  "Monthly Revenue": { icon: Download, tone: "bg-[#22c55e]/10 text-[#22c55e]" },
  "Active Pro Users": { icon: Users, tone: "bg-[#f59e0b]/10 text-[#f59e0b]" },
  "Active Enterprise Users": {
    icon: CreditCard,
    tone: "bg-[#22c55e]/10 text-[#22c55e]",
  },
}

const METRICS = [
  {
    label: "Total Revenue",
    value: "$1,284,500",
    delta: "+12.4%",
  },
  {
    label: "Monthly Revenue",
    value: "$94,210",
    delta: "+8.1%",
  },
  {
    label: "Active Pro Users",
    value: "12,408",
    delta: "+2.3%",
  },
  {
    label: "Active Enterprise Users",
    value: "842",
    delta: "+15.7%",
  },
] as const

export default function AdminPaymentsPage() {
  return (
    <div className="p-4 pb-24 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      {/* Top bar: search + global actions */}
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

      {/* Heading */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
          Payments & Subscriptions
        </h1>
        <p className="text-[13px] leading-5 text-[#a0a0ab]">
          Comprehensive overview of platform revenue and active subscriptions.
        </p>
      </div>

      {/* Metric cards */}
      <section aria-label="Revenue metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
        {METRICS.map((m) => {
          const { icon: Icon, tone } = METRIC_ICONS[m.label]
          return (
            <div key={m.label} className={cn(CARD_CLASS, "p-[25px] pb-[23px]")}>
              <div className="flex items-center justify-between mb-3">
                <span className={cn("grid size-9 place-items-center rounded-[10px]", tone)}>
                  <Icon aria-hidden="true" className="size-[18px] strokeWidth={1.6}" />
                </span>
                <span
                  className="flex items-center gap-1 text-[12px] leading-[18px] font-medium text-[#22c55e]"
                >
                  <span
                    className="text-[#22c55e] size-2.5"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                  {m.delta}
                </span>
              </div>
              <p className="text-[13px] leading-5 font-medium text-[#a0a0ab]">{m.label}</p>
              <p className="mt-1 text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
                {m.value}
              </p>
            </div>
          )
        })}
      </section>

      {/* Recent Transactions */}
      <section aria-label="Recent transactions" className="mt-6">
        <div className={cn(CARD_CLASS, "overflow-hidden")}>
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-5 sm:px-6 sm:py-6">
            <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
              Recent Transactions
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#0b0b0c] px-3 py-2 text-[12px] leading-5 text-[#a0a0ab] transition-colors hover:bg-[#141418]"
              >
                <span className="size-4 text-[#6e6e78]" aria-hidden="true">
                  {/* filter icon inline */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7V1H7" />
                    <path d="M7 7V1H11" />
                    <path d="M11 7V1H15" />
                    <path d="M19 21V15H5V21" />
                    <path d="M7 15H17" />
                  </svg>
                </span>
                Filter
              </button>
              <button
                type="button"
                className="flex h-8 items-center gap-2 rounded-lg bg-[#fafafa] px-4 text-[13px] leading-5 font-medium text-[#0b0b0c] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white"
              >
                <Download className="size-3.5" strokeWidth={1.8} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[16%]" />
                <col className="w-[18%]" />
                <col className="w-[16%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#1a1a1f]">
                  <th scope="col" className={TH_CLASS}>
                    USER EMAIL
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    PLAN
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    AMOUNT
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    DATE
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    TRANSACTION ID
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((tx) => {
                  const initial = tx.avatar
                  return (
                    <tr
                      key={tx.transactionId}
                      className="h-16 border-t border-white/[0.07] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8079ff] to-[#4a42d8] text-[9px] font-semibold text-white ring-1 ring-white/[0.07]"
                            )}
                          >
                            {initial}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13px] leading-5 text-[#ededef]">
                              {tx.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4">
                        <span
                          className={cn(
                            "inline-flex h-[21px] items-center rounded-full border px-2.5 text-[12px] leading-[15px] whitespace-nowrap font-medium",
                            PLAN_TONE[tx.plan],
                          )}
                        >
                          {tx.plan}
                        </span>
                      </td>
                      <td className="px-4 text-[13px] leading-5 text-[#ededef] whitespace-nowrap">
                        {tx.amount}
                      </td>
                      <td className="px-4">
                        <div className="flex flex-col">
                          <span
                            className="font-[family-name:var(--font-dashboard-mono)] text-[12px] leading-4 whitespace-nowrap text-[#a0a0ab]"
                          >
                            {tx.date}
                          </span>
                          <span className="mt-0.5 text-[11px] leading-4 text-[#6e6e78]">
                            · {tx.relative}
                          </span>
                        </div>
                      </td>
                      <td className="px-4">
                        <span
                          className="font-[family-name:var(--font-dashboard-mono)] text-[12px] leading-4 whitespace-nowrap text-[#a0a0ab]"
                        >
                          {tx.transactionId}
                        </span>
                      </td>
                      <td className="px-4">
                        <span
                          className={cn(
                            "inline-flex h-[21px] items-center rounded-full border px-2.5 text-[12px] leading-[15px] whitespace-nowrap font-medium",
                            STATUS_TONE[tx.status],
                          )}
                        >
                          {tx.status}
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
