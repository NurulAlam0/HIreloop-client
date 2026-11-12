import {
  Check,
  Download,
  Plus,
  type LucideIcon,
} from "lucide-react"

import { CARD_CLASS } from "@/components/dashboard/primitives"
import { cn } from "@/lib/utils"

type Invoice = {
  date: string
  plan: string
  amount: string
  transaction: string
  status: "Paid" | "Refunded" | "Failed"
}

const FEATURES = [
  "Unlimited Applications",
  "Premium Job Insights",
  "Priority Candidate Badge",
  "Direct Recruiter Messaging",
]

const INVOICES: Invoice[] = [
  {
    date: "Sep 24, 2023",
    plan: "Professional Tier",
    amount: "$29.00",
    transaction: "TRX-948102-HL",
    status: "Paid",
  },
  {
    date: "Aug 24, 2023",
    plan: "Professional Tier",
    amount: "$29.00",
    transaction: "TRX-771920-HL",
    status: "Paid",
  },
  {
    date: "Jul 24, 2023",
    plan: "Professional Tier",
    amount: "$29.00",
    transaction: "TRX-331005-HL",
    status: "Paid",
  },
  {
    date: "Jun 24, 2023",
    plan: "Standard Tier",
    amount: "$12.00",
    transaction: "TRX-220199-HL",
    status: "Paid",
  },
]

const STATUS_STYLES: Record<Invoice["status"], string> = {
  Paid: "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]",
  Refunded: "border-[#60a5fa]/30 bg-[#60a5fa]/10 text-[#60a5fa]",
  Failed: "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]",
}

const DOT_STYLES: Record<Invoice["status"], string> = {
  Paid: "bg-[#22c55e]",
  Refunded: "bg-[#60a5fa]",
  Failed: "bg-[#ef4444]",
}

function FeatureItem({
  label,
  icon: Icon = Check,
}: {
  label: string
  icon?: LucideIcon
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#22c55e] text-[#0b0b0c]">
        <Icon aria-hidden="true" className="size-3.5" strokeWidth={3} />
      </span>
      <span className="text-[13px] leading-5 text-[#d4d4d8]">{label}</span>
    </li>
  )
}

