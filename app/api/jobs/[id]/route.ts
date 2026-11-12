import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  deleteJob,
  updateJob,
  updateJobStatus,
  validateJobInput,
} from "@/lib/jobs"
import type { JobStatus } from "@/lib/job-types"

async function currentUserId() {
  const session = await auth.api.getSession({ headers: await headers() })

  return session?.user?.id ?? null
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await currentUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    )
  }

  const body = (payload ?? {}) as Record<string, unknown>

  // Status-only updates (close / reopen) come from the row action menu.
  if (body.status === "active" || body.status === "closed") {
    try {
      const job = await updateJobStatus(id, userId, body.status as JobStatus)

      if (!job) {
        return NextResponse.json({ error: "Job not found." }, { status: 404 })
      }

      return NextResponse.json({ job })
    } catch (error) {
      console.error("Failed to update job status", error)

      return NextResponse.json(
        { error: "Could not update this job post." },
        { status: 500 },
      )
    }
  }

  const { data, errors } = validateJobInput(payload)

  if (!data) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fieldErrors: errors },
      { status: 400 },
    )
  }

  try {
    const job = await updateJob(id, userId, data)

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 })
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error("Failed to update job", error)

    return NextResponse.json(
      { error: "Could not save this job post." },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await currentUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const deleted = await deleteJob(id, userId)

    if (!deleted) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete job", error)

    return NextResponse.json(
      { error: "Could not delete this job post." },
      { status: 500 }
    )
  }
}
