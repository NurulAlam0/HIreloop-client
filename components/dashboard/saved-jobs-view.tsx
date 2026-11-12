"use client"

import { useMemo, useState } from "react"
import {
  Activity,
  AlarmClock,
  BarChart3,
  Bookmark,
  Boxes,
  ChevronDown,
  CircleDot,
  Clock,
  Cloud,
  CloudLightning,
  CreditCard,
  Feather,
  Hash,
  Hexagon,
  House,
  Infinity as InfinityIcon,
  Landmark,
  Layers,
  Leaf,
  MapPin,
  MessageSquare,
  NotebookPen,
  Palette,
  PenTool,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Triangle,
  Wallet,
  Waves,
  type LucideIcon,
} from "lucide-react"

import { CARD_CLASS } from "@/components/dashboard/primitives"
import { cn } from "@/lib/utils"

const CATEGORY_TABS = ["All Saved", "Design", "Engineering", "Product"] as const

type Category = (typeof CATEGORY_TABS)[number]
type CategoryFilter = "Design" | "Engineering" | "Product"

const SORTS = {
  recent: "Recently Saved",
  closing: "Closing Soon",
  salary: "Salary: High to Low",
  company: "Company A–Z",
} as const

type SortKey = keyof typeof SORTS

type SavedJob = {
  id: string
  title: string
  company: string
  category: CategoryFilter
  icon: LucideIcon
  location: string
  salary?: string
  savedAgo: string
  /** Lower numbers were saved more recently. */
  savedOrder: number
  closesIn?: number
  closedAgo?: string
  draft?: boolean
}

