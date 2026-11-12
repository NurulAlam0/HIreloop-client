import Link from "next/link"
import { ArrowDownRight, ArrowUpRight, Minus, Plus, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export const CARD_CLASS =
  "rounded-xl border border-white/[0.07] bg-[#141418] shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.035)]"

export const TH_CLASS =
  "h-11 px-4 text-left text-[11px] leading-[14px] font-medium tracking-[0.04em] whitespace-nowrap text-[#6e6e78]"

/* -------------------------------------------------------------------------- */
/*                                   Headings                                 */
/* -------------------------------------------------------------------------- */

export function SectionHeading({
  title,
  action,
}: {
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
        {title}
      </h2>
      {action}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Stats                                   */
/* -------------------------------------------------------------------------- */

/** Compact stat card used on the job seeker dashboard (262×128 in Figma). */
export function StatTile({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string
  value: string
  icon: LucideIcon
  iconClassName?: string
}) {
  return (
    <div
      className={cn(
        CARD_CLASS,
        "flex min-h-[128px] flex-col justify-between gap-5 p-[21px]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] leading-5 text-[#a0a0ab]">{label}</p>
        <Icon
          aria-hidden="true"
          className={cn("mt-px size-[18px] shrink-0 text-white", iconClassName)}
          strokeWidth={1.7}
        />
      </div>
      <p className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
        {value}
      </p>
    </div>
  )
}

/** Icon-first stat card used on the recruiter dashboard (262×166 in Figma). */
export function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className={cn(CARD_CLASS, "flex min-h-[166px] flex-col p-[25px] pb-[23px]")}>
      <span className="grid size-10 place-items-center rounded-[10px] bg-[#222228]">
        <Icon
          aria-hidden="true"
          className="size-[18px] text-[#e5e2e3]"
          strokeWidth={1.6}
        />
      </span>
      <p className="mt-5 text-[13px] leading-5 text-[#a0a0ab]">{label}</p>
      <p className="mt-1 text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
        {value}
      </p>
    </div>
  )
}

/** Metric card with a period delta, used on the admin console (204×150). */
export function AdminMetricCard({
  label,
  value,
  delta,
  trend = "up",
  icon: Icon,
}: {
  label: string
  value: string
  delta: string
  trend?: "up" | "down" | "flat"
  icon: LucideIcon
}) {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus

  return (
    <div className={cn(CARD_CLASS, "flex min-h-[150px] flex-col p-[25px] pb-[23px]")}>
      <div className="flex items-center justify-between gap-2">
        <span className="grid size-9 place-items-center rounded-[10px] bg-[#e2e2e2]/10">
          <Icon
            aria-hidden="true"
            className="size-[18px] text-white"
            strokeWidth={1.6}
          />
        </span>
        <span
          className={cn(
            "flex items-center gap-1 text-[12px] leading-[18px] font-medium",
            trend === "up"
              ? "text-[#22c55e]"
              : trend === "down"
                ? "text-[#ef4444]"
                : "text-[#a0a0ab]",
          )}
        >
          <TrendIcon aria-hidden="true" className="size-2.5" strokeWidth={2.4} />
          {delta}
        </span>
      </div>
      <p className="mt-3 text-[13px] leading-5 font-medium text-[#a0a0ab]">
        {label}
      </p>
      <p className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
        {value}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Badges                                   */
/* -------------------------------------------------------------------------- */

const PILL_TONES = {
  violet: "border-[#8f88ff]/30 bg-[#8f88ff]/15 text-[#8f88ff]",
  blue: "border-[#60a5fa]/30 bg-[#60a5fa]/15 text-[#60a5fa]",
  amber: "border-[#f59e0b]/30 bg-[#f59e0b]/15 text-[#f59e0b]",
  green: "border-[#22c55e]/30 bg-[#22c55e]/15 text-[#22c55e]",
  red: "border-[#ef4444]/30 bg-[#ef4444]/15 text-[#ef4444]",
} as const

export type PillTone = keyof typeof PILL_TONES

export function StatusPill({
  tone,
  children,
}: {
  tone: PillTone
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-full border px-2.5 text-[12px] leading-4 font-medium whitespace-nowrap",
        PILL_TONES[tone],
      )}
    >
      {children}
    </span>
  )
}

const AVATAR_TONES = [
  "from-[#8079ff] to-[#4a42d8]",
  "from-[#5eead4] to-[#0f766e]",
  "from-[#fbbf24] to-[#b45309]",
  "from-[#f472b6] to-[#be185d]",
  "from-[#60a5fa] to-[#1d4ed8]",
]

export function InitialAvatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?"
  const tone = AVATAR_TONES[(initial.charCodeAt(0) || 0) % AVATAR_TONES.length]

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white ring-1 ring-white/[0.07]",
        tone,
        className,
      )}
    >
      {initial}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Floating action                             */
/* -------------------------------------------------------------------------- */

export function FloatingActionButton({
  label,
  tooltip,
  size = "md",
  href,
}: {
  label: string
  tooltip?: string
  size?: "md" | "lg"
  href?: string
}) {
  const actionClassName = cn(
    "grid place-items-center rounded-full bg-[#fafafa] text-[#111318] shadow-[0_18px_44px_-12px_rgba(0,0,0,0.9)] transition hover:bg-white active:scale-95",
    size === "lg" ? "size-16" : "size-14",
  )

  const icon = (
    <Plus
      className={size === "lg" ? "size-[18px]" : "size-4"}
      strokeWidth={2.2}
    />
  )

  return (
    <div className="group fixed right-5 bottom-5 z-30 lg:right-8 lg:bottom-8">
      {href ? (
        <Link href={href} aria-label={label} className={actionClassName}>
          {icon}
        </Link>
      ) : (
        <button type="button" aria-label={label} className={actionClassName}>
          {icon}
        </button>
      )}
      {tooltip && (
        <span className="pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-lg bg-[#fafafa] px-3 py-2 text-[13px] leading-5 font-medium whitespace-nowrap text-[#0b0b0c] opacity-0 shadow-lg transition group-hover:opacity-100">
          {tooltip}
        </span>
      )}
    </div>
  )
}
