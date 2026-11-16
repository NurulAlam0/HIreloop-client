"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Bookmark, Check, ChevronDown, Clock, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  formatCompensation,
  JOB_CATEGORIES,
  JOB_FREQUENCIES,
  JOB_TYPES,
  type JobDTO,
} from "@/lib/job-types"
import { cn } from "@/lib/utils"

type BrowseJob = Pick<
  JobDTO,
  | "id"
  | "title"
  | "company"
  | "location"
  | "isRemote"
  | "minSalary"
  | "maxSalary"
  | "frequency"
  | "type"
  | "category"
>

type JobFilters = {
  type: string
  category: string
  /** "all" | "true" | "false" */
  remote: string
  salaryMin: number
  salaryMax: number
  location: string
  search: string
}

const DEFAULT_FILTERS: JobFilters = {
  type: "",
  category: "",
  remote: "all",
  salaryMin: 0,
  salaryMax: Infinity,
  location: "",
  search: "",
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isBrowseJob(value: unknown): value is BrowseJob {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.company === "string" &&
    typeof value.location === "string" &&
    typeof value.isRemote === "boolean" &&
    typeof value.minSalary === "number" &&
    typeof value.maxSalary === "number" &&
    JOB_FREQUENCIES.some((frequency) => frequency === value.frequency) &&
    JOB_TYPES.some((type) => type === value.type)
  )
}

function JobLogo() {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#141418]">
      <Clock className="size-4 text-[#a0a0ab]" strokeWidth={1.6} />
    </div>
  )
}

const SALARY_RANGES: Array<{ label: string; min: number; max: number }> = [
  { label: "Any", min: 0, max: Infinity },
  { label: "$0 – $50k", min: 0, max: 50000 },
  { label: "$50k – $100k", min: 50000, max: 100000 },
  { label: "$100k+", min: 100000, max: Infinity },
]

function readNumberParam(raw: string | null, fallback: number) {
  if (raw === null || raw === "") {
    return fallback
  }

  const value = Number(raw)

  return Number.isFinite(value) ? value : fallback
}

function filtersFromSearchParams(sp: {
  get(name: string): string | null
}): JobFilters {
  const type = sp.get("type")
  const category = sp.get("category")
  const remote = sp.get("remote")

  return {
    type: type && JOB_TYPES.some((jobType) => jobType === type) ? type : "",
    category:
      category && JOB_CATEGORIES.some((jobCategory) => jobCategory === category)
        ? category
        : "",
    remote: remote === "true" || remote === "false" ? remote : "all",
    salaryMin: readNumberParam(sp.get("minSalary"), 0),
    salaryMax: readNumberParam(sp.get("maxSalary"), Infinity),
    location: sp.get("location") ?? "",
    search: sp.get("search") ?? "",
  }
}

function buildQueryString(filters: JobFilters) {
  const params = new URLSearchParams()

  if (filters.search) params.set("search", filters.search)
  if (filters.type) params.set("type", filters.type)
  if (filters.category) params.set("category", filters.category)
  if (filters.remote !== "all") params.set("remote", filters.remote)
  if (filters.salaryMin > 0) params.set("minSalary", String(filters.salaryMin))
  if (filters.salaryMax !== Infinity) {
    params.set("maxSalary", String(filters.salaryMax))
  }
  if (filters.location) params.set("location", filters.location)

  return params.toString()
}

function FilterOption({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <label
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      className="flex cursor-pointer items-center gap-3 select-none"
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onToggle()
        }
      }}
    >
      <div
        className={cn(
          "relative size-4 shrink-0 rounded-sm border border-white/10",
          selected ? "border-[#5c53fe] bg-[#5c53fe]" : "bg-transparent",
        )}
      >
        {selected && (
          <Check className="absolute size-3 text-white" strokeWidth={1.8} />
        )}
      </div>
      <span
        className={cn(
          "text-[13px]",
          selected ? "text-[#ededef]" : "text-[#c6c6ce]",
        )}
      >
        {label}
      </span>
    </label>
  )
}

