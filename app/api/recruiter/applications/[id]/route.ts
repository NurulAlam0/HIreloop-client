import { headers } from "next/headers"
import { NextResponse } from "next/server"

import {
  APPLICATION_STATUSES,
  updateApplicationStatusForRecruiter,
} from "@/lib/applications"
import { auth } from "@/lib/auth"

type RouteContext = { params: Promise<{ id: string }> }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  const userId = session?.user?.id ?? null

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  const { id } = await params

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    )
  }

  if (!isRecord(payload) || typeof payload.status !== "string") {
    return NextResponse.json(
      { error: "A status is required." },
      { status: 400 }
    )
  }

  if (
    !APPLICATION_STATUSES.some(
      (status) => status === (payload.status as string)
    )
  ) {
    return NextResponse.json(
      { error: "Unknown application status." },
      { status: 400 }
    )
  }

  try {
    const updated = await updateApplicationStatusForRecruiter(
      id,
      userId,
      payload.status as (typeof APPLICATION_STATUSES)[number]
    )

    if (!updated) {
      // Missing application, or it belongs to another recruiter's job.
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      )
    }

    return NextResponse.json({ application: updated })
  } catch (error) {
    console.error("Failed to update application status", error)

    return NextResponse.json(
      { error: "Could not update this application." },
      { status: 500 }
    )
  }
}
