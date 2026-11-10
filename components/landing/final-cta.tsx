import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Planet } from "@/components/landing/planet"

export function FinalCta() {
  return (
    <section className="relative overflow-hidden pt-16 pb-0">
      <div
        aria-hidden="true"
        className="starfield pointer-events-none absolute inset-0 opacity-40"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl leading-tight font-bold tracking-tight text-balance sm:text-6xl">
          Your next role is
          <br className="hidden sm:block" /> already looking for you
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/sign-up" />}
            className="w-full rounded-full bg-white px-6 text-black hover:bg-white/90 sm:w-auto"
          >
            Create free account
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="#pricing" />}
            className="w-full rounded-full border-white/20 bg-transparent px-6 hover:bg-white/[0.05] sm:w-auto"
          >
            View pricing
          </Button>
        </div>
      </div>

      {/* Planet horizon */}
      <div className="relative mt-14 h-[240px] w-full overflow-hidden sm:h-[320px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[-90px] mx-auto h-[220px] w-[82%] rounded-[50%] bg-primary/25 blur-3xl"
        />
        <Planet className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#060609]" />
      </div>
    </section>
  )
}
