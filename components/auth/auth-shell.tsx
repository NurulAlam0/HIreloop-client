import { Logo } from "@/components/layout/navbar"

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-[#07070a]">
      {/* ambient light behind the card */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-360px] left-1/2 h-[720px] w-[1040px] -translate-x-1/2 rounded-full bg-[#5c53fe]/20 blur-[150px]" />
        <div className="absolute top-[220px] left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-[#3a2f9c]/15 blur-[140px]" />
        <div className="starfield absolute inset-0 opacity-20" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#07070a] to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center px-4 py-12 sm:px-6 sm:py-14">
        <Logo imgClassName="h-14 sm:h-14 lg:h-16" />

        <div className="relative mt-12 w-full max-w-[604px] rounded-[26px] border border-white/[0.06] bg-[#0c0c12]/90 p-6 shadow-[0_50px_130px_-40px_rgba(0,0,0,0.95),0_0_90px_-40px_rgba(92,83,254,0.35)] backdrop-blur-xl sm:mt-14 sm:p-9">
          {/* faint top edge highlight inside the card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          {children}
        </div>
      </div>
    </main>
  )
}
