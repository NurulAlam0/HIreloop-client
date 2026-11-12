import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  createJob,
  ensureDemoJobs,
  getJobsForOwner,
  validateJobInput,
} from "@/lib/jobs"

async function currentUserId() {
  const session = await auth.api.getSession({ headers: await headers() })

  return session?.user?.id ?? null
}

export async function GET() {
  const userId = await currentUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await ensureDemoJobs(userId)
    const jobs = await getJobsForOwner(userId)

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Failed to load jobs", error)

    return NextResponse.json(
      { error: "Could not load job posts." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
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
      { status: 400 },
    )
  }

  const { data, errors } = validateJobInput(payload)

  if (!data) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fieldErrors: errors },
      { status: 400 },
    )
  }

  try {
    const job = await createJob(userId, data)

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error("Failed to create job", error)

    return NextResponse.json(
      { error: "Could not publish this job post." },
      { status: 500 },
    )
  }
}
