"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from "lucide-react"

import {
  CARD_CLASS,
  InitialAvatar,
  StatusPill,
  TH_CLASS,
  type PillTone,
} from "@/components/dashboard/primitives"
import { cn } from "@/lib/utils"

type ApplicationStatus =
  "Applied" | "Review" | "Interview" | "Shortlisted" | "Rejected" | "Offered"

type RecruiterApplication = {
  id: string
  jobId: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  status: ApplicationStatus
  createdAt: string
}

/** Shape returned by GET /api/recruiter/applications. */
type ApiApplication = {
  id: string
  jobId: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  status: ApplicationStatus
  createdAt: string
}

const STATUS_TONES: Record<ApplicationStatus, PillTone> = {
  Applied: "blue",
  Review: "amber",
  Interview: "violet",
  Shortlisted: "green",
  Rejected: "red",
  Offered: "green",
}

/** Settled candidates can no longer be invited to an interview. */
const SETTLED_STATUSES: ApplicationStatus[] = ["Rejected", "Offered"]

const PAGE_SIZE = 8

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
  if (days < 365) return `${months} month${months === 1 ? "" : "s"} ago`

  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? "" : "s"} ago`
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
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="grid size-8 place-items-center rounded-md text-[#8a8a93] transition-colors hover:bg-white/[0.06] hover:text-[#ededef] disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      {pages.map((value) => (
        <button
          key={value}
          type="button"
          aria-current={value === page ? "page" : undefined}
          onClick={() => onChange(value)}
          className={cn(
            "grid size-8 place-items-center rounded-md text-[13px] font-medium transition-colors",
            value === page
              ? "bg-[#232327] text-[#f4f4f5]"
              : "text-[#8a8a93] hover:bg-white/[0.06] hover:text-[#ededef]"
          )}
        >
          {value}
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="grid size-8 place-items-center rounded-md text-[#8a8a93] transition-colors hover:bg-white/[0.06] hover:text-[#ededef] disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

function TableMessage({ children }: { children: React.ReactNode }) {
  return (
    <tr className="h-40">
      <td colSpan={5} className="px-5 text-center text-[13px] leading-5">
        {children}
      </td>
    </tr>
  )
}

/** Pure fetch — no setState, so callers decide where results land. */
async function fetchApplications(): Promise<RecruiterApplication[]> {
  const response = await fetch("/api/recruiter/applications")

  if (!response.ok) {
    throw new Error()
  }

  const payload = (await response.json()) as {
    applications?: ApiApplication[]
  }

  return payload.applications ?? []
}

async function inviteToInterview(id: string): Promise<ApplicationStatus> {
  const response = await fetch(`/api/recruiter/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Interview" }),
  })

  if (!response.ok) {
    throw new Error()
  }

  const payload = (await response.json()) as {
    application?: { status: ApplicationStatus }
  }

  return payload.application?.status ?? "Interview"
}

