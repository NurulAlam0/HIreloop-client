import { BrowseJobs } from "@/components/landing/browse-jobs"
import { Features } from "@/components/landing/features"
import { FinalCta } from "@/components/landing/final-cta"
import { Hero } from "@/components/landing/hero"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <BrowseJobs />
        <Features />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
