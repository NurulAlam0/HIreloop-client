import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { getApplicationsForRecruiter } from "@/lib/applications"
import { auth } from "@/lib/auth"

async function currentUserId() {
  const session = await auth.api.getSession({ headers: await headers() })

  return session?.user?.id ?? null
}

export async function GET() {
  const userId = await currentUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const applications = await getApplicationsForRecruiter(userId)

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Failed to load recruiter applications", error)

    return NextResponse.json(
      { error: "Could not load applications." },
      { status: 500 }
    )
  }
}