function PaymentCard() {
  return (
    <div className="relative mt-6 h-[166px] overflow-hidden rounded-xl border border-white/[0.12] bg-[#16002e]">
      {/* Purple sweep + glow, matching the card artwork in the reference. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(130%_160%_at_18%_8%,#2a0a4c_0%,#1b0137_42%,#0c001f_100%)]" />
        <div className="absolute -top-20 right-0 size-56 rounded-full bg-[#b31cb4]/35 blur-3xl" />
        <div className="absolute top-6 -right-10 h-52 w-40 rotate-[-18deg] rounded-[50%] bg-[#8e0fa4]/45 blur-2xl" />
        <div className="absolute -right-16 -bottom-20 size-64 rounded-full bg-[#a20e9c]/40 blur-3xl" />
        <div className="absolute top-1/2 right-[14%] h-40 w-24 rotate-[24deg] rounded-[50%] bg-gradient-to-b from-white/25 via-[#d67ce0]/15 to-transparent blur-xl" />
        <div className="absolute -bottom-20 right-[32%] size-40 rounded-full bg-[#5b087f]/45 blur-2xl" />
      </div>

      <div className="relative flex h-full flex-col p-6 pb-9">
        <div className="flex items-start justify-between">
          <span className="relative block h-8 w-9 overflow-hidden rounded-md bg-gradient-to-br from-[#f2df96] via-[#dcc167] to-[#a98a34] shadow-[inset_0_0_0_1px_rgba(120,90,20,0.55)]">
            <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-[#8f7526]/70" />
            <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-[#8f7526]/50" />
          </span>
          <span className="text-[15px] leading-6 font-bold italic tracking-[0.02em] text-white">
            VISA
          </span>
        </div>

        <p className="mt-3 text-[16px] leading-6 font-medium tracking-[0.14em] text-white/90">
          •••• •••• •••• 4242
        </p>

        <div className="mt-auto flex items-end justify-between gap-6">
          <div>
            <p className="text-[9px] leading-4 font-medium tracking-[0.14em] text-white/50 uppercase">
              Card Holder
            </p>
            <p className="text-[11px] leading-4 font-semibold tracking-[0.06em] text-white/85 uppercase">
              Alexander Seeker
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] leading-4 font-medium tracking-[0.14em] text-white/50 uppercase">
              Expires
            </p>
            <p className="text-[11px] leading-4 font-semibold tracking-[0.06em] text-white/85">
              12/25
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BillingView() {
  return (
    <>
      <div className="p-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
        <div className="min-w-0">
          <h1 className="text-[28px] leading-9 font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[30px] sm:leading-[38px]">
            Subscription &amp; Billing
          </h1>
          <p className="mt-4 text-[14px] leading-5 text-[#a0a0ab]">
            Manage your professional tier features, recurring payments, and
            billing history.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[642fr_451fr]">
          {/* Current plan */}
          <section
            aria-label="Current plan"
            className={cn(CARD_CLASS, "flex flex-col p-6")}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="inline-flex h-[23px] items-center rounded bg-[#f4f4f5] px-3 text-[10px] leading-none font-bold tracking-[0.08em] text-[#111318] uppercase">
                  Current Plan
                </span>
                <h2 className="mt-3 text-[24px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
                  Professional Tier
                </h2>
              </div>

              <div className="sm:text-right">
                <p className="text-[32px] leading-10 font-semibold tracking-[-0.02em] text-[#ededef]">
                  $29
                  <span className="ml-1 text-[13px] leading-5 font-normal text-[#a0a0ab]">
                    /mo
                  </span>
                </p>
                <p className="mt-2 text-[13px] leading-5 text-[#a0a0ab]">
                  Next billing date: Oct 24, 2023
                </p>
              </div>
            </div>

            <p className="mt-5 text-[13px] leading-5 text-[#a0a0ab]">
              Unlock global job insights and unlimited applications.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <FeatureItem key={feature} label={feature} />
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-6">
              <button
                type="button"
                title="Coming soon"
                className="inline-flex h-9 items-center rounded-lg bg-[#f4f4f5] px-5 text-[13px] leading-5 font-semibold text-[#111318] transition-colors hover:bg-white active:scale-[0.99]"
              >
                Upgrade Plan
              </button>
              <button
                type="button"
                title="Coming soon"
                className="inline-flex h-9 items-center rounded-lg border border-white/15 px-5 text-[13px] leading-5 font-medium text-[#d4d4d8] transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                Manage Plan
              </button>
            </div>
          </section>

          {/* Payment method */}
          <section
            aria-label="Payment method"
            className={cn(CARD_CLASS, "flex flex-col p-6")}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
                Payment Method
              </h2>
              <span className="inline-flex h-5 shrink-0 items-center rounded border border-white/10 px-2 text-[9px] leading-none font-semibold tracking-[0.14em] text-[#a0a0ab] uppercase">
                Secure by Stripe
              </span>
            </div>

            <PaymentCard />

            <button
              type="button"
              title="Coming soon"
              className="mt-auto inline-flex items-center justify-center gap-2 pt-8 text-[13px] leading-5 font-medium text-[#d4d4d8] transition-colors hover:text-white"
            >
              <Plus aria-hidden="true" className="size-4" strokeWidth={2.2} />
              Add New Payment Method
            </button>
          </section>
        </div>

        {/* Billing history */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <h2 className="text-[24px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
            Billing History
          </h2>
          <button
            type="button"
            title="Coming soon"
            className="inline-flex shrink-0 items-center gap-2 text-[13px] leading-5 font-semibold text-[#d4d4d8] transition-colors hover:text-white"
          >
            <Download aria-hidden="true" className="size-4" strokeWidth={2} />
            Export PDF
          </button>
        </div>

        <div className={cn(CARD_CLASS, "mt-5 overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <colgroup>
                <col className="w-[21%]" />
                <col className="w-[26%]" />
                <col className="w-[15%]" />
                <col className="w-[27%]" />
                <col className="w-[11%]" />
              </colgroup>
              <thead>
                <tr className="h-11 border-b border-white/[0.07]">
                  <th
                    scope="col"
                    className="px-5 text-[12px] leading-4 font-medium text-[#8a8a93]"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-5 text-[12px] leading-4 font-medium text-[#8a8a93]"
                  >
                    Plan
                  </th>
                  <th
                    scope="col"
                    className="px-5 text-[12px] leading-4 font-medium text-[#8a8a93]"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-5 text-[12px] leading-4 font-medium text-[#8a8a93]"
                  >
                    Transaction ID
                  </th>
                  <th
                    scope="col"
                    className="px-5 text-right text-[12px] leading-4 font-medium text-[#8a8a93]"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((invoice) => (
                  <tr
                    key={invoice.transaction}
                    className="h-[63px] border-b border-white/[0.06] last:border-0"
                  >
                    <td className="px-5 text-[13px] leading-5 text-[#d4d4d8]">
                      {invoice.date}
                    </td>
                    <td className="px-5 text-[13px] leading-5 text-[#d4d4d8]">
                      {invoice.plan}
                    </td>
                    <td className="px-5 text-[13px] leading-5 font-medium text-[#ededef]">
                      {invoice.amount}
                    </td>
                    <td className="px-5 text-[13px] leading-5 text-[#a0a0ab]">
                      {invoice.transaction}
                    </td>
                    <td className="px-5 text-right">
                      <span
                        className={cn(
                          "inline-flex h-[22px] items-center gap-1.5 rounded-full border px-2.5 text-[12px] leading-4 font-medium whitespace-nowrap",
                          STATUS_STYLES[invoice.status],
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-1.5 rounded-full",
                            DOT_STYLES[invoice.status],
                          )}
                        />
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support */}
        <section
          aria-label="Billing support"
          className={cn(
            CARD_CLASS,
            "mt-6 flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between",
          )}
        >
          <div className="max-w-[500px]">
            <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
              Need help with your invoice?
            </h2>
            <p className="mt-2 text-[13px] leading-[22px] text-[#a0a0ab]">
              Our support team is available 24/7 to help you resolve any payment
              issues or clarify billing details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:shrink-0">
            <button
              type="button"
              title="Coming soon"
              className="inline-flex h-9 items-center rounded-lg border border-white/15 px-4 text-[13px] leading-5 font-medium text-[#d4d4d8] transition-colors hover:bg-white/[0.04] hover:text-white"
            >
              Contact Support
            </button>
            <button
              type="button"
              title="Coming soon"
              className="text-[13px] leading-5 font-medium text-[#d4d4d8] transition-colors hover:text-white"
            >
              Read Refund Policy
            </button>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/[0.07] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 text-[13px] leading-5 text-[#8a8a93] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2023 HireLoop Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              title="Coming soon"
              className="transition-colors hover:text-[#d4d4d8]"
            >
              Terms of Service
            </button>
            <button
              type="button"
              title="Coming soon"
              className="transition-colors hover:text-[#d4d4d8]"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
