import Link from "next/link"

import { Logo } from "@/components/layout/navbar"

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "#browse-jobs" },
      { label: "Pricing", href: "#pricing" },
      { label: "AI Compass", href: "#features" },
      { label: "Companies", href: "#companies" },
      { label: "Sign in", href: "/sign-in" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "#help" },
      { label: "Contact", href: "#contact" },
      { label: "Careers", href: "#company" },
      { label: "Submit a job", href: "#submit-job" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Terms of Service", href: "#terms" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Cookies", href: "#cookies" },
    ],
  },
]

const SOCIALS = [
  { label: "Facebook", href: "#facebook", path: "M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.17 2.1 15.95 2 14.66 2 11.97 2 10 3.66 10 6.7v2.8H7v4h3V22h4v-8.5Z" },
  { label: "Instagram", href: "#instagram", path: "M12 2c2.72 0 3.06.01 4.12.06 1.07.05 1.8.22 2.43.47.66.25 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.63.42 1.36.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.07-.22 1.8-.47 2.43-.25.66-.6 1.22-1.15 1.77-.55.55-1.11.9-1.77 1.15-.63.25-1.36.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.07-.05-1.8-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.63-.42-1.36-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.07.22-1.8.47-2.43A4.9 4.9 0 0 1 3.68 3.68 4.9 4.9 0 0 1 5.45 2.53c.63-.25 1.36-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.98.04-1.5.2-1.86.35-.47.18-.8.4-1.15.74-.35.35-.56.68-.74 1.15-.14.35-.3.88-.35 1.86-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.98.2 1.5.35 1.86.18.47.4.8.74 1.15.35.35.68.56 1.15.74.35.14.88.3 1.86.35 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.98-.04 1.5-.2 1.86-.35.47-.18.8-.4 1.15-.74.35-.35.56-.68.74-1.15.14-.35.3-.88.35-1.86.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.98-.2-1.5-.35-1.86a3.1 3.1 0 0 0-.74-1.15 3.1 3.1 0 0 0-1.15-.74c-.35-.14-.88-.3-1.86-.35C14.99 3.81 14.67 3.8 12 3.8Zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28Zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68Zm5.34-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" },
  { label: "LinkedIn", href: "#linkedin", path: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060609]">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col items-start gap-4">
            <Logo imgClassName="h-10" />
            <p className="max-w-64 text-sm leading-relaxed text-muted-foreground">
              The AI-native career platform built for the next generation of
              ambitious professionals.
            </p>
            <div className="mt-2 flex items-center gap-2">
              {SOCIALS.map(({ label, href, path }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-full border border-white/10 text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-3.5 fill-current"
                  >
                    <path d={path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>Copyright 2026 — HireLoop Inc.</p>
          <div className="flex items-center gap-5">
            <Link href="#terms" className="transition-colors hover:text-foreground">
              Terms &amp; Privacy
            </Link>
            <Link href="#privacy" className="transition-colors hover:text-foreground">
              Privacy Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
