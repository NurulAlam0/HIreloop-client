import { ObjectId, type WithId } from "mongodb"

import { getDb } from "@/lib/db"
import { hasApplyUnlock } from "@/lib/payments"

export const APPLICATION_STATUSES = [
  "Applied",
  "Review",
  "Shortlisted",
  "Rejected",
  "Offered",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

/**
 * Applications snapshot the job fields at apply time so the seeker's list
 * stays intact even if the job is edited or closed later.
 */
type ApplicationDoc = {
  userId: string
  jobId: ObjectId
  title: string
  company: string
  employment: string
  location: string
  category: string
  status: ApplicationStatus
  createdAt: Date
  updatedAt: Date
}

export type ApplicationDTO = {
  id: string
  jobId: string
  title: string
  company: string
  employment: string
  location: string
  category: string
  status: ApplicationStatus
  createdAt: string
}

async function collection() {
  const db = await getDb()

  return db.collection<ApplicationDoc>("applications")
}

/** One application per user per job; built lazily so dev restarts stay cheap. */
let indexesReady: Promise<unknown> | null = null

function ensureIndexes() {
  indexesReady ??= collection()
    .then((applications) =>
      applications.createIndex({ userId: 1, jobId: 1 }, { unique: true })
    )
    .catch((error) => {
      indexesReady = null
      console.error("Failed to index applications", error)
    })

  return indexesReady
}

function toDTO(doc: WithId<ApplicationDoc>): ApplicationDTO {
  return {
    id: doc._id.toString(),
    jobId: doc.jobId.toString(),
    title: doc.title,
    company: doc.company,
    employment: doc.employment,
    location: doc.location,
    category: doc.category,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
  }
}

function isDuplicateKey(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  )
}

/** Free applications per user before the $20 unlock is required. */
export const APPLY_LIMIT = 10

export type ApplyResult =
  | { ok: true; application: ApplicationDTO; alreadyApplied: boolean }
  | { ok: false; reason: "invalid-job" | "job-not-found" | "limit-reached" }

/**
 * Records an application for `userId` and bumps the job's applicant count
 * exactly once. Repeat calls are idempotent (`alreadyApplied: true`).
 */
export async function applyForJob(
  userId: string,
  jobId: string
): Promise<ApplyResult> {
  if (!ObjectId.isValid(jobId)) {
    return { ok: false, reason: "invalid-job" }
  }

  await ensureIndexes()

  const db = await getDb()
  const jobs = db.collection("jobs")
  const id = new ObjectId(jobId)

  const job = await jobs.findOne({ _id: id, status: { $ne: "closed" } })
  if (!job) {
    return { ok: false, reason: "job-not-found" }
  }

  const applications = await collection()

  // Free tier: APPLY_LIMIT distinct jobs, then the $20 unlock gates new
  // applications. Repeat applies stay idempotent (no existing doc → counted).
  const existing = await applications.findOne(
    { userId, jobId: id },
    { projection: { _id: 1 } }
  )
  if (!existing) {
    const [used, unlocked] = await Promise.all([
      applications.countDocuments({ userId }),
      hasApplyUnlock(userId),
    ])

    if (used >= APPLY_LIMIT && !unlocked) {
      return { ok: false, reason: "limit-reached" }
    }
  }

  const now = new Date()
  let inserted = false

  try {
    const result = await applications.updateOne(
      { userId, jobId: id },
      {
        $setOnInsert: {
          userId,
          jobId: id,
          title: job.title,
          company: job.company,
          employment: job.type,
          location: job.location,
          category: job.category,
          status: "Applied",
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true }
    )

    inserted = result.upsertedCount === 1
  } catch (error) {
    // Unique-index race: another request inserted the same application.
    if (isDuplicateKey(error)) {
      const existing = await applications.findOne({ userId, jobId: id })
      if (existing) {
        return { ok: true, application: toDTO(existing), alreadyApplied: true }
      }
    }

    throw error
  }

  if (inserted) {
    await jobs.updateOne({ _id: id }, { $inc: { applicants: 1 } })
  }

  const doc = await applications.findOne({ userId, jobId: id })
  if (!doc) {
    return { ok: false, reason: "job-not-found" }
  }

  return { ok: true, application: toDTO(doc), alreadyApplied: !inserted }
}

export async function hasApplied(
  userId: string,
  jobId: string
): Promise<boolean> {
  if (!ObjectId.isValid(jobId)) {
    return false
  }

  const doc = await (
    await collection()
  ).findOne({ userId, jobId: new ObjectId(jobId) }, { projection: { _id: 1 } })

  return Boolean(doc)
}

/** How many distinct jobs this user has applied to. */
export async function countApplicationsForUser(
  userId: string
): Promise<number> {
  return (await collection()).countDocuments({ userId })
}

/** Newest first. */
export async function getApplicationsForUser(
  userId: string
): Promise<ApplicationDTO[]> {
  const docs = await (
    await collection()
  )
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray()

  return docs.map(toDTO)
}
