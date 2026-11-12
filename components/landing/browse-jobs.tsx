import { Bookmark, Check, ChevronDown, Clock, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Job = {
  title: string
  company: string
  location: string
  salary: string
  type: string
  badge?: { label: string; variant: "apply" | "senior" | "hot" }
}

type BadgeVariant = NonNullable<Job["badge"]>["variant"]

const JOBS: Job[] = [
  {
    title: "Senior Product Designer",
    company: "TechFlow Systems",
    location: "San Francisco, CA (Remote)",
    salary: "$140k - $180k",
    type: "Full-time",
    badge: { label: "Easy Apply", variant: "apply" },
  },
  {
    title: "Lead Frontend Engineer",
    company: "FinGrid Solutions",
    location: "New York, NY",
    salary: "$165k - $210k",
    type: "Hybrid",
  },
  {
    title: "UX Researcher",
    company: "CreativeStudio",
    location: "Austin, TX",
    salary: "$110k - $145k",
    type: "Contract",
  },
  {
    title: "Machine Learning Engineer",
    company: "HealthAI Corp",
    location: "Boston, MA (Remote)",
    salary: "$180k - $250k",
    type: "Senior",
    badge: { label: "Hot Job", variant: "hot" },
  },
]

const BADGE_STYLE: Record<BadgeVariant, string> = {
  apply:
    "inline-flex items-center gap-1 rounded-[6px] border border-[#22c55e]/30 bg-[#22c55e]/10 px-2.5 py-1 text-[11px] font-medium text-[#22c55e]",
  senior:
    "inline-flex items-center gap-1 rounded-[6px] border border-white/[0.07] bg-[#141418] px-2.5 py-1 text-[11px] font-medium text-[#a0a0ab]",
  hot: "inline-flex items-center gap-1 rounded-[6px] border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2.5 py-1 text-[11px] font-medium text-[#f59e0b]",
}

function JobLogo() {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#141418]">
      <Clock className="size-4 text-[#a0a0ab]" strokeWidth={1.6} />
    </div>
  )
}

