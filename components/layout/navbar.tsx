"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, MenuIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/#company" },
  { label: "Pricing", href: "/#pricing" },
]

export function Logo({
  className,
  imgClassName,
}: {
  className?: string
  imgClassName?: string
}) {
  return (
    <Link
      href="/"
      aria-label="HireLoop home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/hireloop-logo.png"
        alt="HireLoop"
        width={206}
        height={66}
        priority
        className={cn("h-8 w-auto sm:h-10 lg:h-[52px]", imgClassName)}
      />
    </Link>
  )
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const { data: session, isPending } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const isJobsPage = pathname === "/jobs"

  const user = session?.user
  const initial =
    user?.name?.trim().charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "?"

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      setMobileOpen(false)
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md",
        isJobsPage ? "bg-[#08080a]/95" : "bg-[#222225]/95"
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between gap-6 px-5 sm:px-8",
          isJobsPage
            ? "h-16 max-w-[832px] lg:px-0"
            : "max-w-[1680px] lg:h-24 lg:px-12 xl:pr-16 xl:pl-24"
        )}
      >
        {/* Brand */}
        <Logo imgClassName={isJobsPage ? "h-7 sm:h-7 lg:h-7" : undefined} />

        <div className="flex items-center md:gap-8 lg:gap-10">
          {/* Desktop links */}
          <nav
            aria-label="Main navigation"
            className={cn(
              "hidden items-center md:flex",
              isJobsPage ? "gap-5" : "gap-8 lg:gap-10"
            )}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                aria-current={
                  link.label === "Browse Jobs" && isJobsPage
                    ? "page"
                    : undefined
                }
                className={cn(
                  "text-[15px] font-medium transition-colors hover:text-white",
                  isJobsPage
                    ? link.label === "Browse Jobs"
                      ? "text-[#f4f4f5] underline underline-offset-4"
                      : "text-[#c6c6ce]"
                    : "text-[#c6c6ce]"
                )}
              >
                {link.label}
              </Link>
            ))}
            <span aria-hidden="true" className="mx-1 h-6 w-px bg-white/15" />
          </nav>

          {/* Actions */}
          <div
            className={cn(
              "flex items-center gap-2 md:gap-4",
              isJobsPage ? "lg:gap-5" : "lg:gap-7"
            )}
          >
            {isPending ? (
              <span
                aria-hidden="true"
                className="hidden size-11 animate-pulse rounded-full bg-white/10 md:block"
              />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  title={user.name}
                  aria-label={`Open dashboard for ${user.name}`}
                  className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8079ff] to-[#4a42d8] text-[16px] font-semibold text-white ring-1 ring-white/15 transition hover:brightness-110 md:inline-flex"
                >
                  {initial}
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="hidden gap-2 px-0 text-[15px] font-medium text-[#c6c6ce] hover:bg-transparent hover:text-white disabled:opacity-60 md:inline-flex"
                >
                  <LogOut className="size-4" strokeWidth={1.8} />
                  {signingOut ? "Signing out…" : "Sign Out"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  nativeButton={false}
                  className={cn(
                    "hidden px-0 text-[15px] font-medium text-[#c6c6ce] hover:bg-transparent hover:text-white md:inline-flex",
                    isJobsPage && "text-[13px]"
                  )}
                  render={<Link href="/sign-in" />}
                >
                  Sign In
                </Button>
                <Button
                  nativeButton={false}
                  className={cn(
                    "hidden h-11 rounded-xl bg-[#5c53fe] px-5 text-[14px] font-medium text-white hover:bg-[#6a62ff] md:inline-flex lg:h-[52px] lg:px-6",
                    isJobsPage &&
                      "h-9 rounded-md px-4 text-[13px] lg:h-9 lg:px-4"
                  )}
                  render={<Link href="/sign-up" />}
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="max-w-85vw w-80 gap-0 border-l border-white/10 bg-[#0c0c10]"
          showCloseButton
        >
          <SheetHeader className="border-b border-white/10 px-4 pb-4">
            <SheetTitle className="sr-only">HireLoop navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Main site navigation
            </SheetDescription>
            <Logo />
          </SheetHeader>
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 p-4"
          >
            {NAV_LINKS.map((link) => (
              <SheetClose
                key={link.label}
                nativeButton={false}
                render={<Link href={link.href} />}
              >
                <span className="text-foreground block rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-white/5">
                  {link.label}
                </span>
              </SheetClose>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 border-t border-white/10 p-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8079ff] to-[#4a42d8] text-[15px] font-semibold text-white ring-1 ring-white/15">
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#8f909e]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="h-11 rounded-xl bg-[#5c53fe] text-white hover:bg-[#6a62ff] disabled:opacity-60"
                >
                  <LogOut className="size-4" strokeWidth={1.8} />
                  {signingOut ? "Signing out…" : "Sign Out"}
                </Button>
              </>
            ) : (
              <>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/sign-in"
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "text-[#c6c6ce]"
                      )}
                    />
                  }
                >
                  Sign In
                </SheetClose>
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/sign-up"
                      className={cn(
                        buttonVariants(),
                        "h-11 rounded-xl bg-[#5c53fe] text-white hover:bg-[#6a62ff]"
                      )}
                    />
                  }
                >
                  Get Started
                </SheetClose>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
