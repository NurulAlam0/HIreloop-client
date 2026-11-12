"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Archive,
  Briefcase,
  Code2,
  Gauge,
  Globe,
  MapPin,
  Megaphone,
  MoreVertical,
  Package,
  Pencil,
  PenTool,
  RotateCcw,
  Server,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  formatCompensation,
  formatDeadline,
  formatPosted,
  getDisplayStatus,
  type JobDTO,
} from "@/lib/job-types"
import { cn } from "@/lib/utils"

const CATEGORY_ICONS: Array<{
  match: string[]
  icon: LucideIcon
  className: string
}> = [
  { match: ["engineer", "develop"], icon: Code2, className: "text-[#a78bfa]" },
  { match: ["design"], icon: PenTool, className: "text-[#fb923c]" },
  {
    match: ["infra", "devops", "platform", "cloud"],
    icon: Server,
    className: "text-[#60a5fa]",
  },
  { match: ["market", "growth"], icon: Megaphone, className: "text-[#c084fc]" },
  {
    match: ["quality", "qa", "test"],
    icon: Gauge,
    className: "text-[#34d399]",
  },
  { match: ["product"], icon: Package, className: "text-[#f472b6]" },
  { match: ["sales"], icon: TrendingUp, className: "text-[#facc15]" },
  { match: ["finance", "billing"], icon: Wallet, className: "text-[#4ade80]" },
]

function categoryStyle(category: string): {
  icon: LucideIcon
  className: string
} {
  const value = category.toLowerCase()
  const found = CATEGORY_ICONS.find((entry) =>
    entry.match.some((keyword) => value.includes(keyword)),
  )

  return found ?? { icon: Briefcase, className: "text-[#c4c7c8]" }
}

const STATUS_STYLES = {
  Active: {
    pill: "border-[#22c55e]/25 bg-[#22c55e]/10 text-[#4ade80]",
    dot: "bg-[#22c55e]",
  },
  Expired: {
    pill: "border-white/[0.07] bg-white/[0.05] text-[#a0a0ab]",
    dot: "bg-[#6e6e78]",
  },
  Closed: {
    pill: "border-white/[0.07] bg-white/[0.05] text-[#a0a0ab]",
    dot: "bg-[#6e6e78]",
  },
} as const

const TH_CLASS =
  "h-11 px-3 text-left text-[11px] leading-[14px] font-medium tracking-[0.04em] whitespace-nowrap text-[#6e6e78]"

