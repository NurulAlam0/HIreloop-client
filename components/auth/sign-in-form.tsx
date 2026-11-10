"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react"

import { signIn } from "@/lib/auth-client"

export function SignInForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const data = new FormData(event.currentTarget)
    const email = String(data.get("email") ?? "").trim()
    const password = String(data.get("password") ?? "")

    if (!email || !password) {
      setError("Enter your email and password to continue.")
      return
    }

    setPending(true)
    try {
      const result = await signIn.email({ email, password })
      if (result.error) {
        setError(result.error.message ?? "Those credentials didn't work.")
        return
      }
      router.push("/")
    } catch {
      setError("We couldn't reach the server. Please try again in a moment.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <h1 className="text-center text-[28px] leading-tight font-bold tracking-[-0.015em] text-[#f4f4f8] sm:text-[32px]">
        Welcome back
      </h1>
      <p className="mt-2.5 text-center text-[13.5px] text-[#8f909e] sm:text-[15px]">
        Sign in to pick up where you left off.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 space-y-5">
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[13px] font-semibold text-[#d3d4de]"
            >
              Password
            </label>
            <Link
              href="/sign-in"
              className="text-[12px] font-medium text-[#8f909e] transition-colors hover:text-white"
            >
              Forgot password?
            </Link>
          </div>
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
              autoComplete="current-password"
              placeholder="Your password"
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

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#f7f8ff] to-[#dcdef1] text-[15px] font-semibold text-[#0b0b13] shadow-[0_0_0_1px_rgba(92,83,254,0.35),0_20px_44px_-20px_rgba(92,83,254,0.85)] transition hover:from-white hover:to-[#eaecff] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending && (
            <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />
          )}
          {pending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-7 text-center text-[13px] text-[#8f909e]">
        New to HireLoop?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-white transition-colors hover:text-[#b9b2ff]"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
