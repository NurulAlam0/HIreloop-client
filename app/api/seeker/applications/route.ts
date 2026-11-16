import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { applyForJob, getApplicationsForUser } from "@/lib/applications"
import { auth } from "@/lib/auth"

async function currentUserId() {
  const session = await auth.api.getSession({ headers: await headers() })

  return session?.user?.id ?? null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export async function GET() {
  const userId = await currentUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const applications = await getApplicationsForUser(userId)

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Failed to load applications", error)

    return NextResponse.json(
      { error: "Could not load your applications." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const userId = await currentUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
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

  if (!isRecord(payload) || typeof payload.jobId !== "string") {
    return NextResponse.json(
      { error: "A job id is required." },
      { status: 400 }
    )
  }

  try {
    const result = await applyForJob(userId, payload.jobId)

    if (!result.ok) {
      if (result.reason === "limit-reached") {
        return NextResponse.json(
          {
            code: "apply-limit",
            error:
              "You've used all 10 free applications. Pay $20 to unlock unlimited applies.",
          },
          { status: 402 }
        )
      }

      const invalid = result.reason === "invalid-job"

      return NextResponse.json(
        {
          error: invalid
            ? "That job id is not valid."
            : "This job is no longer available.",
        },
        { status: invalid ? 400 : 404 }
      )
    }

    return NextResponse.json(
      {
        application: result.application,
        alreadyApplied: result.alreadyApplied,
      },
      { status: result.alreadyApplied ? 200 : 201 }
    )
  } catch (error) {
    console.error("Failed to create application", error)

    return NextResponse.json(
      { error: "Could not submit your application." },
      { status: 500 }
    )
  }
}
