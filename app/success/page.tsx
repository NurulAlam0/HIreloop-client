import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, Check } from "lucide-react"

import { StatusPill } from "@/components/dashboard/primitives"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { recordPayment, type PaymentPurpose } from "@/lib/payments"
import { stripe } from "@/lib/stripe"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Payment successful — HireLoop",
  description: "Your payment went through and your plan is active.",
}

type PlanCopy = {
  plan: string
  cadence: string | null
  headline: string
  subline: string
  perks: string[]
}

const PLAN_COPY: Record<PaymentPurpose, PlanCopy> = {
  "apply-unlock": {
    plan: "Starter",
    cadence: "one-time",
    headline: "You're all set!",
    subline:
      "Your payment went through — the free-tier limits are lifted on your account.",
    perks: [
      "Apply to as many jobs as you like",
      "Post unlimited job posts as a recruiter",
      "One-time payment — nothing renews",
    ],
  },
  "growth-plan": {
    plan: "Growth",
    cadence: "renews monthly",
    headline: "Your Growth plan is active",
    subline:
      "Welcome to Growth — everything is unlocked across HireLoop, starting now.",
    perks: [
      "Apply and post without limits",
      "Daily AI match brief, salary bands & company insights",
      "Billed $35/month through Stripe",
    ],
  },
}

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)")

  const checkout = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })
  const { status, customer_details } = checkout

  if (status === "open") {
    return redirect("/")
  }

  if (status === "complete") {
    const purpose = checkout.metadata?.purpose
    const payerId = checkout.client_reference_id ?? checkout.metadata?.userId
    const paymentPurpose: PaymentPurpose | null =
      purpose === "apply-unlock" || purpose === "growth-plan"
        ? purpose
        : null

    // Credit the completed checkout to the payer (idempotent on session id).
    if (paymentPurpose && payerId) {
      await recordPayment({
        userId: payerId,
        stripeSessionId: checkout.id,
        amount: checkout.amount_total ?? 0,
        purpose: paymentPurpose,
      })
    }

    const copy = paymentPurpose ? PLAN_COPY[paymentPurpose] : null
    const amount = (checkout.amount_total ?? 0).toLocaleString("en-US", {
      style: "currency",
      currency: (checkout.currency ?? "usd").toUpperCase(),
    })
    const paidOn = checkout.created
      ? new Date(checkout.created * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null
    const email = customer_details?.email ?? null

    const primaryHref = copy?.plan === "Growth" ? "/dashboard" : "/jobs"
    const primaryLabel = copy?.plan === "Growth" ? "Go to dashboard" : "Browse jobs"
    const secondaryHref = primaryHref === "/jobs" ? "/dashboard" : "/jobs"
    const secondaryLabel =
      primaryHref === "/jobs" ? "Go to dashboard" : "Browse jobs"

    return (
      <div className="flex min-h-svh flex-col bg-[#08080a] text-[#ededef]">
        <Navbar />

        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-14 sm:px-6 sm:py-16">
          {/* ambient light behind the card */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-320px] left-1/2 h-[640px] w-[900px] -translate-x-1/2 rounded-full bg-[#22c55e]/10 blur-[150px]" />
            <div className="absolute top-[200px] left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[#5c53fe]/15 blur-[140px]" />
            <div className="starfield absolute inset-0 opacity-20" />
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#08080a] to-transparent" />
          </div>

          <section className="relative z-10 w-full max-w-[604px] rounded-[26px] border border-white/[0.06] bg-[#0c0c12]/90 p-6 shadow-[0_50px_130px_-40px_rgba(0,0,0,0.95),0_0_90px_-40px_rgba(34,197,94,0.25)] backdrop-blur-xl sm:p-9">
            {/* faint top edge highlight inside the card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <span className="relative grid size-16 place-items-center rounded-full bg-[#22c55e]/10 ring-1 ring-[#22c55e]/30">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-[#22c55e]/20 blur-xl"
                />
                <Check
                  aria-hidden="true"
                  className="relative size-8 text-[#22c55e]"
                  strokeWidth={3}
                />
              </span>

              <span className="mt-5 inline-flex h-[26px] items-center rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 text-[12px] leading-4 font-medium text-[#22c55e]">
                Payment successful
              </span>

              <h1 className="mt-4 text-[26px] leading-8 font-semibold tracking-[-0.02em] sm:text-[30px] sm:leading-9">
                {copy?.headline ?? "Payment successful"}
              </h1>
              <p className="mt-2.5 max-w-md text-[14px] leading-6 text-[#a0a0ab]">
                {copy?.subline ??
                  "Thanks for your purchase — a confirmation is on its way."}
              </p>
            </div>

            {/* Receipt summary */}
            <dl className="mt-7 divide-y divide-white/[0.06] rounded-xl border border-white/[0.07] bg-[#141418] px-5 py-1">
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-[13px] leading-5 text-[#a0a0ab]">Plan</dt>
                <dd className="flex items-center gap-2 text-[13px] leading-5 font-medium text-[#ededef]">
                  {copy?.plan ?? "HireLoop purchase"}
                  {copy?.cadence && (
                    <span className="text-[12px] font-normal text-[#6e6e78]">
                      · {copy.cadence}
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-[13px] leading-5 text-[#a0a0ab]">Amount</dt>
                <dd className="text-[13px] leading-5 font-medium text-[#ededef]">
                  {amount}
                </dd>
              </div>
              {paidOn && (
                <div className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-[13px] leading-5 text-[#a0a0ab]">Date</dt>
                  <dd className="text-[13px] leading-5 font-medium text-[#ededef]">
                    {paidOn}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-[13px] leading-5 text-[#a0a0ab]">Status</dt>
                <dd>
                  <StatusPill tone="green">Paid</StatusPill>
                </dd>
              </div>
            </dl>

            {/* What's unlocked */}
            {copy && (
              <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#141418] p-5">
                <p className="text-[11px] leading-4 font-medium tracking-[0.04em] text-[#6e6e78] uppercase">
                  What&apos;s unlocked
                </p>
                <ul className="mt-3.5 space-y-3">
                  {copy.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-[#22c55e] text-[#0b0b0c]">
                        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-[13px] leading-5 text-[#c6c6ce]">
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                nativeButton={false}
                render={<Link href={primaryHref} />}
                className="h-11 flex-1 rounded-lg bg-[#5c53fe] px-6 text-white shadow-[0_10px_30px_-10px_rgba(92,83,254,0.9)] hover:bg-[#6a62ff]"
              >
                {primaryLabel}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href={secondaryHref} />}
                className={cn(
                  "h-11 flex-1 rounded-lg border-white/15 bg-transparent px-6 hover:bg-white/[0.05]",
                  "dark:border-input",
                )}
              >
                {secondaryLabel}
              </Button>
            </div>

            {email && (
              <p className="mt-5 text-center text-[12px] leading-5 text-[#6e6e78]">
                A confirmation email will be sent to{" "}
                <span className="text-[#a0a0ab]">{email}</span>.
              </p>
            )}
          </section>
        </main>

        <Footer />
      </div>
    )
  }

  // 'expired' (or a null status) — send the visitor home instead of a blank page
  return redirect("/")
}