const JOBS: SavedJob[] = [
  {
    id: "techflow-product-designer",
    title: "Senior Product Designer",
    company: "TechFlow",
    category: "Design",
    icon: Hexagon,
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k - $200k + Equity",
    savedAgo: "2 hours ago",
    savedOrder: 0,
    closesIn: 3,
  },
  {
    id: "vercel-frontend",
    title: "Frontend Engineer",
    company: "Vercel",
    category: "Engineering",
    icon: Triangle,
    location: "Remote, Global",
    salary: "$140k - $180k",
    savedAgo: "yesterday",
    savedOrder: 1,
  },
  {
    id: "linear-ux-researcher",
    title: "Staff UX Researcher",
    company: "Linear",
    category: "Design",
    icon: Boxes,
    location: "New York, NY (On-site)",
    salary: "$180k - $220k",
    savedAgo: "3 days ago",
    savedOrder: 2,
    draft: true,
  },
  {
    id: "meta-full-stack",
    title: "Full Stack Developer",
    company: "Meta",
    category: "Engineering",
    icon: InfinityIcon,
    location: "Menlo Park, CA (Hybrid)",
    salary: "$150k - $210k + Bonus",
    savedAgo: "5 days ago",
    savedOrder: 3,
  },
  {
    id: "spotify-design-systems",
    title: "Design Systems Lead",
    company: "Spotify",
    category: "Design",
    icon: Leaf,
    location: "Remote, USA",
    savedAgo: "6 days ago",
    savedOrder: 4,
    closedAgo: "yesterday",
  },
  {
    id: "notion-growth-designer",
    title: "Product Designer, Growth",
    company: "Notion",
    category: "Design",
    icon: NotebookPen,
    location: "Remote, Global",
    salary: "$130k - $165k",
    savedAgo: "6 days ago",
    savedOrder: 5,
  },
  {
    id: "cloudops-backend",
    title: "Backend Engineer",
    company: "CloudOps",
    category: "Engineering",
    icon: Cloud,
    location: "Austin, TX (Hybrid)",
    salary: "$135k - $170k",
    savedAgo: "7 days ago",
    savedOrder: 6,
  },
  {
    id: "airbnb-brand-designer",
    title: "Brand Designer",
    company: "Airbnb",
    category: "Design",
    icon: House,
    location: "San Francisco, CA (Hybrid)",
    salary: "$120k - $150k",
    savedAgo: "8 days ago",
    savedOrder: 7,
    closesIn: 6,
  },
  {
    id: "fingrid-senior-engineer",
    title: "Senior Software Engineer",
    company: "FinGrid",
    category: "Engineering",
    icon: Landmark,
    location: "New York, NY (Hybrid)",
    salary: "$170k - $220k",
    savedAgo: "9 days ago",
    savedOrder: 8,
    closesIn: 5,
  },
  {
    id: "datadog-platform",
    title: "Platform Engineer",
    company: "Datadog",
    category: "Engineering",
    icon: Activity,
    location: "Remote, USA",
    salary: "$150k - $190k",
    savedAgo: "11 days ago",
    savedOrder: 9,
  },
  {
    id: "stripe-ux-writer",
    title: "UX Writer",
    company: "Stripe",
    category: "Design",
    icon: CreditCard,
    location: "Remote, USA",
    salary: "$110k - $140k",
    savedAgo: "10 days ago",
    savedOrder: 10,
  },
  {
    id: "figma-motion-designer",
    title: "Motion Designer",
    company: "Figma",
    category: "Design",
    icon: PenTool,
    location: "New York, NY (Hybrid)",
    salary: "$140k - $175k",
    savedAgo: "12 days ago",
    savedOrder: 11,
  },
  {
    id: "duolingo-ios",
    title: "Mobile Engineer (iOS)",
    company: "Duolingo",
    category: "Engineering",
    icon: Feather,
    location: "Pittsburgh, PA (Hybrid)",
    salary: "$130k - $165k",
    savedAgo: "13 days ago",
    savedOrder: 12,
  },
  {
    id: "asana-senior-pm",
    title: "Senior Product Manager",
    company: "Asana",
    category: "Product",
    icon: CircleDot,
    location: "San Francisco, CA (Hybrid)",
    salary: "$175k - $215k",
    savedAgo: "14 days ago",
    savedOrder: 13,
  },
  {
    id: "canva-visual-designer",
    title: "Visual Designer",
    company: "Canva",
    category: "Design",
    icon: Palette,
    location: "Remote, Australia",
    salary: "$95k - $125k",
    savedAgo: "15 days ago",
    savedOrder: 14,
  },
  {
    id: "digitalocean-devops",
    title: "DevOps Engineer",
    company: "DigitalOcean",
    category: "Engineering",
    icon: Waves,
    location: "Remote, Global",
    salary: "$125k - $160k",
    savedAgo: "16 days ago",
    savedOrder: 15,
    closedAgo: "3 days ago",
  },
  {
    id: "amplitude-product-analyst",
    title: "Product Analyst",
    company: "Amplitude",
    category: "Product",
    icon: BarChart3,
    location: "Remote, Global",
    salary: "$110k - $140k",
    savedAgo: "17 days ago",
    savedOrder: 16,
  },
  {
    id: "snowflake-data-engineer",
    title: "Data Engineer",
    company: "Snowflake",
    category: "Engineering",
    icon: Snowflake,
    location: "Bellevue, WA (On-site)",
    salary: "$145k - $185k",
    savedAgo: "18 days ago",
    savedOrder: 17,
  },
  {
    id: "okta-security-engineer",
    title: "Security Engineer",
    company: "Okta",
    category: "Engineering",
    icon: ShieldCheck,
    location: "Remote, USA",
    salary: "$155k - $195k",
    savedAgo: "20 days ago",
    savedOrder: 18,
  },
  {
    id: "openai-ml-engineer",
    title: "ML Engineer",
    company: "OpenAI",
    category: "Engineering",
    icon: Sparkles,
    location: "San Francisco, CA (On-site)",
    salary: "$200k - $260k",
    savedAgo: "22 days ago",
    savedOrder: 19,
  },
  {
    id: "atlassian-qa",
    title: "QA Engineer",
    company: "Atlassian",
    category: "Engineering",
    icon: Layers,
    location: "Remote, Global",
    salary: "$95k - $120k",
    savedAgo: "25 days ago",
    savedOrder: 20,
  },
  {
    id: "cloudflare-sre",
    title: "Site Reliability Engineer",
    company: "Cloudflare",
    category: "Engineering",
    icon: CloudLightning,
    location: "Austin, TX (Hybrid)",
    salary: "$140k - $180k",
    savedAgo: "28 days ago",
    savedOrder: 21,
  },
  {
    id: "slack-product-manager",
    title: "Product Manager, Core",
    company: "Slack",
    category: "Product",
    icon: Hash,
    location: "Remote, USA",
    salary: "$160k - $200k",
    savedAgo: "4 days ago",
    savedOrder: 22,
  },
  {
    id: "twilio-technical-pm",
    title: "Technical Product Manager",
    company: "Twilio",
    category: "Product",
    icon: MessageSquare,
    location: "Denver, CO (Hybrid)",
    salary: "$150k - $185k",
    savedAgo: "24 days ago",
    savedOrder: 23,
  },
]

const PAGE_SIZE = 5

function salaryRank(job: SavedJob) {
  const matches = job.salary?.match(/(\d+)k/g) ?? []
  const values = matches.map((match) => Number(match.replace("k", "")))
  return values.length ? Math.max(...values) : 0
}