export function RecruiterApplicationsView() {
  const [page, setPage] = useState(1)

  const [applications, setApplications] = useState<RecruiterApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [invitingId, setInvitingId] = useState<string | null>(null)
  const [inviteError, setInviteError] = useState<string | null>(null)

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
        setError("Could not load applications.")
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
        setError("Could not load applications.")
        setLoading(false)
      }
    )
  }

  function handleInvite(application: RecruiterApplication) {
    setInvitingId(application.id)
    setInviteError(null)

    inviteToInterview(application.id).then(
      () => {
        setApplications((current) =>
          current.map((item) =>
            item.id === application.id
              ? { ...item, status: "Interview" as const }
              : item
          )
        )
        setInvitingId(null)
      },
      () => {
        setInviteError("Could not send the interview invite. Please try again.")
        setInvitingId(null)
      }
    )
  }

  const totalPages = Math.max(1, Math.ceil(applications.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const rows = useMemo(
    () =>
      applications.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [applications, currentPage]
  )

  const start =
    applications.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const end = Math.min(currentPage * PAGE_SIZE, applications.length)

  const total = applications.length
  const newCount = applications.filter(
    (application) => application.status === "Applied"
  ).length
  const inReview = applications.filter(
    (application) => application.status === "Review"
  ).length
  const invited = applications.filter(
    (application) => application.status === "Interview"
  ).length

  return (
    <div className="p-4 pb-16 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      <div className="min-w-0">
        <h1 className="text-[24px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
          Applications
        </h1>
        <p className="mt-1 text-[13px] leading-5 text-[#a0a0ab]">
          Everyone who applied to your job posts — invite them to an interview
          in one click.
        </p>
      </div>

      <section
        aria-label="Application summary"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard label="Total Applications" value={String(total)} />
        <SummaryCard label="New" value={String(newCount)} />
        <SummaryCard label="In Review" value={String(inReview)} />
        <SummaryCard
          label="Interview Invites"
          value={String(invited)}
          valueClassName="text-[#8f88ff]"
        />
      </section>

      <div className={cn(CARD_CLASS, "mt-6 overflow-hidden")}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-[#1a1a1f]">
                <th scope="col" className={TH_CLASS}>
                  Applicant
                </th>
                <th scope="col" className={TH_CLASS}>
                  Job
                </th>
                <th scope="col" className={TH_CLASS}>
                  Applied
                </th>
                <th scope="col" className={TH_CLASS}>
                  Status
                </th>
                <th scope="col" className={cn(TH_CLASS, "text-right")}>
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
                  <span className="mx-auto flex max-w-sm flex-col items-center gap-2">
                    <ClipboardList
                      aria-hidden="true"
                      className="size-6 text-[#6e6e78]"
                      strokeWidth={1.6}
                    />
                    <span className="text-[#ededef]">No applications yet.</span>
                    <span className="text-[#8a8a93]">
                      When candidates apply to your job posts, they will show up
                      here.
                    </span>
                    <Link
                      href="/dashboard/recruiter/add-job"
                      className="mt-1 font-medium text-[#5c53fe] transition-colors hover:text-[#6a62ff]"
                    >
                      Post a job →
                    </Link>
                  </span>
                </TableMessage>
              ) : (
                rows.map((application) => {
                  const settled = SETTLED_STATUSES.includes(application.status)
                  const invitedAlready = application.status === "Interview"
                  const canInvite = !settled && !invitedAlready

                  return (
                    <tr
                      key={application.id}
                      className="h-16 border-t border-white/[0.07] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <InitialAvatar name={application.applicantName} />
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] leading-5 font-medium whitespace-nowrap text-[#ededef]">
                              {application.applicantName}
                            </span>
                            {application.applicantEmail && (
                              <span className="block truncate text-[12px] leading-4 text-[#8a8a93]">
                                {application.applicantEmail}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]">
                        {application.jobTitle}
                      </td>
                      <td className="px-4 text-[13px] leading-5 whitespace-nowrap text-[#8a8a93]">
                        {formatTimeAgo(application.createdAt)}
                      </td>
                      <td className="px-4">
                        <StatusPill tone={STATUS_TONES[application.status]}>
                          {application.status}
                        </StatusPill>
                      </td>
                      <td className="px-4 text-right">
                        {canInvite ? (
                          <button
                            type="button"
                            disabled={invitingId === application.id}
                            onClick={() => handleInvite(application)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#5c53fe] px-3.5 text-[13px] leading-5 font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <CalendarCheck
                              aria-hidden="true"
                              className="size-4"
                              strokeWidth={2}
                            />
                            {invitingId === application.id
                              ? "Inviting…"
                              : "Invite to Interview"}
                          </button>
                        ) : invitedAlready ? (
                          <span className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#8f88ff]/30 bg-[#8f88ff]/10 px-3.5 text-[13px] leading-5 font-medium whitespace-nowrap text-[#8f88ff]">
                            <CheckCircle2
                              aria-hidden="true"
                              className="size-4"
                              strokeWidth={2}
                            />
                            Invited
                          </span>
                        ) : (
                          <span className="text-[13px] leading-5 text-[#6e6e78]">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {inviteError && (
          <p
            role="alert"
            className="border-t border-[#ef4444]/25 bg-[#ef4444]/10 px-5 py-3 text-[13px] leading-5 text-[#f87171]"
          >
            {inviteError}
          </p>
        )}

        {!loading && !error && applications.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] leading-5 text-[#8a8a93]">
              Showing {start}–{end} of {applications.length} applications
            </p>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[13px] leading-5 text-[#8a8a93]">
        <Briefcase aria-hidden="true" className="size-4" strokeWidth={1.7} />
        Invited candidates see an updated status in their own My Applications
        list.
      </p>
    </div>
  )
}
