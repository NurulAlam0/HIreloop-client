import { Features } from "@/components/landing/features"
import { FinalCta } from "@/components/landing/final-cta"
import { Hero } from "@/components/landing/hero"
import { Pricing } from "@/components/landing/pricing"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { getSession } from "@/lib/session"

export default async function Page() {
  // Pricing "Add to Cart" needs to know whether to bounce through sign-in.
  const session = await getSession()

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing signedIn={Boolean(session)} />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
