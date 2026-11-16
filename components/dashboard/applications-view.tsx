"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Code2,
  Download,
  Palette,
  PenTool,
  Server,
  type LucideIcon,
} from "lucide-react"

import { CARD_CLASS } from "@/components/dashboard/primitives"
import { cn } from "@/lib/utils"

type ApplicationStatus =
  "Applied" | "Review" | "Interview" | "Shortlisted" | "Rejected" | "Offered"

type Application = {
  id: string
  jobId: string
  title: string
  company: string
  employment: string
  location: string
  applied: string
  status: ApplicationStatus
  icon: LucideIcon
  tileClassName?: string
}

/** Shape returned by GET /api/seeker/applications. */
type ApiApplication = {
  id: string
  jobId: string
  title: string
  company: string
  employment: string
  location: string
  category: string
  status: ApplicationStatus
  createdAt: string
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Engineering: Code2,
  Design: PenTool,
  Marketing: Palette,
  Infrastructure: Server,
  Quality: ClipboardCheck,
  Product: ClipboardList,
}

/** Settled outcomes live in the Archived tab. */
const ARCHIVED_STATUSES: ApplicationStatus[] = ["Rejected", "Offered"]

const PAGE_SIZE = 5

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "border-white/10 bg-white/[0.06] text-[#b4b4bc]",
  Review: "border-[#f59e0b]/25 bg-[#f59e0b]/10 text-[#f59e0b]",
  Interview: "border-[#8f88ff]/30 bg-[#8f88ff]/15 text-[#8f88ff]",
  Shortlisted: "border-[#60a5fa]/25 bg-[#60a5fa]/10 text-[#60a5fa]",
  Rejected: "border-[#ef4444]/25 bg-[#ef4444]/10 text-[#ef4444]",
  Offered: "border-[#22c55e]/25 bg-[#22c55e]/10 text-[#22c55e]",
}

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()

  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`

  const weeks = Math.floor(days / 7)
  if (days < 30) return `${weeks} week${weeks === 1 ? "" : "s"} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`

  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? "" : "s"} ago`
}

function toApplication(raw: ApiApplication): Application {
  return {
    id: raw.id,
    jobId: raw.jobId,
    title: raw.title,
    company: raw.company,
    employment: raw.employment,
    location: raw.location,
    applied: formatTimeAgo(raw.createdAt),
    status: raw.status,
    icon: CATEGORY_ICONS[raw.category] ?? Briefcase,
    ...(raw.status === "Rejected" ? { tileClassName: "bg-[#b91c1c]" } : {}),
  }
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-full border px-2.5 text-[12px] leading-4 font-medium whitespace-nowrap",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  )
}