export function BrowseJobs({ standalone = false }: { standalone?: boolean }) {
  return (
    <section
      id="browse-jobs"
      className={cn(
        "relative",
        standalone ? "min-h-[calc(100svh-64px)] py-2" : "py-20 sm:py-28"
      )}
    >
      {/* Top search bar */}
      <div
        className={cn(
          "mx-auto px-4 sm:px-6",
          standalone ? "max-w-[832px] sm:px-0" : "max-w-6xl"
        )}
      >
        <div
          className={cn(
            "rounded-xl border border-white/[0.08] bg-[#131316] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)]",
            standalone && "rounded-lg p-3"
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-3 sm:flex-row sm:items-center",
              standalone ? "sm:gap-4 sm:p-0" : "p-4 sm:p-5"
            )}
          >
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2.5 px-4",
                standalone &&
                  "h-10 rounded-md border border-white/[0.07] bg-[#1a1a1f]"
              )}
            >
              <Search
                className="size-4 shrink-0 text-[#8d8d98]"
                strokeWidth={1.9}
              />
              <input
                type="text"
                placeholder="Search by job title, keywords..."
                className="text-foreground min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#6e6e78] sm:text-sm"
              />
            </div>
            <Button
              type="button"
              className={cn(
                "shrink-0 rounded-[10px] bg-[#fafafa] px-5 text-[13px] font-medium text-[#0b0b0c] hover:bg-white sm:px-6",
                standalone && "h-10 rounded-md px-5"
              )}
            >
              Search Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* Header + filters + job list */}
      <div
        className={cn(
          "mx-auto px-4 sm:px-6",
          standalone ? "mt-4 max-w-[832px] sm:px-0" : "mt-12 max-w-6xl"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between",
            standalone && "gap-5 min-[700px]:flex-row min-[700px]:items-start"
          )}
        >
          {/* Left: Filters sidebar */}
          <aside
            className={cn(
              "w-full shrink-0 lg:w-[260px]",
              standalone && "min-[700px]:w-[192px] lg:w-[192px]"
            )}
          >
            <div
              className={cn(
                "rounded-xl border border-white/[0.08] bg-[#131316] p-4 sm:p-5",
                standalone && "rounded-lg p-4"
              )}
            >
              <h3
                className={cn(
                  "mb-4 text-[14px] font-semibold tracking-wider text-[#a0a0ab] uppercase",
                  standalone && "tracking-normal text-[#ededef] normal-case"
                )}
              >
                Filters
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-[13px] font-medium text-[#ededef]">
                    Job Type
                  </p>
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3 select-none">
                      <div className="relative size-4 shrink-0 rounded-sm border border-white/10 bg-[#1a1a1f]">
                        <Check
                          className="absolute size-3 text-[#22c55e]"
                          strokeWidth={1.8}
                        />
                      </div>
                      <span className="text-[13px] text-[#c6c6ce]">
                        Full-time
                      </span>
                      <span className="ml-auto text-[12px] text-[#6e6e78]">
                        1.2k
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 select-none">
                      <div className="relative size-4 shrink-0 rounded-sm border border-white/10 bg-transparent" />
                      <span className="text-[13px] text-[#a0a0ab]">
                        Contract
                      </span>
                      <span className="ml-auto text-[12px] text-[#6e6e78]">
                        432
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 select-none">
                      <div className="relative size-4 shrink-0 rounded-sm border border-white/10 bg-transparent" />
                      <span className="text-[13px] text-[#a0a0ab]">
                        Freelance
                      </span>
                      <span className="ml-auto text-[12px] text-[#6e6e78]">
                        156
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: results header + job cards */}
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                standalone && "mb-4"
              )}
            >
              <div>
                <h2
                  className={cn(
                    "text-[20px] leading-6 font-semibold text-[#ededef]",
                    standalone && "text-[15px] leading-5"
                  )}
                >
                  Found 1,248 Professional Jobs
                </h2>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#131316] px-3 py-2",
                  standalone && "border-0 bg-transparent px-0 py-0"
                )}
              >
                <p className="text-[12px] text-[#a0a0ab]">Sort by:</p>
                <div className="flex items-center gap-1 rounded-sm border border-white/[0.08] bg-[#1a1a1f] px-2 py-1">
                  <span className="text-[12px] font-medium text-[#ededef]">
                    Most Recent
                  </span>
                  <ChevronDown
                    className="size-4 text-[#6e6e78]"
                    strokeWidth={1.6}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {JOBS.map((job, index) => (
                <article
                  key={index}
                  className={cn(
                    "rounded-xl border border-white/[0.08] bg-[#131316] p-4 transition-colors hover:border-white/15 sm:p-5",
                    standalone && "rounded-lg sm:p-4"
                  )}
                >
                  <div className="flex items-start justify-between gap-4 sm:gap-5">
                    <div className="flex items-center gap-3">
                      <JobLogo />
                      <div className="min-w-0">
                        <h3 className="text-[15px] leading-5 font-semibold text-[#ededef] sm:text-lg">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-[12px] leading-4 text-[#a0a0ab]">
                          {job.company} • {job.location}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-[6px] border border-white/[0.07] bg-[#1a1a1f] px-2.5 py-1 text-[11px] font-medium text-[#a0a0ab]">
                            <Clock className="size-3.5" strokeWidth={1.6} />
                            {job.salary}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-[6px] border border-white/[0.07] bg-[#1a1a1f] px-2.5 py-1 text-[11px] font-medium text-[#a0a0ab]">
                            {job.type}
                          </span>
                          {job.badge && (
                            <span className={BADGE_STYLE[job.badge.variant]}>
                              {job.badge.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Bookmark"
                      className="shrink-0 rounded p-1.5 text-[#a0a0ab] transition-colors hover:bg-white/[0.05] hover:text-white"
                    >
                      <Bookmark className="size-4" strokeWidth={1.6} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-1">
              <button
                type="button"
                className="rounded-sm border border-white/[0.08] bg-[#1a1a1f] px-2.5 py-1 text-[12px] text-[#a0a0ab] transition-colors hover:bg-white/[0.03]"
                disabled
              >
                <span className="sr-only">Previous</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={cn(
                    "rounded-sm px-2.5 py-1 text-[12px] transition-colors",
                    n === 1
                      ? "bg-[#5c53fe] text-white"
                      : "border border-white/[0.08] bg-[#1a1a1f] text-[#a0a0ab] hover:bg-white/[0.03]"
                  )}
                >
                  {n}
                </button>
              ))}
              <span className="px-2 text-[12px] text-[#6e6e78]">...</span>
              <button
                type="button"
                className="rounded-sm border border-white/[0.08] bg-[#1a1a1f] px-2.5 py-1 text-[12px] text-[#a0a0ab] transition-colors hover:bg-white/[0.03]"
              >
                42
              </button>
              <button
                type="button"
                className="rounded-sm border border-white/[0.08] bg-[#1a1a1f] px-2.5 py-1 text-[12px] text-[#a0a0ab] transition-colors hover:bg-white/[0.03]"
              >
                <span className="sr-only">Next</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
