import type { Metadata } from "next"
import Link from "next/link"
import { Briefcase, CheckCircle2, Users, XCircle } from "lucide-react"

import {
  CARD_CLASS,
  FloatingActionButton,
  InitialAvatar,
  MetricCard,
  SectionHeading,
  StatusPill,
  TH_CLASS,
  type PillTone,
} from "@/components/dashboard/primitives"
import {
  getApplicationsForRecruiter,
  type ApplicationStatus,
} from "@/lib/applications"
import { cn } from "@/lib/utils"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Recruiter Dashboard",
}

const STATUS_TONES: Record<ApplicationStatus, PillTone> = {
  Applied: "blue",
  Review: "amber",
  Interview: "violet",
  Shortlisted: "green",
  Rejected: "red",
  Offered: "green",
}

const RECENT_LIMIT = 5

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function RecruiterDashboardPage() {
  const session = await getSession()
  const recruiterName = session?.user?.name?.trim() || "there"
  const ownerId = session?.user?.id ?? ""

  const recent = ownerId
    ? (await getApplicationsForRecruiter(ownerId)).slice(0, RECENT_LIMIT)
    : []

  return (
    <div className="p-4 pb-24 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      <h1 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
        Welcome back, {recruiterName}
      </h1>

      <section
        aria-label="Hiring overview"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6"
      >
        <MetricCard label="Total Job Posts" value="48" icon={Briefcase} />
        <MetricCard label="Total Applicants" value="1,284" icon={Users} />
        <MetricCard label="Active Jobs" value="18" icon={CheckCircle2} />
        <MetricCard label="Jobs Closed" value="32" icon={XCircle} />
      </section>

      <section aria-label="Recent applications" className="mt-6">
        <SectionHeading
          title="Recent Applications"
          action={
            <Link
              href="/dashboard/recruiter/applications"
              className="text-[13px] leading-5 text-[#ededef] transition-colors hover:text-white"
            >
              View all
            </Link>
          }
        />

        <div className={cn(CARD_CLASS, "mt-6 overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <colgroup>
                <col />
                <col className="w-[220px]" />
                <col className="w-[140px]" />
                <col className="w-[130px]" />
              </colgroup>
              <thead>
                <tr className="bg-[#1a1a1f]">
                  <th scope="col" className={TH_CLASS}>
                    Candidate Name
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Job
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Date Applied
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr className="h-40 border-t border-white/[0.07]">
                    <td
                      colSpan={4}
                      className="px-4 text-center text-[13px] leading-5"
                    >
                      <span className="text-[#8a8a93]">
                        No applications yet — candidates who apply to your jobs
                        will appear here.
                      </span>
                      <Link
                        href="/dashboard/recruiter/applications"
                        className="mt-2 block font-medium text-[#5c53fe] transition-colors hover:text-[#6a62ff]"
                      >
                        View applications →
                      </Link>
                    </td>
                  </tr>
                ) : (
                  recent.map((application) => (
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
                      <td className="px-4 text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]">
                        {formatDate(application.createdAt)}
                      </td>
                      <td className="px-4">
                        <StatusPill tone={STATUS_TONES[application.status]}>
                          {application.status}
                        </StatusPill>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FloatingActionButton
        label="Create job post"
        tooltip="Create Job Post"
        size="lg"
        href="/dashboard/recruiter/add-job"
      />
    </div>
  )
}
