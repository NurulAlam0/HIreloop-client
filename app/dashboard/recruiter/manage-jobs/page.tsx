import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronRight, Plus } from "lucide-react"

import { ManageJobsTable } from "@/components/dashboard/manage-jobs-table"
import { ensureDemoJobs, getJobsForOwner } from "@/lib/jobs"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Manage Job Posts",
}

export default async function ManageJobsPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  await ensureDemoJobs(session.user.id)

  const jobs = await getJobsForOwner(session.user.id)

  return (
    <div className="p-4 pb-16 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-[13px] leading-5"
      >
        <span className="text-[#a0a0ab]">Manage Jobs</span>
        <ChevronRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-[#6e6e78]"
          strokeWidth={2}
        />
        <span className="text-[#ededef]">Job Listings &amp; Postings</span>
      </nav>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-[34px] leading-[42px] font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[40px] sm:leading-[48px]">
            Manage Job Posts
          </h1>
          <p className="mt-2 text-[14px] leading-5 text-[#a0a0ab]">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/add-job"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#5c53fe] px-5 text-[14px] leading-5 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(92,83,254,0.9)] transition-colors hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
        >
          <Plus
            aria-hidden="true"
            className="size-4"
            strokeWidth={2.4}
          />
          New Job Post
        </Link>
      </div>

      <ManageJobsTable jobs={jobs} />
    </div>
  )
}
