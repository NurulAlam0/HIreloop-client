import { ObjectId, type WithId } from "mongodb"

import { getDb } from "@/lib/db"
import { hasApplyUnlock } from "@/lib/payments"

export const APPLICATION_STATUSES = [
  "Applied",
  "Review",
  "Interview",
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

/* -------------------------------------------------------------------------- */
/*                               Recruiter view                               */
/* -------------------------------------------------------------------------- */

export type RecruiterApplicationDTO = {
  id: string
  jobId: string
  jobTitle: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  status: ApplicationStatus
  createdAt: string
}

/** ObjectIds of every job the recruiter owns (empty array when none). */
async function jobIdsForOwner(ownerId: string): Promise<ObjectId[]> {
  const db = await getDb()

  return db
    .collection("jobs")
    .find({ ownerId }, { projection: { _id: 1 } })
    .toArray()
    .then((docs) => docs.map((doc) => doc._id))
}

/**
 * Applications to the recruiter's jobs, newest first, with the applicant's
 * name/email joined in from the auth `user` collection (applications only
 * snapshot the job fields, not the seeker).
 */
export async function getApplicationsForRecruiter(
  ownerId: string
): Promise<RecruiterApplicationDTO[]> {
  const jobIds = await jobIdsForOwner(ownerId)

  if (jobIds.length === 0) {
    return []
  }

  const docs = await (
    await collection()
  )
    .find({ jobId: { $in: jobIds } })
    .sort({ createdAt: -1 })
    .toArray()

  if (docs.length === 0) {
    return []
  }

  // `user._id` is an ObjectId in Mongo while applications store it as a
  // string — match both shapes so either representation joins cleanly.
  const userIds = [...new Set(docs.map((doc) => doc.userId))]
  const idValues = userIds.flatMap((id) =>
    ObjectId.isValid(id) ? [new ObjectId(id), id] : [id]
  )

  const db = await getDb()
  const users = await db
    .collection<{
      _id: ObjectId | string
      name?: unknown
      email?: unknown
    }>("user")
    .find({ _id: { $in: idValues } }, { projection: { name: 1, email: 1 } })
    .toArray()

  const byId = new Map(users.map((user) => [String(user._id), user]))

  return docs.map((doc) => {
    const user = byId.get(doc.userId)

    return {
      id: doc._id.toString(),
      jobId: doc.jobId.toString(),
      jobTitle: doc.title,
      applicantId: doc.userId,
      applicantName:
        (typeof user?.name === "string" && user.name.trim()) ||
        (typeof user?.email === "string" && user.email.trim()) ||
        "Unknown applicant",
      applicantEmail: typeof user?.email === "string" ? user.email : "",
      status: doc.status,
      createdAt: doc.createdAt.toISOString(),
    }
  })
}

/**
 * Updates an application's status — only when the application's job belongs
 * to `ownerId`. Returns null for a missing application or someone else's job.
 */
export async function updateApplicationStatusForRecruiter(
  applicationId: string,
  ownerId: string,
  status: ApplicationStatus
): Promise<ApplicationDTO | null> {
  if (!ObjectId.isValid(applicationId)) {
    return null
  }

  const id = new ObjectId(applicationId)
  const jobIds = await jobIdsForOwner(ownerId)

  const result = await (
    await collection()
  ).updateOne(
    { _id: id, jobId: { $in: jobIds } },
    { $set: { status, updatedAt: new Date() } }
  )

  if (result.matchedCount === 0) {
    return null
  }

  const doc = await (await collection()).findOne({ _id: id })

  return doc ? toDTO(doc) : null
}