export function BrowseJobs({ standalone = false }: { standalone?: boolean }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // On /jobs the URL is the source of truth. The non-standalone branch keeps
  // filters in local state (currently unused — the landing page doesn't
  // render this component).
  const filters = standalone
    ? filtersFromSearchParams(searchParams)
    : undefined
  const [localFilters, setLocalFilters] = useState<JobFilters>(DEFAULT_FILTERS)
  const activeFilters = filters ?? localFilters

  const [jobs, setJobs] = useState<BrowseJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Job ids the signed-in user already applied to. null = not loaded yet
  // (signed-out visitors never see status badges).
  const [appliedIds, setAppliedIds] = useState<Set<string> | null>(null)

  // Uncommitted input values (committed on Enter / button click).
  const [searchInput, setSearchInput] = useState(() => activeFilters.search)
  const [locationInput, setLocationInput] = useState(
    () => activeFilters.location,
  )

  const {
    type: typeFilter,
    category: categoryFilter,
    remote: remoteMode,
    salaryMin,
    salaryMax,
    location: locationQuery,
    search: searchQuery,
  } = activeFilters

  useEffect(() => {
    const controller = new AbortController()

    async function fetchJobs() {
      try {
        const params = new URLSearchParams()

        if (typeFilter) params.set("type", typeFilter)
        if (categoryFilter) params.set("category", categoryFilter)
        if (remoteMode !== "all") params.set("remote", remoteMode)
        if (salaryMin > 0) params.set("minSalary", String(salaryMin))
        if (salaryMax !== Infinity) params.set("maxSalary", String(salaryMax))
        if (locationQuery) params.set("location", locationQuery)
        if (searchQuery) params.set("search", searchQuery)

        const response = await fetch(`${BACKEND_URL}/jobs?${params}`, {
          signal: controller.signal,
        })
        const payload: unknown = await response.json()

        if (!response.ok) {
          throw new Error("Could not load jobs from the backend.")
        }

        if (
          !isRecord(payload) ||
          !Array.isArray(payload.jobs) ||
          !payload.jobs.every(isBrowseJob)
        ) {
          throw new Error("The backend returned an invalid jobs response.")
        }

        setJobs(payload.jobs)
        setError(null)
      } catch (caught) {
        if (caught instanceof Error && caught.name === "AbortError") return
        setError(
          caught instanceof Error
            ? caught.message
            : "Could not load jobs from the backend.",
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void fetchJobs()

    return () => controller.abort()
  }, [typeFilter, categoryFilter, remoteMode, salaryMin, salaryMax, locationQuery, searchQuery])

  // Which jobs has this user applied to? Signed-out visitors get 401 → no badges.
  useEffect(() => {
    const controller = new AbortController()

    async function fetchApplied() {
      try {
        const response = await fetch("/api/seeker/applications", {
          signal: controller.signal,
        })

        if (!response.ok) return

        const payload: unknown = await response.json()

        if (
          isRecord(payload) &&
          Array.isArray(payload.applications) &&
          payload.applications.every(
            (item) =>
              isRecord(item) && typeof item.jobId === "string",
          )
        ) {
          setAppliedIds(
            new Set(
              payload.applications.map((item) => (item as { jobId: string }).jobId),
            ),
          )
        }
      } catch {
        // AbortError or network failure — just leave badges hidden.
      }
    }

    void fetchApplied()

    return () => controller.abort()
  }, [])

  function applyFilters(patch: Partial<JobFilters>) {
    if (standalone) {
      // Shallow URL update — Next.js keeps useSearchParams in sync.
      const query = buildQueryString({ ...activeFilters, ...patch })
      const nextUrl = query ? `?${query}` : pathname
      const currentUrl = window.location.search || pathname

      if (nextUrl !== currentUrl) {
        window.history.replaceState(null, "", nextUrl)
      }
    } else {
      setLocalFilters((previous) => ({ ...previous, ...patch }))
    }
  }

  const activeFilterCount =
    (typeFilter ? 1 : 0) +
    (categoryFilter ? 1 : 0) +
    (remoteMode !== "all" ? 1 : 0) +
    (salaryMin > 0 || salaryMax !== Infinity ? 1 : 0) +
    (locationQuery ? 1 : 0) +
    (searchQuery ? 1 : 0)

  function clearFilters() {
    applyFilters(DEFAULT_FILTERS)
    setSearchInput("")
    setLocationInput("")
  }

  return (
    <section
      id="browse-jobs"
      className={cn(
        "relative",
        standalone ? "min-h-[calc(100svh-64px)] py-2" : "py-20 sm:py-28",
      )}
    >
      {/* Top search bar */}
      <div
        className={cn(
          "mx-auto px-4 sm:px-6",
          standalone ? "max-w-[832px] sm:px-0" : "max-w-6xl",
        )}
      >
        <div
          className={cn(
            "rounded-xl border border-white/[0.08] bg-[#131316] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)]",
            standalone && "rounded-lg p-3",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-3 sm:flex-row sm:items-center",
              standalone ? "sm:gap-4 sm:p-0" : "p-4 sm:p-5",
            )}
          >
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2.5 px-4",
                standalone &&
                  "h-10 rounded-md border border-white/[0.07] bg-[#1a1a1f]",
              )}
            >
              <Search
                className="size-4 shrink-0 text-[#8d8d98]"
                strokeWidth={1.9}
              />
              <input
                type="text"
                placeholder="Search by job title, keywords..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    applyFilters({ search: searchInput })
                  }
                }}
                className="text-foreground min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#6e6e78] sm:text-sm"
              />
            </div>
            <Button
              type="button"
              onClick={() => applyFilters({ search: searchInput })}
              className={cn(
                "shrink-0 rounded-[10px] bg-[#fafafa] px-5 text-[13px] font-medium text-[#0b0b0c] hover:bg-white sm:px-6",
                standalone && "h-10 rounded-md px-5",
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
          standalone ? "mt-4 max-w-[832px] sm:px-0" : "mt-12 max-w-6xl",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between",
            standalone && "gap-5 min-[700px]:flex-row min-[700px]:items-start",
          )}
        >
          {/* Left: Filters sidebar */}
          <aside
            className={cn(
              "w-full shrink-0 lg:w-[260px]",
              standalone && "min-[700px]:w-[192px] lg:w-[192px]",
            )}
          >
            <div
              className={cn(
                "rounded-xl border border-white/[0.08] bg-[#131316] p-4 sm:p-5",
                standalone && "rounded-lg p-4",
              )}
            >
              <div className="mb-4 flex items-center gap-2">
                <Filter className="size-4 text-[#a0a0ab]" strokeWidth={1.6} />
                <h3
                  className={cn(
                    "text-[14px] font-semibold tracking-wider text-[#ededef] uppercase",
                    standalone && "tracking-normal normal-case",
                  )}
                >
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-[#141418] px-2.5 py-0.5 text-[11px] font-medium text-[#ededef] transition-colors hover:border-white/25"
                  >
                    Clear all
                    <span className="text-[#c6c6ce]">{activeFilterCount}</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Job Type — single select */}
                <div>
                  <p className="mb-2 text-[13px] font-medium text-[#ededef]">
                    Job Type
                  </p>
                  <div className="space-y-2">
                    {JOB_TYPES.map((jobType) => (
                      <FilterOption
                        key={jobType}
                        label={jobType}
                        selected={typeFilter === jobType}
                        onToggle={() =>
                          applyFilters({
                            type: typeFilter === jobType ? "" : jobType,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Category — single select */}
                <div>
                  <p className="mb-2 text-[13px] font-medium text-[#ededef]">
                    Category
                  </p>
                  <div className="space-y-2">
                    {JOB_CATEGORIES.map((category) => (
                      <FilterOption
                        key={category}
                        label={category}
                        selected={categoryFilter === category}
                        onToggle={() =>
                          applyFilters({
                            category:
                              categoryFilter === category ? "" : category,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Work Mode */}
                <div>
                  <p className="mb-2 text-[13px] font-medium text-[#ededef]">
                    Work Mode
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "All", value: "all" },
                      { label: "Remote", value: "true" },
                      { label: "On-site", value: "false" },
                    ].map((option) => (
                      <FilterOption
                        key={option.value}
                        label={option.label}
                        selected={remoteMode === option.value}
                        onToggle={() =>
                          applyFilters({ remote: option.value })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <p className="mb-2 text-[13px] font-medium text-[#ededef]">
                    Salary Range
                  </p>
                  <div className="space-y-2">
                    {SALARY_RANGES.map((range) => (
                      <FilterOption
                        key={range.label}
                        label={range.label}
                        selected={
                          salaryMin === range.min && salaryMax === range.max
                        }
                        onToggle={() =>
                          applyFilters({
                            salaryMin: range.min,
                            salaryMax: range.max,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="mb-2 text-[13px] font-medium text-[#ededef]">
                    Location
                  </p>
                  <input
                    type="text"
                    placeholder="City, country..."
                    value={locationInput}
                    onChange={(event) => setLocationInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        applyFilters({ location: locationInput })
                      }
                    }}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#1a1a1f] px-3 py-2 text-[13px] text-[#ededef] outline-none placeholder:text-[#6e6e78] focus:border-[#5c53fe]"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Right: results header + job cards */}
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                standalone && "mb-4",
              )}
            >
              <div>
                <h2
                  className={cn(
                    "text-[20px] leading-6 font-semibold text-[#ededef]",
                    standalone && "text-[15px] leading-5",
                  )}
                >
                  Found {jobs.length} Professional Jobs
                </h2>
                {(activeFilterCount > 0 || appliedIds) && (
                  <p className="mt-1 text-[12px] text-[#a0a0ab]">
                    {activeFilterCount > 0 &&
                      `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`}
                    {activeFilterCount > 0 && appliedIds && " • "}
                    {appliedIds &&
                      `${
                        jobs.filter((job) => appliedIds.has(job.id)).length
                      } of ${jobs.length} applied`}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#131316] px-3 py-2",
                  standalone && "border-0 bg-transparent px-0 py-0",
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
              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-[13px] text-red-300"
                >
                  {error}
                </p>
              ) : loading ? (
                <p className="py-8 text-center text-[13px] text-[#a0a0ab]">
                  Loading jobs…
                </p>
              ) : jobs.length === 0 ? (
                <p className="py-8 text-center text-[13px] text-[#a0a0ab]">
                  {activeFilterCount > 0
                    ? "No jobs match your filters."
                    : "No job listings are available yet."}
                </p>
              ) : (
                jobs.map((job) => (
                  <article
                    key={job.id}
                    className={cn(
                      "relative rounded-xl border border-white/[0.08] bg-[#131316] p-4 transition-colors hover:border-white/15 sm:p-5",
                      standalone && "rounded-lg sm:p-4",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4 sm:gap-5">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="min-w-0 flex-1 after:absolute after:inset-0 after:content-['']"
                      >
                        <div className="flex items-center gap-3">
                          <JobLogo />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-[15px] leading-5 font-semibold text-[#ededef] sm:text-lg">
                                {job.title}
                              </h3>
                              {appliedIds?.has(job.id) && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-2 py-0.5 text-[11px] leading-4 font-medium text-[#4ade80]">
                                  <Check className="size-3" strokeWidth={2.5} />
                                  Applied
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[12px] leading-4 text-[#a0a0ab]">
                              {job.company} •{" "}
                              {job.isRemote
                                ? `${job.location} (Remote)`
                                : job.location}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 rounded-[6px] border border-white/[0.07] bg-[#1a1a1f] px-2.5 py-1 text-[11px] font-medium text-[#a0a0ab]">
                                <Clock className="size-3.5" strokeWidth={1.6} />
                                {formatCompensation(job)}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-[6px] border border-white/[0.07] bg-[#1a1a1f] px-2.5 py-1 text-[11px] font-medium text-[#a0a0ab]">
                                {job.type}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-[6px] border border-white/[0.07] bg-[#1a1a1f] px-2.5 py-1 text-[11px] font-medium text-[#a0a0ab]">
                                {job.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <button
                        type="button"
                        aria-label="Bookmark"
                        className="relative z-10 shrink-0 rounded p-1.5 text-[#a0a0ab] transition-colors hover:bg-white/[0.05] hover:text-white"
                      >
                        <Bookmark className="size-4" strokeWidth={1.6} />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
