import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  ChartNoAxesColumn,
  FolderOpen,
  MapPin,
  Search,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Planet } from "@/components/landing/planet"
import { cn } from "@/lib/utils"

const CHIPS = ["Product Designer", "AI Engineering", "Devops Engineer"]

const STATS = [
  { icon: Briefcase, value: "50K", label: "Active Jobs" },
  { icon: ChartNoAxesColumn, value: "12K", label: "Companies" },
  { icon: FolderOpen, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

export function Eyebrow({
  children,
  dotClassName = "bg-primary",
  className,
}: {
  children: React.ReactNode
  dotClassName?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClassName)} />
      {children}
      <span className={cn("size-1.5 rounded-full", dotClassName)} />
    </span>
  )
}

function HeroBadge() {
  return (
    <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#111114]/90 py-1.5 pr-5 pl-2.5 shadow-[0_0_30px_rgba(92,83,254,0.12)] backdrop-blur sm:gap-[17px] sm:pr-8 sm:pl-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#f6b45b] to-[#c25716] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] sm:size-[26px]">
        <Briefcase className="size-3.5 text-[#3a1a05]" strokeWidth={2.75} />
      </span>
      <span className="text-[15px] font-semibold tracking-wide whitespace-nowrap text-white sm:text-[16px]">
        50,000+
      </span>
      <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-white/25" />
      <span className="text-[11px] font-medium tracking-[0.18em] whitespace-nowrap text-[#9a9aa6] uppercase sm:text-[14px] sm:tracking-[0.22em]">
        New jobs this month
      </span>
    </span>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#08080b]">
      {/* faint top wash so the header blends into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#131317] to-transparent"
      />

      <div className="relative mx-auto max-w-[1160px] px-4 pt-24 text-center sm:px-6 sm:pt-32 lg:pt-40">
        <HeroBadge />

        <h1 className="mx-auto mt-9 max-w-[900px] text-[38px] leading-[1.06] font-bold tracking-[-0.02em] text-balance text-[#f6f5fa] sm:mt-10 sm:text-[52px] lg:mt-12 lg:text-[56px]">
          Find Your Dream Job Today
        </h1>
        <p className="mx-auto mt-5 max-w-[720px] text-[15px] leading-[1.65] text-[#9c9ca7] sm:text-[20px] sm:leading-[1.6]">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* Search bar */}
        <form
          role="search"
          className="mx-auto mt-12 flex max-w-[744px] flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#131316] p-1 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)] sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3.5">
            <Search className="size-4 shrink-0 text-[#8d8d98]" strokeWidth={1.9} />
            <input
              type="text"
              name="q"
              placeholder="Job title, skill or company"
              aria-label="Job title, skill or company"
              className="h-10 w-full min-w-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-[#8d8d98]"
            />
          </div>
          <span
            aria-hidden="true"
            className="mx-1 hidden h-6 w-px bg-white/10 sm:block"
          />
          <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3.5 sm:max-w-[210px]">
            <MapPin className="size-4 shrink-0 text-[#8d8d98]" strokeWidth={1.9} />
            <input
              type="text"
              name="location"
              placeholder="Location or Remote"
              aria-label="Location or Remote"
              className="h-10 w-full min-w-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-[#8d8d98]"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            aria-label="Search jobs"
            className="h-10 w-full shrink-0 rounded-[10px] bg-[#5c53fe] text-white hover:bg-[#6a62ff] sm:w-10"
          >
            <Search className="size-4" />
          </Button>
        </form>

        {/* Trending chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-[13px] text-[#85858f]">Trending Position</span>
          {CHIPS.map((chip) => (
            <Link
              key={chip}
              href="#browse-jobs"
              className="rounded-full border border-white/[0.09] bg-white/[0.03] px-4 py-2 text-[13px] font-medium text-[#a7a7b2] transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground"
            >
              {chip}
            </Link>
          ))}
        </div>
      </div>

      {/* Globe + stats */}
      <div className="relative mt-16 sm:mt-20 lg:mt-24">
        {/* Atmosphere, stars and the planet itself sit behind the caption + stats */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] sm:h-[700px] lg:h-[800px]"
        >
          <div className="absolute inset-x-0 top-[-110px] mx-auto h-[300px] w-[88%] rounded-[50%] bg-[radial-gradient(ellipse_at_50%_55%,rgba(92,83,254,0.34),rgba(92,83,254,0.1)_45%,transparent_72%)] blur-2xl" />
          <div className="starfield absolute inset-0 opacity-90" />
          <div className="starfield absolute inset-0 scale-150 opacity-40" />
          <Planet className="absolute inset-0" imageClassName="lg:mt-[65px]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#08080b]" />
        </div>

        {/* Caption sits over the globe */}
        <div className="relative z-10 h-[300px] w-full sm:h-[400px] lg:h-[540px]">
          <p className="absolute inset-x-0 top-[31%] mx-auto max-w-[560px] px-6 text-center text-[22px] leading-[1.3] font-medium tracking-[-0.01em] text-balance text-[#f2f1f7] sm:top-[34%] sm:text-[27px] lg:top-[47.7%] lg:max-w-[660px] lg:text-[38px] lg:leading-[1.2]">
            Assisting over 15,000 job seekers find their dream positions.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-20 mx-auto -mt-[110px] grid max-w-[1322px] grid-cols-2 gap-3 px-4 sm:-mt-[140px] sm:px-6 md:grid-cols-4 lg:-mt-[146px] lg:gap-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex min-h-[170px] flex-col rounded-2xl border border-white/[0.1] bg-[#08080b] p-5 sm:min-h-[252px] sm:p-6"
            >
              <Icon
                className="size-[18px] text-[#a4a4af]"
                strokeWidth={1.6}
              />
              <div className="mt-auto pt-8">
                <p className="text-[34px] leading-none font-bold tracking-[-0.02em] text-[#f4f3f8] sm:text-[40px]">
                  {value}
                </p>
                <p className="mt-2 text-[12px] text-[#8f8f9a] sm:text-[13px]">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ApplyLink({ className }: { className?: string }) {
  return (
    <Link
      href="#apply"
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary",
        className,
      )}
    >
      Apply Now <ArrowRight className="size-3.5" />
    </Link>
  )
}
