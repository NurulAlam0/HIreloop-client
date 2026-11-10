"use client"

import { useState } from "react"
import { Check, Crown, Rocket, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/landing/hero"
import { cn } from "@/lib/utils"

type Plan = {
  name: string
  icon: React.ElementType
  monthly: number
  features: string[]
  featured?: boolean
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    icon: Rocket,
    monthly: 0,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    name: "Growth",
    icon: Sparkles,
    monthly: 17,
    featured: true,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    name: "Premium",
    icon: Crown,
    monthly: 99,
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rosters",
      "Recruiter view (read-only)",
    ],
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <Eyebrow dotClassName="bg-primary">Pricing</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-lg text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
            Pay for the leverage, not the listings
          </h2>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              aria-pressed={!yearly}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                !yearly
                  ? "bg-white text-black"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              aria-pressed={yearly}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                yearly
                  ? "bg-white text-black"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Yearly
              <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map(({ name, icon: Icon, monthly, features, featured }) => {
            const price = yearly ? Math.round(monthly * 0.8) : monthly
            return (
              <div
                key={name}
                className={cn(
                  "flex flex-col rounded-2xl border p-6",
                  featured
                    ? "border-white/25 bg-[#1b1b23] shadow-2xl shadow-black/40 md:-mt-3 md:mb-3"
                    : "border-white/10 bg-[#101017]",
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  <h3 className="text-lg font-medium">{name}</h3>
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    ${price}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>

                <p className="mt-6 text-sm font-medium text-foreground">
                  Start building your insights hub:
                </p>
                <ul className="mt-4 flex-1 space-y-3">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-foreground/70" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={featured ? "secondary" : "outline"}
                  size="lg"
                  className={cn(
                    "mt-8 w-full rounded-lg",
                    featured
                      ? "bg-white text-black hover:bg-white/90"
                      : "border-white/15 bg-transparent hover:bg-white/[0.05]",
                  )}
                >
                  Choose This Plan
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
