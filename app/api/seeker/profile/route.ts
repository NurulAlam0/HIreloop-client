import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import {
  removeSeekerProfileFile,
  saveSeekerProfileFile,
  updateSeekerProfile,
  type SeekerProfileFileKind,
} from "@/lib/seeker-profile"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_SKILLS = 30

async function currentUserId() {
  const session = await auth.api.getSession({ headers: await headers() })

  return session?.user?.id ?? null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function validateProfile(value: unknown) {
  if (!isRecord(value)) return null

  const { headline, bio, skills } = value
  if (
    typeof headline !== "string" ||
    headline.length > 120 ||
    typeof bio !== "string" ||
    bio.length > 2000 ||
    !Array.isArray(skills) ||
    skills.length > MAX_SKILLS ||
    !skills.every(
      (skill) =>
        typeof skill === "string" &&
        skill.trim().length > 0 &&
        skill.length <= 40
    )
  ) {
    return null
  }

  const uniqueSkills = [
    ...new Map(
      skills.map((skill) => [skill.trim().toLowerCase(), skill.trim()])
    ).values(),
  ]

  return {
    headline: headline.trim(),
    bio: bio.trim(),
    skills: uniqueSkills,
  }
}

function fileKind(value: unknown): SeekerProfileFileKind | null {
  return value === "avatar" || value === "resume" ? value : null
}

function isAllowedFile(kind: SeekerProfileFileKind, file: File, data: Buffer) {
  if (kind === "avatar") {
    const typeByExtension: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    }

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    if (file.size > MAX_FILE_SIZE || typeByExtension[extension] !== file.type) {
      return false
    }

    if (file.type === "image/jpeg") {
      return data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff
    }
    if (file.type === "image/png") {
      return data
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    }

    return (
      data.subarray(0, 6).toString("ascii") === "GIF87a" ||
      data.subarray(0, 6).toString("ascii") === "GIF89a"
    )
  }

  const typeByExtension: Record<string, string> = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  }

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
  if (file.size > MAX_FILE_SIZE || typeByExtension[extension] !== file.type) {
    return false
  }
  if (file.type === "application/pdf") {
    return data.subarray(0, 5).toString("ascii") === "%PDF-"
  }
  if (file.type === "application/msword") {
    return data
      .subarray(0, 8)
      .equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
  }

  return (
    data[0] === 0x50 && data[1] === 0x4b && data[2] === 0x03 && data[3] === 0x04
  )
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
      { error: "Please enter a valid headline, bio, and skills list." },
      { status: 400 }
    )
  }

  try {
    const updated = await updateSeekerProfile(userId, profile)

    return NextResponse.json({ profile: updated })
  } catch (error) {
    console.error("Failed to update seeker profile", error)

    return NextResponse.json(
      { error: "Could not save your professional details." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const userId = await currentUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > MAX_FILE_SIZE + 64 * 1024) {
    return NextResponse.json(
      { error: "Files must be 5 MB or smaller." },
      { status: 413 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: "Please choose a valid file to upload." },
      { status: 400 }
    )
  }

  const kind = fileKind(formData.get("kind"))
  const file = formData.get("file")
  if (!kind || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Please choose a valid file to upload." },
      { status: 400 }
    )
  }
  try {
    const data = Buffer.from(await file.arrayBuffer())
    if (file.size === 0 || !isAllowedFile(kind, file, data)) {
      return NextResponse.json(
        {
          error:
            kind === "avatar"
              ? "Choose a JPG, PNG, or GIF image up to 5 MB."
              : "Choose a PDF, DOC, or DOCX resume up to 5 MB.",
        },
        { status: 400 }
      )
    }

    const saved = await saveSeekerProfileFile(userId, kind, {
      name: file.name.slice(0, 180),
      size: file.size,
      contentType: file.type,
      updatedAt: new Date(),
      data,
    })

    return NextResponse.json({ file: saved })
  } catch (error) {
    console.error(`Failed to upload seeker ${kind}`, error)

    return NextResponse.json(
      { error: `Could not upload your ${kind}. Please try again.` },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
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

  const kind = isRecord(payload) ? fileKind(payload.kind) : null
  if (!kind) {
    return NextResponse.json({ error: "Invalid file type." }, { status: 400 })
  }

  try {
    await removeSeekerProfileFile(userId, kind)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(`Failed to remove seeker ${kind}`, error)

    return NextResponse.json(
      { error: `Could not remove your ${kind}. Please try again.` },
      { status: 500 }
    )
  }
}
