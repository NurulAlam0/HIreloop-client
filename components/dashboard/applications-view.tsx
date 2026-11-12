"use client"

import { useMemo, useState } from "react"
import {
  Activity,
  BarChart3,
  Boxes,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Cloud,
  Code2,
  Cpu,
  Database,
  Download,
  Layers,
  LayoutDashboard,
  Palette,
  PenTool,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
  Terminal,
  type LucideIcon,
} from "lucide-react"

import { CARD_CLASS } from "@/components/dashboard/primitives"
import { cn } from "@/lib/utils"

type ApplicationStatus =
  | "Applied"
  | "Review"
  | "Shortlisted"
  | "Rejected"
  | "Offered"

type Application = {
  id: string
  title: string
  company: string
  employment: string
  location: string
  applied: string
  status: ApplicationStatus
  icon: LucideIcon
  tileClassName?: string
}

const ACTIVE_APPLICATIONS: Application[] = [
  {
    id: "stark-frontend",
    title: "Senior Frontend Engineer",
    company: "Stark Industries",
    employment: "Full-time",
    location: "Remote",
    applied: "2 hours ago",
    status: "Applied",
    icon: Code2,
  },
  {
    id: "cyberdyne-product-designer",
    title: "Product Designer",
    company: "Cyberdyne Systems",
    employment: "Contract",
    location: "Hybrid",
    applied: "1 day ago",
    status: "Review",
    icon: Rocket,
  },
  {
    id: "wayne-data-scientist",
    title: "Lead Data Scientist",
    company: "Wayne Enterprises",
    employment: "Full-time",
    location: "On-site",
    applied: "4 days ago",
    status: "Shortlisted",
    icon: Database,
  },
  {
    id: "oscorp-cloud-architect",
    title: "Cloud Architect",
    company: "Oscorp Tech",
    employment: "Full-time",
    location: "Remote",
    applied: "1 week ago",
    status: "Rejected",
    icon: Cloud,
    tileClassName: "bg-[#b91c1c]",
  },
  {
    id: "hooli-ai-researcher",
    title: "AI Research Engineer",
    company: "Hooli Corp",
    employment: "Full-time",
    location: "Hybrid",
    applied: "2 weeks ago",
    status: "Offered",
    icon: Cpu,
  },
  {
    id: "initech-backend",
    title: "Backend Engineer",
    company: "Initech",
    employment: "Full-time",
    location: "Remote",
    applied: "2 weeks ago",
    status: "Applied",
    icon: Server,
  },
  {
    id: "umbrella-ux-researcher",
    title: "UX Researcher",
    company: "Umbrella Labs",
    employment: "Contract",
    location: "Remote",
    applied: "3 weeks ago",
    status: "Shortlisted",
    icon: LayoutDashboard,
  },
  {
    id: "globex-platform",
    title: "Platform Engineer",
    company: "Globex",
    employment: "Full-time",
    location: "On-site",
    applied: "3 weeks ago",
    status: "Review",
    icon: Layers,
  },
  {
    id: "soylent-mobile",
    title: "Mobile Engineer",
    company: "Soylent",
    employment: "Full-time",
    location: "Hybrid",
    applied: "1 month ago",
    status: "Applied",
    icon: Smartphone,
  },
  {
    id: "vandelay-data-analyst",
    title: "Data Analyst",
    company: "Vandelay Industries",
    employment: "Full-time",
    location: "Remote",
    applied: "1 month ago",
    status: "Rejected",
    icon: BarChart3,
  },
  {
    id: "acme-devops",
    title: "DevOps Engineer",
    company: "Acme Corp",
    employment: "Full-time",
    location: "Remote",
    applied: "1 month ago",
    status: "Shortlisted",
    icon: Terminal,
  },
  {
    id: "massive-ml-engineer",
    title: "Machine Learning Engineer",
    company: "Massive Dynamic",
    employment: "Full-time",
    location: "On-site",
    applied: "1 month ago",
    status: "Applied",
    icon: BrainCircuit,
  },
  {
    id: "piedpiper-fullstack",
    title: "Full Stack Developer",
    company: "Pied Piper",
    employment: "Contract",
    location: "Hybrid",
    applied: "2 months ago",
    status: "Review",
    icon: Code2,
  },
  {
    id: "wonka-product-manager",
    title: "Product Manager",
    company: "Wonka Industries",
    employment: "Full-time",
    location: "Hybrid",
    applied: "2 months ago",
    status: "Shortlisted",
    icon: ClipboardList,
  },
  {
    id: "tyrell-security",
    title: "Security Engineer",
    company: "Tyrell Corp",
    employment: "Full-time",
    location: "On-site",
    applied: "2 months ago",
    status: "Offered",
    icon: ShieldCheck,
  },
  {
    id: "cybertek-sre",
    title: "Site Reliability Engineer",
    company: "Cybertek",
    employment: "Full-time",
    location: "Remote",
    applied: "3 months ago",
    status: "Rejected",
    icon: Activity,
  },
  {
    id: "nakatomi-frontend",
    title: "Frontend Developer",
    company: "Nakatomi Trading",
    employment: "Contract",
    location: "Remote",
    applied: "3 months ago",
    status: "Applied",
    icon: Code2,
  },
  {
    id: "bluesun-data-engineer",
    title: "Data Engineer",
    company: "Blue Sun",
    employment: "Full-time",
    location: "Remote",
    applied: "3 months ago",
    status: "Shortlisted",
    icon: Database,
  },
  {
    id: "weyland-architect",
    title: "Systems Architect",
    company: "Weyland-Yutani",
    employment: "Full-time",
    location: "Hybrid",
    applied: "4 months ago",
    status: "Review",
    icon: Boxes,
  },
  {
    id: "sterling-brand-designer",
    title: "Brand Designer",
    company: "Sterling Cooper",
    employment: "Contract",
    location: "Remote",
    applied: "4 months ago",
    status: "Applied",
    icon: Palette,
  },
  {
    id: "dunder-qa",
    title: "QA Engineer",
    company: "Dunder Mifflin",
    employment: "Full-time",
    location: "On-site",
    applied: "5 months ago",
    status: "Rejected",
    icon: ClipboardCheck,
  },
  {
    id: "waynetech-ios",
    title: "iOS Engineer",
    company: "Wayne Tech",
    employment: "Full-time",
    location: "Hybrid",
    applied: "5 months ago",
    status: "Shortlisted",
    icon: Smartphone,
  },
  {
    id: "oscorp-mlops",
    title: "ML Ops Engineer",
    company: "Oscorp Biotech",
    employment: "Full-time",
    location: "Remote",
    applied: "6 months ago",
    status: "Applied",
    icon: Cpu,
  },
  {
    id: "stark-staff-designer",
    title: "Staff Product Designer",
    company: "Stark Labs",
    employment: "Full-time",
    location: "Remote",
    applied: "6 months ago",
    status: "Shortlisted",
    icon: PenTool,
  },
]

