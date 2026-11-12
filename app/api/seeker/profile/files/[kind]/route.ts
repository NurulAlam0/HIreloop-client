import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  getSeekerProfileFile,
  type SeekerProfileFileKind,
} from "@/lib/seeker-profile"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { kind: value } = await params
  if (value !== "avatar" && value !== "resume") {
    return NextResponse.json({ error: "File not found." }, { status: 404 })
  }
  const kind: SeekerProfileFileKind = value

  try {
    const file = await getSeekerProfileFile(session.user.id, kind)
    if (!file) {
      return NextResponse.json({ error: "File not found." }, { status: 404 })
    }

    const headers = new Headers({
      "Content-Type": file.contentType,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    })
    if (kind === "resume") {
      headers.set(
        "Content-Disposition",
        `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`
      )
    }

    return new Response(new Uint8Array(file.data), { headers })
  } catch (error) {
    console.error(`Failed to load seeker ${kind}`, error)

    return NextResponse.json(
      { error: `Could not load your ${kind}.` },
      { status: 500 }
    )
  }
}
