"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Check, Rocket, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/landing/hero"
import { cn } from "@/lib/utils"

type Plan = {
  name: string
  icon: React.ElementType
  amount: number
  label?: string
  checkoutPlan: "starter" | "growth"
  features: string[]
  featured?: boolean
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    icon: Rocket,
    amount: 20,
    checkoutPlan: "starter",
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
    amount: 35,
    label: "/month",
    checkoutPlan: "growth",
    featured: true,
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
]

export function Pricing({ signedIn }: { signedIn: boolean }) {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)

  return (
    <section id="pricing" className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute top-16 left-1/2 h-[360px] w-[640px] -translate-x-1/2 rounded-full blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <Eyebrow dotClassName="bg-primary">Pricing</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-lg text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
            Pay for the leverage, not the listings
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
          {PLANS.map(
            ({
              name,
              icon: Icon,
              amount,
              label,
              checkoutPlan,
              features,
              featured,
            }) => {
              return (
                <div
                  key={name}
                  className={cn(
                    "flex flex-col rounded-2xl border p-6",
                    featured
                      ? "border-white/25 bg-[#1b1b23] shadow-2xl shadow-black/40 md:-mt-3 md:mb-3"
                      : "border-white/10 bg-[#101017]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className="text-muted-foreground size-4"
                      strokeWidth={1.75}
                    />
                    <h3 className="text-lg font-medium">{name}</h3>
                  </div>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">
                      ${amount}
                    </span>
                    {label ? (
                      <span className="text-muted-foreground text-sm">
                        {label}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-foreground mt-6 text-sm font-medium">
                    Start building your insights hub:
                  </p>
                  <ul className="mt-4 flex-1 space-y-3">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="text-muted-foreground flex items-start gap-2.5 text-sm"
                      >
                        <Check className="text-foreground/70 mt-0.5 size-4 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <form
                    action="/api/checkout_sessions"
                    method="POST"
                    className="mt-8"
                    onSubmit={(event) => {
                      // Signed-out visitors bounce through sign-in, then come back here.
                      if (!signedIn) {
                        event.preventDefault()
                        router.push("/sign-in?next=%2F%23pricing")
                        return
                      }
                      // The form navigates away to Stripe — block double submits.
                      if (pending) {
                        event.preventDefault()
                        return
                      }
                      setPending(checkoutPlan)
                    }}
                  >
                    <input type="hidden" name="plan" defaultValue={checkoutPlan} />
                    <Button
                      type="submit"
                      variant={featured ? "secondary" : "outline"}
                      size="lg"
                      className={cn(
                        "w-full rounded-lg",
                        featured
                          ? "bg-white text-black hover:bg-white/90"
                          : "border-white/15 bg-transparent hover:bg-white/[0.05]"
                      )}
                    >
                      {pending === checkoutPlan ? "Redirecting…" : "Add to Cart"}
                    </Button>
                  </form>
                </div>
              )
            }
          )}
        </div>
      </div>
    </section>
  )
}
