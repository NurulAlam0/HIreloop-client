import Link from "next/link"
import { ArrowUpRight, Building2, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/landing/hero"

type Job = {
  title: string
  description: string
  location: string
  type: string
  salary: string
}

const JOBS: Job[] = [
  {
    title: "Frontend Developer",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "$45–$60/hour",
  },
  {
    title: "Frontend Developer",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "$45–$60/hour",
  },
  {
    title: "Frontend Developer",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "$45–$60/hour",
  },
  {
    title: "Frontend Developer",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "$45–$60/hour",
  },
  {
    title: "Frontend Developer",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "$45–$60/hour",
  },
  {
    title: "Frontend Developer",
    description:
      "Showcase your commitment to diversity and inclusion by highlighting initiatives",
    location: "New York, USA",
    type: "Hybrid",
    salary: "$45–$60/hour",
  },
]

function JobCard({ job }: { job: Job }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-[#101017] p-5 transition-colors hover:border-white/20 sm:p-6">
      <div className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
        <ArrowUpRight className="size-4 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{job.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {job.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="size-3.5" />
          {job.type}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold text-emerald-400">{job.salary}</p>
      <div className="mt-5 border-t border-white/10 pt-4">
        <Link
          href="#apply"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
        >
          Apply Now <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  )
}

export function Discovery() {
  return (
    <section id="browse-jobs" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <Eyebrow dotClassName="bg-primary">Smart job discovery</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-xl text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
            The roles you&apos;d never find by searching
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {JOBS.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="#browse-jobs" />}
            className="rounded-full border-white/20 bg-transparent px-5"
          >
            View all job open
          </Button>
        </div>
      </div>
    </section>
  )
}
