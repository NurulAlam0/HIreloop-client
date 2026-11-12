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
import { cn } from "@/lib/utils"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Recruiter Dashboard",
}

const APPLICATIONS: {
  name: string
  role: string
  date: string
  experience: string
  status: string
  tone: PillTone
}[] = [
  {
    name: "Julianne Moore",
    role: "Senior Product Designer",
    date: "Oct 24, 2023",
    experience: "6 years",
    status: "Interviewing",
    tone: "violet",
  },
  {
    name: "Robert Downey",
    role: "Backend Engineer",
    date: "Oct 23, 2023",
    experience: "4 years",
    status: "New",
    tone: "blue",
  },
  {
    name: "Emma Stone",
    role: "Marketing Lead",
    date: "Oct 22, 2023",
    experience: "8 years",
    status: "Reviewing",
    tone: "amber",
  },
  {
    name: "Chris Pratt",
    role: "Product Manager",
    date: "Oct 21, 2023",
    experience: "5 years",
    status: "Rejected",
    tone: "red",
  },
]

export default async function RecruiterDashboardPage() {
  const session = await getSession()
  const recruiterName = session?.user?.name?.trim() || "there"

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
              href="/dashboard/recruiter"
              className="text-[13px] leading-5 text-[#ededef] transition-colors hover:text-white"
            >
              View all
            </Link>
          }
        />

        <div className={cn(CARD_CLASS, "mt-6 overflow-hidden")}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <colgroup>
                <col />
                <col className="w-[200px]" />
                <col className="w-[116px]" />
                <col className="w-[96px]" />
                <col className="w-[120px]" />
              </colgroup>
              <thead>
                <tr className="bg-[#1a1a1f]">
                  <th scope="col" className={TH_CLASS}>
                    Candidate Name
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Role
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Date Applied
                  </th>
                  <th scope="col" className={cn(TH_CLASS, "text-center")}>
                    Experience
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {APPLICATIONS.map((application) => (
                  <tr
                    key={application.name}
                    className="h-16 border-t border-white/[0.07] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <InitialAvatar name={application.name} />
                        <span className="text-[13px] leading-5 font-medium whitespace-nowrap text-[#ededef]">
                          {application.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]">
                      {application.role}
                    </td>
                    <td className="px-4 text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]">
                      {application.date}
                    </td>
                    <td className="px-4 text-center text-[13px] leading-5 whitespace-nowrap text-[#a0a0ab]">
                      {application.experience}
                    </td>
                    <td className="px-4">
                      <StatusPill tone={application.tone}>
                        {application.status}
                      </StatusPill>
                    </td>
                  </tr>
                ))}
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