function MetaPill({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-white/[0.07] bg-[#1a1a1e] px-2.5 text-[12px] leading-4 whitespace-nowrap text-[#b4b4bc]">
      <Icon
        aria-hidden="true"
        className="size-3.5 shrink-0 text-[#8a8a93]"
        strokeWidth={1.7}
      />
      {children}
    </span>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string
  value: number
  icon: LucideIcon
  tone?: "default" | "amber"
}) {
  return (
    <div
      className={cn(
        CARD_CLASS,
        "flex h-20 w-full items-center gap-4 px-5 sm:w-[200px]",
      )}
    >
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-[10px] bg-[#232327]",
          tone === "amber" && "bg-[#2a2113]",
        )}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            "size-[18px] text-white",
            tone === "amber" && "text-[#f59e0b]",
          )}
          strokeWidth={1.8}
        />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] leading-[18px] text-[#a0a0ab]">{label}</p>
        <p className="text-[24px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
          {value}
        </p>
      </div>
    </div>
  )
}

export function SavedJobsView() {
  const [filter, setFilter] = useState<Category>(CATEGORY_TABS[0])
  const [sort, setSort] = useState<SortKey>("recent")
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [removed, setRemoved] = useState<Set<string>>(() => new Set())

  const remaining = useMemo(
    () => JOBS.filter((job) => !removed.has(job.id)),
    [removed],
  )

  const counts = useMemo(() => {
    const byCategory: Record<CategoryFilter, number> = {
      Design: 0,
      Engineering: 0,
      Product: 0,
    }

    for (const job of remaining) {
      byCategory[job.category] += 1
    }

    return byCategory
  }, [remaining])

  const closingSoon = useMemo(
    () =>
      remaining.filter(
        (job) => !job.closedAgo && job.closesIn !== undefined && job.closesIn <= 7,
      ).length,
    [remaining],
  )

  const jobs = useMemo(() => {
    const list =
      filter === "All Saved"
        ? [...remaining]
        : remaining.filter((job) => job.category === filter)

    switch (sort) {
      case "closing":
        return list.sort(
          (a, b) =>
            (a.closedAgo ? Number.POSITIVE_INFINITY : (a.closesIn ?? 99)) -
            (b.closedAgo ? Number.POSITIVE_INFINITY : (b.closesIn ?? 99)),
        )
      case "salary":
        return list.sort((a, b) => salaryRank(b) - salaryRank(a))
      case "company":
        return list.sort((a, b) => a.company.localeCompare(b.company))
      default:
        return list.sort((a, b) => a.savedOrder - b.savedOrder)
    }
  }, [filter, remaining, sort])

  function removeJob(id: string) {
    setRemoved((current) => {
      const next = new Set(current)
      next.add(id)
      return next
    })
  }

  return (
    <div className="p-4 pb-16 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="text-[28px] leading-9 font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[30px] sm:leading-[38px]">
            Saved Jobs
          </h1>
          <p className="mt-5 text-[14px] leading-5 text-[#a0a0ab]">
            Manage and track your bookmarked opportunities.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <SummaryCard
            label="Total Saved"
            value={remaining.length}
            icon={Bookmark}
          />
          <SummaryCard
            label="Closing Soon"
            value={closingSoon}
            icon={AlarmClock}
            tone="amber"
          />
        </div>
      </div>

      <div
        className={cn(
          CARD_CLASS,
          "mt-10 flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5",
        )}
      >
        <div
          role="tablist"
          aria-label="Filter saved jobs by category"
          className="flex flex-wrap items-center gap-1"
        >
          {CATEGORY_TABS.map((tab) => {
            const active = filter === tab
            const count = tab === "All Saved" ? remaining.length : counts[tab]

            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFilter(tab)
                  setVisible(PAGE_SIZE)
                }}
                className={cn(
                  "h-9 rounded-lg px-3 text-[13px] leading-5 font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-[#232327] text-[#f4f4f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    : "text-[#a0a0ab] hover:bg-white/[0.04] hover:text-[#ededef]",
                )}
              >
                {tab}
                {tab !== "All Saved" && (
                  <span
                    className={cn(
                      "ml-1.5",
                      active ? "text-[#b4b4bc]" : "text-[#7c7f87]",
                    )}
                  >
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 sm:shrink-0">
          <span className="text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]">
            Sort by:
          </span>
          <div className="relative">
            <select
              aria-label="Sort saved jobs"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortKey)
                setVisible(PAGE_SIZE)
              }}
              className="h-9 w-[170px] appearance-none rounded-lg border border-white/10 bg-[#0c0c0f] pr-9 pl-3 text-[13px] leading-5 font-medium text-[#ededef] outline-none transition focus:border-[#5c53fe]/60 focus:ring-2 focus:ring-[#5c53fe]/15"
            >
              {(Object.entries(SORTS) as [SortKey, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#a0a0ab]"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {jobs.slice(0, visible).map((job) => {
          const Icon = job.icon
          const closed = Boolean(job.closedAgo)

          return (
            <article
              key={job.id}
              className={cn(
                CARD_CLASS,
                "flex flex-col gap-5 p-5 transition-colors lg:min-h-[128px] lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-6 lg:py-6",
                closed && "opacity-60",
              )}
            >
              <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                <span className="grid size-[60px] shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-[#17171b]">
                  <Icon
                    aria-hidden="true"
                    className="size-6 text-[#e7e7ea]"
                    strokeWidth={1.6}
                  />
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-[19px] leading-7 font-semibold tracking-[-0.01em] text-[#ededef] sm:text-[20px]">
                      {job.title}
                    </h2>
                    <span className="inline-flex h-[22px] items-center rounded-md bg-white/[0.06] px-2 text-[10px] leading-4 font-semibold tracking-[0.08em] text-[#9a9aa4] uppercase">
                      {job.company}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <MetaPill icon={MapPin}>{job.location}</MetaPill>
                    {job.salary && <MetaPill icon={Wallet}>{job.salary}</MetaPill>}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:shrink-0 lg:gap-4">
                <div className="flex flex-col items-start gap-1 lg:items-end">
                  {!closed && (
                    <span className="flex items-center gap-1.5 text-[13px] leading-5 text-[#a0a0ab]">
                      <Clock
                        aria-hidden="true"
                        className="size-3.5"
                        strokeWidth={1.7}
                      />
                      Saved {job.savedAgo}
                    </span>
                  )}
                  {!closed && job.closesIn !== undefined && (
                    <span className="text-[12px] leading-4 text-[#f59e0b]">
                      Closes in {job.closesIn} days
                    </span>
                  )}
                  {closed && (
                    <span className="text-[12px] leading-4 text-[#b45454]">
                      Closed {job.closedAgo}
                    </span>
                  )}
                </div>

                {closed ? (
                  <button
                    type="button"
                    onClick={() => removeJob(job.id)}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-[#ef4444]/25 bg-[#2a1416] px-4 text-[13px] leading-5 font-medium whitespace-nowrap text-[#f87171] transition-colors hover:bg-[#35181b]"
                  >
                    Remove from List
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => removeJob(job.id)}
                      aria-label={`Remove ${job.title} from saved jobs`}
                      className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#1a1a1e] text-[#ededef] transition-colors hover:bg-[#232327]"
                    >
                      <Bookmark
                        aria-hidden="true"
                        className="size-4"
                        strokeWidth={1.7}
                        fill="currentColor"
                      />
                    </button>

                    {job.draft ? (
                      <button
                        type="button"
                        title="Coming soon"
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-[#1b1b1f] px-5 text-[13px] leading-5 font-medium whitespace-nowrap text-[#d4d4d8] transition-colors hover:bg-[#232327]"
                      >
                        Draft Started
                      </button>
                    ) : (
                      <button
                        type="button"
                        title="Coming soon"
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-[#f4f4f5] px-5 text-[13px] leading-5 font-semibold whitespace-nowrap text-[#111318] transition-colors hover:bg-white active:scale-[0.99]"
                      >
                        Apply Now
                      </button>
                    )}
                  </>
                )}
              </div>
            </article>
          )
        })}

        {jobs.length === 0 && (
          <div
            className={cn(
              CARD_CLASS,
              "flex flex-col items-center justify-center gap-2 px-6 py-16 text-center",
            )}
          >
            <Bookmark
              aria-hidden="true"
              className="size-6 text-[#6e6e78]"
              strokeWidth={1.6}
            />
            <p className="text-[14px] leading-5 font-medium text-[#ededef]">
              No saved jobs here
            </p>
            <p className="text-[13px] leading-5 text-[#a0a0ab]">
              Bookmark roles from the Jobs page to see them in this list.
            </p>
          </div>
        )}
      </div>

      {jobs.length > visible && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((current) => current + PAGE_SIZE)}
            className="inline-flex h-10 items-center gap-2 rounded-lg px-4 text-[13px] leading-5 font-medium text-[#a0a0ab] transition-colors hover:bg-white/[0.04] hover:text-[#ededef]"
          >
            Load More
            <ChevronDown
              aria-hidden="true"
              className="size-4"
              strokeWidth={2}
            />
          </button>
        </div>
      )}
    </div>
  )
}
