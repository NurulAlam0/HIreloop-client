import type { Metadata } from "next"
import Link from "next/link"
import {
  BellRing,
  Bookmark,
  CalendarCheck,
  Mail,
  RotateCw,
  Send,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import {
  CARD_CLASS,
  FloatingActionButton,
  SectionHeading,
  StatTile,
} from "@/components/dashboard/primitives"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Job Seeker Dashboard",
}

type ActivityItem = {
  prefix: string
  highlight?: string
  suffix?: string
  time: string
  icon: LucideIcon
  iconClassName: string
}

const ACTIVITY: ActivityItem[] = [
  {
    prefix:
      "Application for Senior Product Designer at TechFlow updated to ",
    highlight: "'Under Review'",
    time: "2 hours ago",
    icon: RotateCw,
    iconClassName: "text-[#a78bfa]",
  },
  {
    prefix:
      "New Job Alert: Lead Frontend Engineer at FinGrid matches your profile.",
    time: "5 hours ago",
    icon: BellRing,
    iconClassName: "text-[#22c55e]",
  },
  {
    prefix:
      "You have a new message from Sarah Jenkins (Hiring Manager at CloudOps).",
    time: "1 day ago",
    icon: Mail,
    iconClassName: "text-white",
  },
]

/** The reference design repeats the three alert types to fill the list. */
const ACTIVITY_ROWS = [...ACTIVITY, ...ACTIVITY]

export default function SeekerDashboardPage() {
  return (
    <div className="p-4 pb-24 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      <section
        aria-label="Your job search at a glance"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6"
      >
        <StatTile label="Saved Jobs" value="12" icon={Bookmark} />
        <StatTile label="Applications Submitted" value="24" icon={Send} />
        <StatTile
          label="Interviews Scheduled"
          value="3"
          icon={CalendarCheck}
          iconClassName="text-[#f59e0b]"
        />
        <StatTile
          label="Offers Received"
          value="1"
          icon={Trophy}
          iconClassName="text-[#22c55e]"
        />
      </section>

      <section aria-label="Recent Activity" className="mt-6">
        <SectionHeading
          title="Recent Activity"
          action={
            <Link
              href="/dashboard/seeker"
              className="text-[13px] leading-5 text-[#a0a0ab] transition-colors hover:text-white"
            >
              View All Activity
            </Link>
          }
        />

        <div className={cn(CARD_CLASS, "mt-6 overflow-hidden")}>
          {ACTIVITY_ROWS.map((item, index) => {
            const Icon = item.icon

            return (
              <article
                key={`${item.prefix}-${index}`}
                className={cn(
                  "flex h-[66px] items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6",
                  index > 0 && "border-t border-white/[0.07]",
                )}
              >
                <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#222228]">
                    <Icon
                      aria-hidden="true"
                      className={cn("size-4", item.iconClassName)}
                      strokeWidth={1.8}
                    />
                  </span>

                  <p className="min-w-0 truncate text-[13px] leading-5 text-[#ededef]">
                    {item.prefix}
                    {item.highlight && (
                      <span className="text-[#f59e0b]">{item.highlight}</span>
                    )}
                    {item.suffix}
                  </p>
                </div>

                <span className="hidden shrink-0 text-[13px] leading-5 text-[#a0a0ab] sm:block">
                  {item.time}
                </span>
              </article>
            )
          })}
        </div>
      </section>

      <FloatingActionButton label="Upload resume" />
    </div>
  )
}
