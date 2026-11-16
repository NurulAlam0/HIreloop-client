"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Check, LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type ApplyButtonProps = {
  jobId: string
  applied: boolean
  signedIn: boolean
  limitReached: boolean
}

export function ApplyButton({
  jobId,
  applied: initialApplied,
  signedIn,
  limitReached,
}: ApplyButtonProps) {
  const router = useRouter()
  const [applied, setApplied] = useState(initialApplied)
  const [pending, setPending] = useState(false)
  const [locked, setLocked] = useState(limitReached)
  const [error, setError] = useState<string | null>(null)

  const signInPath = `/sign-in?next=${encodeURIComponent(`/jobs/${jobId}`)}`

  async function handleApply() {
    if (applied || pending || locked) return

    if (!signedIn) {
      router.push(signInPath)
      return
    }

    setError(null)
    setPending(true)

    try {
      const response = await fetch("/api/seeker/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })

      if (response.status === 401) {
        router.push(signInPath)
        return
      }

      // Free tier exhausted (stale page or a race) — switch to the pay CTA.
      if (response.status === 402) {
        setLocked(true)
        return
      }

      const payload = (await response.json().catch(() => null)) as {
        error?: string
      } | null

      if (!response.ok) {
        setError(
          payload?.error ?? "Could not submit your application. Try again."
        )
        return
      }

      setApplied(true)
    } catch {
      setError("We couldn't reach the server. Try again.")
    } finally {
      setPending(false)
    }
  }

  if (locked && !applied) {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <Link
          href="/#pricing"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f59e0b] px-5 py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#fbbf24]"
        >
          Add to Cart
        </Link>
        <p className="max-w-[240px] text-right text-[12px] leading-4 text-[#a0a0ab]">
          All 10 free applications used.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={handleApply}
        disabled={applied || pending}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-semibold transition-colors disabled:cursor-default",
          applied
            ? "border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#4ade80]"
            : "bg-[#5c53fe] text-white shadow-[0_10px_20px_-8px_rgba(92,83,254,0.8)] hover:bg-[#6a62ff] disabled:opacity-70"
        )}
      >
        {pending ? (
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        ) : applied ? (
          <Check aria-hidden="true" className="size-4" strokeWidth={2.5} />
        ) : null}
        {pending ? "Applying…" : applied ? "Applied" : "Apply Now"}
      </button>

      {applied && (
        <Link
          href="/dashboard/seeker/applications"
          className="text-[12px] leading-4 font-medium text-[#a0a0ab] transition-colors hover:text-white"
        >
          View in My Applications →
        </Link>
      )}

      {error && (
        <p
          role="alert"
          className="max-w-[240px] text-right text-[12px] leading-4 text-[#f87171]"
        >
          {error}
        </p>
      )}
    </div>
  )
}
