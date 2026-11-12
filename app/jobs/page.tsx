import type { Metadata } from "next"

import { BrowseJobs } from "@/components/landing/browse-jobs"
import { Navbar } from "@/components/layout/navbar"

export const metadata: Metadata = {
  title: "Browse Jobs",
  description: "Search professional jobs and discover your next opportunity.",
}

export default function JobsPage() {
  return (
    <div className="min-h-svh bg-[#08080a]">
      <Navbar />
      <main>
        <BrowseJobs standalone />
      </main>
    </div>
  )
}