const ARCHIVED_APPLICATIONS: Application[] = [
  {
    id: "archived-northwind-frontend",
    title: "Frontend Engineer",
    company: "Northwind Traders",
    employment: "Full-time",
    location: "Remote",
    applied: "7 months ago",
    status: "Rejected",
    icon: Code2,
  },
  {
    id: "archived-gringotts-analyst",
    title: "Financial Analyst",
    company: "Gringotts",
    employment: "Full-time",
    location: "On-site",
    applied: "8 months ago",
    status: "Rejected",
    icon: BarChart3,
  },
  {
    id: "archived-tyrell-ux",
    title: "UX Designer",
    company: "Tyrell Corp",
    employment: "Contract",
    location: "Hybrid",
    applied: "8 months ago",
    status: "Offered",
    icon: PenTool,
  },
  {
    id: "archived-monarch-pm",
    title: "Product Manager",
    company: "Monarch Sciences",
    employment: "Full-time",
    location: "On-site",
    applied: "9 months ago",
    status: "Rejected",
    icon: ClipboardList,
  },
  {
    id: "archived-cyberdyne-ml",
    title: "ML Engineer",
    company: "Cyberdyne Systems",
    employment: "Full-time",
    location: "Hybrid",
    applied: "10 months ago",
    status: "Applied",
    icon: BrainCircuit,
  },
  {
    id: "archived-abstergo-backend",
    title: "Backend Developer",
    company: "Abstergo",
    employment: "Contract",
    location: "Remote",
    applied: "11 months ago",
    status: "Rejected",
    icon: Server,
  },
  {
    id: "archived-hooli-data",
    title: "Data Scientist",
    company: "Hooli Corp",
    employment: "Full-time",
    location: "On-site",
    applied: "1 year ago",
    status: "Offered",
    icon: Database,
  },
  {
    id: "archived-virtucon-cloud",
    title: "Cloud Consultant",
    company: "Virtucon",
    employment: "Contract",
    location: "Remote",
    applied: "1 year ago",
    status: "Rejected",
    icon: Cloud,
  },
]

const PAGE_SIZE = 5

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "border-white/10 bg-white/[0.06] text-[#b4b4bc]",
  Review: "border-[#f59e0b]/25 bg-[#f59e0b]/10 text-[#f59e0b]",
  Shortlisted: "border-[#60a5fa]/25 bg-[#60a5fa]/10 text-[#60a5fa]",
  Rejected: "border-[#ef4444]/25 bg-[#ef4444]/10 text-[#ef4444]",
  Offered: "border-[#22c55e]/25 bg-[#22c55e]/10 text-[#22c55e]",
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-full border px-2.5 text-[12px] leading-4 font-medium whitespace-nowrap",
        STATUS_STYLES[status],
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
        "flex h-[84px] flex-col justify-center gap-0.5 px-5 sm:px-6",
      )}
    >
      <p className="text-[13px] leading-5 text-[#a0a0ab]">{label}</p>
      <p
        className={cn(
          "text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]",
          valueClassName,
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
              : "text-[#a0a0ab] hover:bg-white/[0.06] hover:text-white",
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

export function ApplicationsView() {
  const [tab, setTab] = useState<"active" | "archived">("active")
  const [page, setPage] = useState(1)

  const applications =
    tab === "active" ? ACTIVE_APPLICATIONS : ARCHIVED_APPLICATIONS

  const totalPages = Math.max(1, Math.ceil(applications.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const rows = useMemo(
    () =>
      applications.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [applications, currentPage],
  )

  const start = applications.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const end = Math.min(currentPage * PAGE_SIZE, applications.length)

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
                    : "text-[#a0a0ab] hover:text-[#ededef]",
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
        <SummaryCard label="Total Applied" value="24" />
        <SummaryCard label="Shortlisted" value="8" />
        <SummaryCard label="Interviews" value="3" />
        <SummaryCard
          label="Success Rate"
          value="12%"
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
              {rows.map((application) => {
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
                            application.tileClassName,
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
                      <button
                        type="button"
                        title="Coming soon"
                        className="text-[13px] leading-5 font-medium text-[#c4c7c8] transition-colors hover:text-white"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

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
      </div>
    </div>
  )
}