export function ManageJobsTable({ jobs }: { jobs: JobDTO[] }) {
  const router = useRouter()
  const [pendingDelete, setPendingDelete] = useState<JobDTO | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  async function removeJob(job: JobDTO) {
    setBusyId(job.id)
    setActionError(null)

    try {
      const response = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setActionError(payload?.error ?? "Could not delete this job post.")
        return
      }

      setPendingDelete(null)
      router.refresh()
    } catch {
      setActionError("Network error. Please try again.")
    } finally {
      setBusyId(null)
    }
  }

  async function toggleStatus(job: JobDTO) {
    setBusyId(job.id)
    setActionError(null)

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          status: job.status === "closed" ? "active" : "closed",
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setActionError(payload?.error ?? "Could not update this job post.")
        return
      }

      router.refresh()
    } catch {
      setActionError("Network error. Please try again.")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mt-8">
      {actionError && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-4 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-[13px] leading-5 text-[#f87171]"
        >
          {actionError}
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-[12px] font-medium text-[#f87171]/80 hover:text-[#f87171]"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#141418] shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.035)]">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-[#222228]">
              <Briefcase
                aria-hidden="true"
                className="size-5 text-[#a0a0ab]"
                strokeWidth={1.7}
              />
            </span>
            <div>
              <p className="text-[15px] leading-6 font-semibold text-[#ededef]">
                No job posts yet
              </p>
              <p className="mt-1 text-[13px] leading-5 text-[#a0a0ab]">
                Publish your first listing to start collecting candidates.
              </p>
            </div>
            <Link
              href="/dashboard/recruiter/add-job"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[#5c53fe] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#6a62ff]"
            >
              Post a New Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1116px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[20.75%]" />
                <col className="w-[15%]" />
                <col className="w-[9%]" />
                <col className="w-[12%]" />
                <col className="w-[10.5%]" />
                <col className="w-[8.5%]" />
                <col className="w-[9.25%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#1a1a1f]">
                  <th scope="col" className={TH_CLASS}>
                    JOB TITLE &amp; DEPT
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    COMPANY &amp; LOCATION
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    TYPE
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    COMPENSATION
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    APPLICANTS
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    STATUS
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    DEADLINE
                  </th>
                  <th
                    scope="col"
                    className={cn(
                      TH_CLASS,
                      "sticky right-0 z-20 bg-[#1a1a1f] text-right shadow-[-10px_0_14px_-12px_rgba(0,0,0,0.9)]",
                    )}
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const style = categoryStyle(job.category)
                  const Icon = style.icon
                  const status = getDisplayStatus(job)
                  const statusStyle = STATUS_STYLES[status]
                  const busy = busyId === job.id

                  return (
                    <tr
                      key={job.id}
                      className="group h-[74px] border-t border-white/[0.07] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-3">
                        <div className="flex items-center gap-2">
                          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/[0.06] bg-[#0f0f12]">
                            <Icon
                              aria-hidden="true"
                              className={cn("size-[18px]", style.className)}
                              strokeWidth={1.8}
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[14px] leading-5 font-semibold text-[#ededef]">
                              {job.title}
                            </p>
                            <p
                              className={cn(
                                "truncate text-[12px] leading-4",
                                style.className,
                              )}
                            >
                              {job.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3">
                        <p className="truncate text-[13.5px] leading-5 text-[#ededef]">
                          {job.company}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[12px] leading-4 text-[#a0a0ab]">
                          {job.isRemote ? (
                            <Globe
                              aria-hidden="true"
                              className="size-3.5 shrink-0"
                              strokeWidth={1.8}
                            />
                          ) : (
                            <MapPin
                              aria-hidden="true"
                              className="size-3.5 shrink-0"
                              strokeWidth={1.8}
                            />
                          )}
                          <span className="truncate">
                            {job.isRemote
                              ? `Remote (${job.location})`
                              : job.location}
                          </span>
                        </p>
                      </td>

                      <td className="px-3">
                        <span className="inline-flex h-[26px] items-center rounded-full border border-white/[0.07] bg-[#1a1a1f] px-3 text-[12px] leading-4 whitespace-nowrap text-[#c4c7c8]">
                          {job.type}
                        </span>
                      </td>

                      <td className="truncate px-3 text-[13px] leading-5 font-medium whitespace-nowrap text-[#ededef]">
                        {formatCompensation(job)}
                      </td>

                      <td className="px-3">
                        <span className="flex items-center gap-1 text-[12px] leading-5 whitespace-nowrap text-[#ededef]">
                          <Users
                            aria-hidden="true"
                            className="size-3.5 shrink-0 text-[#a0a0ab]"
                            strokeWidth={1.8}
                          />
                          <span className="font-semibold">
                            {job.applicants}
                          </span>
                          <span className="text-[#c4c7c8]">Candidates</span>
                        </span>
                      </td>

                      <td className="px-3">
                        <span
                          className={cn(
                            "inline-flex h-[24px] items-center gap-1.5 rounded-full border px-2.5 text-[12px] leading-4 font-medium whitespace-nowrap",
                            statusStyle.pill,
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "size-1.5 rounded-full",
                              statusStyle.dot,
                            )}
                          />
                          {status}
                        </span>
                      </td>

                      <td className="px-3">
                        <p className="text-[12.5px] leading-5 whitespace-nowrap text-[#ededef]">
                          {formatDeadline(job.deadline)}
                        </p>
                        <p className="text-[11px] leading-4 whitespace-nowrap text-[#6e6e78]">
                          {status === "Active"
                            ? formatPosted(job.createdAt)
                            : "Closed"}
                        </p>
                      </td>

                      <td className="sticky right-0 z-10 bg-[#141418] px-3 shadow-[-10px_0_14px_-12px_rgba(0,0,0,0.9)] group-hover:bg-[#17171c]">
                        <div className="flex items-center justify-end gap-0.5">
                          <Link
                            href={`/dashboard/recruiter/manage-jobs/${job.id}/edit`}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#5c53fe]/30 bg-[#5c53fe]/15 px-2 text-[12px] leading-4 font-medium whitespace-nowrap text-[#b7b1ff] transition-colors hover:bg-[#5c53fe]/25"
                          >
                            <Pencil
                              aria-hidden="true"
                              className="size-3.5"
                              strokeWidth={1.8}
                            />
                            Update
                          </Link>

                          <button
                            type="button"
                            onClick={() => setPendingDelete(job)}
                            aria-label={`Delete ${job.title}`}
                            className="grid size-6 shrink-0 place-items-center rounded-lg text-[#a0a0ab] transition-colors hover:bg-[#ef4444]/10 hover:text-[#f87171]"
                          >
                            <Trash2
                              aria-hidden="true"
                              className="size-4"
                              strokeWidth={1.7}
                            />
                          </button>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <button
                                  type="button"
                                  aria-label={`More actions for ${job.title}`}
                                  className="grid size-6 shrink-0 place-items-center rounded-lg text-[#a0a0ab] transition-colors hover:bg-white/5 hover:text-[#ededef]"
                                >
                                  <MoreVertical
                                    aria-hidden="true"
                                    className="size-4"
                                    strokeWidth={1.8}
                                  />
                                </button>
                              }
                            />
                            <DropdownMenuContent
                              align="end"
                              sideOffset={6}
                              className="w-44 rounded-xl border border-white/10 bg-[#141418] p-1 text-[#ededef] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.85)]"
                            >
                              <DropdownMenuItem
                                disabled={busy}
                                onClick={() =>
                                  router.push(
                                    `/dashboard/recruiter/manage-jobs/${job.id}/edit`,
                                  )
                                }
                                className="gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#c6c6ce] outline-none focus:bg-white/[0.06] focus:text-white"
                              >
                                <Pencil className="size-4" strokeWidth={1.7} />
                                Update job
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={busy}
                                onClick={() => toggleStatus(job)}
                                className="gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#c6c6ce] outline-none focus:bg-white/[0.06] focus:text-white"
                              >
                                {job.status === "closed" ? (
                                  <RotateCcw className="size-4" strokeWidth={1.7} />
                                ) : (
                                  <Archive className="size-4" strokeWidth={1.7} />
                                )}
                                {job.status === "closed"
                                  ? "Reopen job"
                                  : "Close job"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1 bg-white/[0.07]" />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setPendingDelete(job)}
                                className="gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#f87171] outline-none focus:bg-[#ef4444]/10 focus:text-[#f87171]"
                              >
                                <Trash2 className="size-4" strokeWidth={1.7} />
                                Delete job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !busyId) {
            setPendingDelete(null)
          }
        }}
      >
        <AlertDialogContent className="max-w-md rounded-xl border border-white/10 bg-[#141418] text-[#ededef] ring-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[17px] leading-6 font-semibold text-[#ededef]">
              Delete this job post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] leading-5 text-[#a0a0ab]">
              {pendingDelete
                ? `“${pendingDelete.title}” and its listing will be permanently removed. This action cannot be undone.`
                : "This job post will be permanently removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-white/[0.07] bg-[#101013]">
            <AlertDialogCancel className="h-9 rounded-lg border border-white/10 bg-transparent px-4 text-[13px] font-medium text-[#ededef] hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={Boolean(busyId)}
              onClick={() => {
                if (pendingDelete) {
                  void removeJob(pendingDelete)
                }
              }}
              className="h-9 rounded-lg bg-[#ef4444] px-4 text-[13px] font-semibold text-white hover:bg-[#f05252]"
            >
              {busyId ? "Deleting…" : "Delete job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
