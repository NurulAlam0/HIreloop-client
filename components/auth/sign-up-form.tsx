"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  ShieldUser,
  UserRound,
  Users,
} from "lucide-react"

import { signUp } from "@/lib/auth-client"
import { DASHBOARD_ROUTES } from "@/lib/dashboard"
import { cn } from "@/lib/utils"

const ROLES = [
  { id: "job-seeker", label: "Job Seeker", icon: Users },
  { id: "recruiter", label: "Recruiter", icon: UserRound },
  { id: "admin", label: "Admin", icon: ShieldUser },
] as const

type RoleId = (typeof ROLES)[number]["id"]

export function SignUpForm() {
  const router = useRouter()
  const [role, setRole] = useState<RoleId>("job-seeker")
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const data = new FormData(event.currentTarget)
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const password = String(data.get("password") ?? "")

    if (!name || !email || !password) {
      setError("Please fill in every field.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setPending(true)
    try {
      const result = await signUp.email({ name, email, password, role })
      if (result.error) {
        setError(
          result.error.message ??
            "We couldn't create your account. Please try again.",
        )
        return
      }
      router.push(DASHBOARD_ROUTES[role])
    } catch {
      setError("We couldn't reach the server. Please try again in a moment.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <h1 className="text-center text-[28px] leading-tight font-bold tracking-[-0.015em] text-[#f4f4f8] sm:text-[32px]">
        Create your account
      </h1>
      <p className="mt-2.5 text-center text-[13.5px] text-[#8f909e] sm:text-[15px]">
        Three minutes to set up. Matches start arriving today.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 sm:mt-9">
        <p className="text-[13px] font-semibold text-[#d3d4de]">
          Joining HireLoop as
        </p>

        <div
          role="group"
          aria-label="Choose the account type"
          className="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3"
        >
          {ROLES.map((option) => {
            const active = role === option.id
            const Icon = option.icon
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => setRole(option.id)}
                className={cn(
                  "flex h-[64px] flex-col items-center justify-center gap-1.5 rounded-xl border text-[12px] font-semibold transition-colors sm:h-[68px] sm:text-[13px]",
                  active
                    ? "border-[#5c53fe]/70 bg-[#5c53fe]/12 text-white shadow-[0_0_0_1px_rgba(92,83,254,0.35),0_16px_36px_-22px_rgba(92,83,254,0.95)]"
                    : "border-white/[0.07] bg-[#111116] text-[#9b9caa] hover:border-white/15 hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    active ? "text-[#b7b1ff]" : "text-[#8e8f9d]",
                  )}
                  strokeWidth={1.8}
                />
                {option.label}
              </button>
            )
          })}
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="text-[13px] font-semibold text-[#d3d4de]"
            >
              Full name
            </label>
            <div className="relative mt-2">
              <UserRound
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#7d7e8c]"
                strokeWidth={1.8}
              />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#101016] pr-4 pl-10 text-[14px] text-white transition outline-none placeholder:text-[#676875] focus:border-[#5c53fe]/60 focus:ring-2 focus:ring-[#5c53fe]/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-[13px] font-semibold text-[#d3d4de]"
            >
              Email address
            </label>
            <div className="relative mt-2">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#7d7e8c]"
                strokeWidth={1.8}
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#101016] pr-4 pl-10 text-[14px] text-white transition outline-none placeholder:text-[#676875] focus:border-[#5c53fe]/60 focus:ring-2 focus:ring-[#5c53fe]/20"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-[13px] font-semibold text-[#d3d4de]"
            >
              Password
            </label>
            <div className="relative mt-2">
              <Lock
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#7d7e8c]"
                strokeWidth={1.8}
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#101016] pr-11 pl-10 text-[14px] text-white transition outline-none placeholder:text-[#676875] focus:border-[#5c53fe]/60 focus:ring-2 focus:ring-[#5c53fe]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-2.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8e8f9d] transition-colors hover:bg-white/5 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="size-4" strokeWidth={1.8} />
                ) : (
                  <Eye className="size-4" strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#f7f8ff] to-[#dcdef1] text-[15px] font-semibold text-[#0b0b13] shadow-[0_0_0_1px_rgba(92,83,254,0.35),0_20px_44px_-20px_rgba(92,83,254,0.85)] transition hover:from-white hover:to-[#eaecff] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending && (
            <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />
          )}
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-7 text-center text-[13px] text-[#8f909e]">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-white transition-colors hover:text-[#b9b2ff]"
        >
          Sign In
        </Link>
      </p>
    </div>
  )
}