function SummaryCard({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div
      className={cn(
        CARD_CLASS,
        "flex h-[84px] flex-col justify-center gap-0.5 px-5 sm:px-6"
      )}
    >
      <p className="text-[13px] leading-5 text-[#a0a0ab]">{label}</p>
      <p
        className={cn(
          "text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]",
          valueClassName
        )}
      >
        {value}
      </p>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="grid size-8 place-items-center rounded-lg text-[#8a8a93] transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={2} />
      </button>

      {pages.map((value) => (
        <button
          key={value}
          type="button"
          aria-label={`Page ${value}`}
          aria-current={value === page ? "page" : undefined}
          onClick={() => onChange(value)}
          className={cn(
            "grid size-8 place-items-center rounded-lg text-[13px] leading-5 font-medium transition-colors",
            value === page
              ? "bg-[#f4f4f5] text-[#111318]"
              : "text-[#a0a0ab] hover:bg-white/[0.06] hover:text-white"
          )}
        >
          {value}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="grid size-8 place-items-center rounded-lg text-[#8a8a93] transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight aria-hidden="true" className="size-4" strokeWidth={2} />
      </button>
    </div>
  )
}

function TableMessage({ children }: { children: React.ReactNode }) {
  return (
    <tr className="h-28">
      <td colSpan={5} className="px-5 text-center text-[13px] leading-5">
        {children}
      </td>
    </tr>
  )
}

/** Pure fetch — no setState, so callers decide where results land. */
async function fetchApplications(): Promise<Application[]> {
  const response = await fetch("/api/seeker/applications")

  if (!response.ok) {
    throw new Error()
  }

  const payload = (await response.json()) as {
    applications?: ApiApplication[]
  }

  return (payload.applications ?? []).map(toApplication)
}

export function ApplicationsView() {
  const [tab, setTab] = useState<"active" | "archived">("active")
  const [page, setPage] = useState(1)

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initial load: setState only inside the promise callbacks, never
  // synchronously in the effect body (react-hooks/set-state-in-effect).
  useEffect(() => {
    let cancelled = false

    fetchApplications().then(
      (list) => {
        if (cancelled) return
        setApplications(list)
        setError(null)
        setLoading(false)
      },
      () => {
        if (cancelled) return
        setApplications([])
        setError("Could not load your applications.")
        setLoading(false)
      }
    )

    return () => {
      cancelled = true
    }
  }, [])

  function handleRetry() {
    setLoading(true)
    setError(null)

    fetchApplications().then(
      (list) => {
        setApplications(list)
        setError(null)
        setLoading(false)
      },
      () => {
        setApplications([])
        setError("Could not load your applications.")
        setLoading(false)
      }
    )
  }

  const applicationsForTab = useMemo(() => {
    if (tab === "active") {
      return applications.filter(
        (application) => !ARCHIVED_STATUSES.includes(application.status)
      )
    }

    return applications.filter((application) =>
      ARCHIVED_STATUSES.includes(application.status)
    )
  }, [applications, tab])

  const totalPages = Math.max(
    1,
    Math.ceil(applicationsForTab.length / PAGE_SIZE)
  )
  const currentPage = Math.min(page, totalPages)

  const rows = useMemo(
    () =>
      applicationsForTab.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [applicationsForTab, currentPage]
  )

  const start =
    applicationsForTab.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const end = Math.min(currentPage * PAGE_SIZE, applicationsForTab.length)

  const total = applications.length
  const shortlisted = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length
  const inReview = applications.filter(
    (application) => application.status === "Review"
  ).length
  const offered = applications.filter(
    (application) => application.status === "Offered"
  ).length
  const successRate = total === 0 ? 0 : Math.round((offered / total) * 100)

  return (
    <div className="p-4 pb-16 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="text-[24px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
            My Applications
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#a0a0ab]">
            Track your job applications and interview progress in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Filter applications"
            className="inline-flex h-10 items-center rounded-lg border border-white/10 bg-[#141418] p-1"
          >
            {(["active", "archived"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => {
                  setTab(value)
                  setPage(1)
                }}
                className={cn(
                  "h-8 rounded-md px-4 text-[13px] leading-5 font-medium capitalize transition-colors",
                  tab === value
                    ? "bg-[#232327] text-[#f4f4f5]"
                    : "text-[#a0a0ab] hover:text-[#ededef]"
                )}
              >
                {value === "active" ? "Active" : "Archived"}
              </button>
            ))}
          </div>

          <button
            type="button"
            title="Coming soon"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#f4f4f5] px-4 text-[13px] leading-5 font-semibold whitespace-nowrap text-[#111318] transition-colors hover:bg-white active:scale-[0.99]"
          >
            <Download aria-hidden="true" className="size-4" strokeWidth={2} />
            Export PDF
          </button>
        </div>
      </div>

      <section
        aria-label="Application summary"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard label="Total Applied" value={String(total)} />
        <SummaryCard label="Shortlisted" value={String(shortlisted)} />
        <SummaryCard label="In Review" value={String(inReview)} />
        <SummaryCard
          label="Success Rate"
          value={`${successRate}%`}
          valueClassName="text-[#4ade80]"
        />
      </section>

      <div className={cn(CARD_CLASS, "mt-6 overflow-hidden")}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="h-11 border-b border-white/[0.07]">
                <th
                  scope="col"
                  className="px-5 text-[12px] leading-4 font-medium text-[#8a8a93]"
                >
                  Job Title
                </th>
                <th
                  scope="col"
                  className="hidden px-5 text-[12px] leading-4 font-medium text-[#8a8a93] md:table-cell"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="hidden px-5 text-[12px] leading-4 font-medium text-[#8a8a93] sm:table-cell"
                >
                  Applied
                </th>
                <th
                  scope="col"
                  className="px-5 text-[12px] leading-4 font-medium text-[#8a8a93]"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-5 text-right text-[12px] leading-4 font-medium text-[#8a8a93]"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableMessage>
                  <span className="text-[#8a8a93]">Loading applications…</span>
                </TableMessage>
              ) : error ? (
                <TableMessage>
                  <span className="text-[#8a8a93]">{error}</span>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="mt-2 block w-full font-medium text-[#5c53fe] transition-colors hover:text-[#6a62ff]"
                  >
                    Try again
                  </button>
                </TableMessage>
              ) : rows.length === 0 ? (
                <TableMessage>
                  <span className="text-[#ededef]">
                    No {tab === "active" ? "active" : "archived"} applications
                    yet.
                  </span>
                  <Link
                    href="/jobs"
                    className="mt-2 block font-medium text-[#5c53fe] transition-colors hover:text-[#6a62ff]"
                  >
                    Browse jobs →
                  </Link>
                </TableMessage>
              ) : (
                rows.map((application) => {
                  const Icon = application.icon

                  return (
                    <tr
                      key={application.id}
                      className="h-16 border-b border-white/[0.06] last:border-0"
                    >
                      <td className="px-5 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={cn(
                              "grid size-10 shrink-0 place-items-center rounded-lg bg-[#232327]",
                              application.tileClassName
                            )}
                          >
                            <Icon
                              aria-hidden="true"
                              className="size-[18px] text-[#e5e5ea]"
                              strokeWidth={1.7}
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] leading-[18px] font-medium text-[#ededef]">
                              {application.title}
                            </span>
                            <span className="block truncate text-[12px] leading-4 text-[#8a8a93]">
                              {application.employment} • {application.location}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="hidden px-5 text-[13px] leading-5 text-[#b4b4bc] md:table-cell">
                        {application.company}
                      </td>
                      <td className="hidden px-5 text-[13px] leading-5 text-[#8a8a93] sm:table-cell">
                        {application.applied}
                      </td>
                      <td className="px-5">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-5 text-right">
                        <Link
                          href={`/jobs/${application.jobId}`}
                          className="text-[13px] leading-5 font-medium text-[#c4c7c8] transition-colors hover:text-white"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] leading-5 text-[#8a8a93]">
            Showing {start}–{end} of {applicationsForTab.length} applications
          </p>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}
