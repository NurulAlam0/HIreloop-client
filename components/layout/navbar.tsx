"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  { label: "Browse Jobs", href: "#browse-jobs" },
  { label: "Company", href: "#company" },
  { label: "Pricing", href: "#pricing" },
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
  const router = useRouter()

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
    <header className="sticky top-0 z-50 w-full bg-[#222225]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] w-full max-w-[1680px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-24 lg:px-12 xl:pr-16 xl:pl-24">
        {/* Brand */}
        <Logo />

        <div className="flex items-center md:gap-8 lg:gap-10">
          {/* Desktop links */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 md:flex lg:gap-10"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] font-medium text-[#c6c6ce] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <span aria-hidden="true" className="mx-1 h-6 w-px bg-white/15" />
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 lg:gap-7">
            {isPending ? (
              <span
                aria-hidden="true"
                className="hidden size-11 animate-pulse rounded-full bg-white/10 md:block"
              />
            ) : user ? (
              <>
                <span
                  title={user.name}
                  aria-label={`Signed in as ${user.name}`}
                  className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8079ff] to-[#4a42d8] text-[16px] font-semibold text-white ring-1 ring-white/15 md:inline-flex"
                >
                  {initial}
                </span>
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
                  className="hidden px-0 text-[15px] font-medium text-[#c6c6ce] hover:bg-transparent hover:text-white md:inline-flex"
                  render={<Link href="/sign-in" />}
                >
                  Sign In
                </Button>
                <Button
                  nativeButton={false}
                  className="hidden h-11 rounded-xl bg-[#5c53fe] px-5 text-[14px] font-medium text-white hover:bg-[#6a62ff] md:inline-flex lg:h-[52px] lg:px-6"
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
          className="w-80 max-w-85vw gap-0 border-l border-white/10 bg-[#0c0c10]"
          showCloseButton
        >
          <SheetHeader className="border-b border-white/10 px-4 pb-4">
            <SheetTitle className="sr-only">HireLoop navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Main site navigation
            </SheetDescription>
            <Logo />
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map((link) => (
              <SheetClose
                key={link.label}
                nativeButton={false}
                render={<Link href={link.href} />}
              >
                <span className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-white/5">
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
                    <p className="truncate text-sm font-semibold text-foreground">
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
                        "text-[#c6c6ce]",
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
                        "h-11 rounded-xl bg-[#5c53fe] text-white hover:bg-[#6a62ff]",
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
