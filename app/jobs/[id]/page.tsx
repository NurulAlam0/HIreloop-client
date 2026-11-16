import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Bookmark, Clock, MapPin, Briefcase, Building2 } from "lucide-react"

import { ApplyButton } from "@/components/jobs/apply-button"
import { Navbar } from "@/components/layout/navbar"
import {
  APPLY_LIMIT,
  countApplicationsForUser,
  hasApplied,
} from "@/lib/applications"
import { getJobById } from "@/lib/jobs"
import { hasApplyUnlock } from "@/lib/payments"
import { formatCompensation } from "@/lib/job-types"
import { getSession } from "@/lib/session"
import { cn } from "@/lib/utils"

// Dedupes the lookup between generateMetadata and the page render.
const getJob = cache(getJobById)

type JobPageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { id } = await params
  const job = await getJob(id)

  return {
    title: job ? `${job.title} at ${job.company}` : "Job Details",
    description: job
      ? `${job.title} — ${job.company} | ${formatCompensation(job)}`
      : "Job details page",
  }
}

export default async function JobDetailsPage({ params }: JobPageProps) {
  const { id } = await params
  const job = await getJob(id)

  if (!job) {
    notFound()
  }

  const experience = job.qualifications
    .split("\n")
    .find((line) => /\d+\s*\+?\s*years/i.test(line))
    ?.match(/\d+/)?.[0]
  const experienceYears = experience ? `${experience}+ Years` : "3+ Years"

  const salary = formatCompensation(job)
  const location = job.isRemote ? `Remote (${job.location})` : job.location

  const session = await getSession()
  const userId = session?.user?.id ?? null
  const alreadyApplied = userId ? await hasApplied(userId, job.id) : false

  let applyLimitReached = false
  if (userId && !alreadyApplied) {
    const [used, unlocked] = await Promise.all([
      countApplicationsForUser(userId),
      hasApplyUnlock(userId),
    ])
    applyLimitReached = used >= APPLY_LIMIT && !unlocked
  }

  return (
    <div className="min-h-svh bg-[#08080a] text-[#ededef]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <article
          className={cn(
            "mb-6 rounded-2xl border border-white/[0.08] bg-[#0f0f13] p-5 sm:p-6",
            "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)]"
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex -space-x-2 sm:-space-x-3">
              <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#141418]">
                <Building2
                  className="size-5 text-[#a0a0ab]"
                  strokeWidth={1.4}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h1 className="text-[24px] leading-7 font-semibold tracking-tight text-[#ededef] sm:text-[32px]">
                  {job.title}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-md border border-[#22c55e]/30 bg-[#22c55e]/10 px-2 py-0.5 text-[11px] font-medium text-[#22c55e]">
                  Verified Employer
                </span>
              </div>
              <p className="text-[14px] leading-5 text-[#a0a0ab]">
                {job.company} • {job.category}
              </p>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                aria-label="Bookmark"
                className="shrink-0 rounded-lg p-2.5 text-[#a0a0ab] transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <Bookmark className="size-5" strokeWidth={1.6} />
              </button>
              <ApplyButton
                jobId={job.id}
                applied={alreadyApplied}
                signedIn={Boolean(userId)}
                limitReached={applyLimitReached}
              />
            </div>
          </div>

          {/* Info cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoCard
              label="SALARY RANGE"
              value={salary}
              icon={Clock}
              iconColor="text-[#22c55e]"
            />
            <InfoCard
              label="LOCATION"
              value={location}
              icon={MapPin}
              iconColor="text-[#a0a0ab]"
            />
            <InfoCard
              label="JOB TYPE"
              value={job.type}
              icon={Briefcase}
              iconColor="text-[#a0a0ab]"
            />
            <InfoCard
              label="EXPERIENCE"
              value={experienceYears}
              icon={Briefcase}
              iconColor="text-[#f59e0b]"
            />
          </div>
        </article>

        {/* Description + Company Overview */}
        <div className="grid gap-6 gap-x-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-white/[0.08] bg-[#0f0f13] p-5 sm:p-6">
              <h2 className="mb-4 text-[18px] leading-6 font-semibold text-[#ededef]">
                Job Description
              </h2>
              <p className="text-[14px] leading-7 text-[#c6c6ce]">
                {job.responsibilities}
              </p>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0f0f13] p-5 sm:p-6">
              <h2 className="mb-4 text-[18px] leading-6 font-semibold text-[#ededef]">
                Responsibilities
              </h2>
              <ul className="space-y-3 text-[14px] leading-7 text-[#c6c6ce]">
                {job.responsibilities
                  .split("\n")
                  .filter(Boolean)
                  .map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 shrink-0 text-[#5c53fe]">•</span>
                      {item}
                    </li>
                  ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0f0f13] p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-[18px] leading-6 font-semibold text-[#ededef]">
                  Requirements
                </h2>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {job.qualifications
                  .split("\n")
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((item, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-[#141418] px-2.5 py-1 text-[11px] font-medium text-[#a0a0ab]"
                    >
                      {item.replace(/^•\s*/, "")}
                    </span>
                  ))}
              </div>
              <ul className="space-y-3 text-[14px] leading-7 text-[#c6c6ce]">
                {job.qualifications
                  .split("\n")
                  .filter(Boolean)
                  .map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 shrink-0 text-[#5c53fe]">•</span>
                      {item}
                    </li>
                  ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0f0f13] p-5 sm:p-6">
              <h2 className="mb-4 text-[18px] leading-6 font-semibold text-[#ededef]">
                Benefits
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <BenefitItem label="Full Health & Dental" />
                <BenefitItem label="Competitive 401k" />
                <BenefitItem label="Latest Hardware Stipend" />
                <BenefitItem label="Unlimited PTO" />
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-1">
            <CompanyOverview />
          </aside>
        </div>
      </main>
    </div>
  )
}

function InfoCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  iconColor: string
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#141418] p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#1a1a1f]">
          <Icon className={`size-4 ${iconColor}`} strokeWidth={1.4} />
        </div>
        <p className="text-[11px] leading-4 font-medium text-[#a0a0ab] uppercase">
          {label}
        </p>
      </div>
      <p className="text-[14px] leading-5 font-semibold text-[#ededef]">
        {value}
      </p>
    </div>
  )
}

function BenefitItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#141418] p-3">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-[#1a1a1f]">
        <CheckIcon className="size-3.5 text-[#22c55e]" strokeWidth={1.4} />
      </div>
      <span className="text-[13px] leading-5 text-[#c6c6ce]">{label}</span>
    </div>
  )
}

function CheckIcon({
  className,
  strokeWidth,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CompanyOverview() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0f0f13] p-5 sm:p-6">
      <h2 className="mb-4 text-[18px] leading-6 font-semibold text-[#ededef]">
        Company Overview
      </h2>

      <div className="mb-4 aspect-video overflow-hidden rounded-xl border border-white/[0.08] bg-[#141418]">
        <div className="flex h-full items-center justify-center text-[#6e6e78]">
          <Building2
            className="mx-auto size-12 text-current"
            strokeWidth={1.2}
          />
        </div>
      </div>

      <dl className="space-y-3 text-[13px] leading-5">
        <div className="flex justify-between">
          <dt className="text-[#a0a0ab]">SIZE</dt>
          <dd className="text-[#ededef]">250 - 500 Employees</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[#a0a0ab]">INDUSTRY</dt>
          <dd className="text-[#ededef]">SaaS / Artificial Intelligence</dd>
        </div>
      </dl>

      <button
        type="button"
        className="mt-4 w-full rounded-lg border border-white/[0.08] bg-[#141418] px-4 py-2 text-[13px] font-medium text-[#a0a0ab] transition-colors hover:bg-white/[0.03]"
      >
        Visit Website
      </button>
    </section>
  )
}
