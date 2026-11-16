import { Suspense } from "react"
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
        <Suspense
          fallback={
            <p className="py-20 text-center text-[13px] text-[#a0a0ab]">
              Loading jobs…
            </p>
          }
        >
          <BrowseJobs standalone />
        </Suspense>
      </main>
    </div>
  )
}
