import {
  Bookmark,
  FileText,
  MousePointerClick,
  Search,
  Sparkles,
  TrendingUp,
  Trophy,
  Wallet,
} from "lucide-react"

import { Eyebrow } from "@/components/landing/hero"

const FEATURES = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
  },
  {
    icon: Wallet,
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
  },
  {
    icon: Trophy,
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
  },
  {
    icon: Bookmark,
    title: "Saved Jobs",
    description: "Manage apps & favourites on your dashboard.",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Apply",
    description: "Simplify your job applications for an easier process!",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
  },
  {
    icon: Sparkles,
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth Resources",
    description: "Boost your career with our career tips.",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="relative bg-[#141419] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <Eyebrow dotClassName="bg-sky-500">Features job</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-xl text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
            Everything you need to succeed
          </h2>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
