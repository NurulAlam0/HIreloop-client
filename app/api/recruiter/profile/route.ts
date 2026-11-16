import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  COMPANY_SIZE_OPTIONS,
  updateRecruiterProfile,
  type RecruiterProfile,
} from "@/lib/recruiter-profile"

const LIMITS = {
  companyName: 120,
  website: 200,
  industry: 80,
  companySize: 60,
  location: 120,
  about: 2000,
} as const

async function currentUserId() {
  const session = await auth.api.getSession({ headers: await headers() })

  return session?.user?.id ?? null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function optionalString(value: unknown, max: number): string | null {
  if (typeof value !== "string" || value.length > max) {
    return null
  }

  return value.trim()
}

function validateProfile(value: unknown): RecruiterProfile | null {
  if (!isRecord(value)) return null

  // Company name is the one required field — everything else is optional.
  const companyName = optionalString(value.companyName, LIMITS.companyName)
  if (!companyName) return null

  const website = optionalString(value.website, LIMITS.website)
  const industry = optionalString(value.industry, LIMITS.industry)
  const companySize = optionalString(value.companySize, LIMITS.companySize)
  const location = optionalString(value.location, LIMITS.location)
  const about = optionalString(value.about, LIMITS.about)

  if (
    website === null ||
    industry === null ||
    companySize === null ||
    location === null ||
    about === null
  ) {
    return null
  }

  // Company size is a fixed select — allow empty or one of the options.
  if (
    companySize !== "" &&
    !COMPANY_SIZE_OPTIONS.some((size) => size === companySize)
  ) {
    return null
  }

  return { companyName, website, industry, companySize, location, about }
}

export async function PATCH(request: Request) {
  const userId = await currentUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    )
  }

  const profile = validateProfile(payload)
  if (!profile) {
    return NextResponse.json(
      { error: "Please enter a valid company name and details." },
      { status: 400 }
    )
  }

  try {
    const updated = await updateRecruiterProfile(userId, profile)

    return NextResponse.json({ profile: updated })
  } catch (error) {
    console.error("Failed to update recruiter profile", error)

    return NextResponse.json(
      { error: "Could not save your company profile." },
      { status: 500 }
    )
  }
}
