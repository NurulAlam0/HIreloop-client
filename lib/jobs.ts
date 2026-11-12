import { ObjectId, type WithId } from "mongodb"

import { getDb } from "@/lib/db"
import {
  JOB_FREQUENCIES,
  JOB_TYPES,
  type JobDTO,
  type JobFrequency,
  type JobStatus,
  type JobType,
} from "@/lib/job-types"

export type JobInput = {
  title: string
  company: string
  category: string
  type: JobType
  isRemote: boolean
  location: string
  deadline: string
  minSalary: number
  maxSalary: number
  frequency: JobFrequency
  responsibilities: string
  qualifications: string
}

export type JobFieldErrors = Partial<
  Record<keyof JobInput | "form", string>
>

type JobDoc = JobInput & {
  ownerId: string
  applicants: number
  status: JobStatus
  createdAt: Date
  updatedAt: Date
}

type JobDocument = WithId<JobDoc>

async function collection() {
  const db = await getDb()

  return db.collection<JobDoc>("jobs")
}

/* -------------------------------------------------------------------------- */
/*                                 Validation                                 */
/* -------------------------------------------------------------------------- */

const MAX_SHORT_TEXT = 140
const MAX_LONG_TEXT = 6000

function pad(value: number) {
  return String(value).padStart(2, "0")
}

/** Accepts both `MM/DD/YYYY` (what the form shows) and `YYYY-MM-DD`. */
export function normalizeDeadline(input: string): string | null {
  const value = input.trim()
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)

  let year: number
  let month: number
  let day: number

  if (iso) {
    year = Number(iso[1])
    month = Number(iso[2])
    day = Number(iso[3])
  } else if (us) {
    month = Number(us[1])
    day = Number(us[2])
    year = Number(us[3])
  } else {
    return null
  }

  const date = new Date(Date.UTC(year, month - 1, day))

  const valid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day

  if (!valid) {
    return null
  }

  return `${year}-${pad(month)}-${pad(day)}`
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[,\s]/g, "")

    if (!cleaned) {
      return null
    }

    const parsed = Number(cleaned)

    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

export function validateJobInput(payload: unknown): {
  data: JobInput | null
  errors: JobFieldErrors
} {
  const errors: JobFieldErrors = {}
  const body = (payload ?? {}) as Record<string, unknown>

  const text = (key: string, max = MAX_SHORT_TEXT) => {
    const value = typeof body[key] === "string" ? body[key].trim() : ""

    return value.slice(0, max)
  }

  const title = text("title")
  if (title.length < 3) {
    errors.title = "Enter a job title with at least 3 characters."
  }

  const company = text("company")
  if (!company) {
    errors.company = "Enter the company name."
  }

  const category = text("category", 80)
  if (!category) {
    errors.category = "Choose a job category."
  }

  const type = body.type
  if (!JOB_TYPES.includes(type as JobType)) {
    errors.type = "Choose a job type."
  }

  const location = text("location")
  if (!location) {
    errors.location = "Enter a job location."
  }

  const deadline = normalizeDeadline(
    typeof body.deadline === "string" ? body.deadline : "",
  )
  if (!deadline) {
    errors.deadline = "Use the MM/DD/YYYY format."
  }

  const minSalary = toNumber(body.minSalary)
  const maxSalary = toNumber(body.maxSalary)

  if (minSalary === null || minSalary < 0) {
    errors.minSalary = "Enter a valid minimum amount."
  }

  if (maxSalary === null || maxSalary < 0) {
    errors.maxSalary = "Enter a valid maximum amount."
  }

  if (
    minSalary !== null &&
    maxSalary !== null &&
    minSalary >= 0 &&
    maxSalary >= 0 &&
    maxSalary < minSalary
  ) {
    errors.maxSalary = "Maximum must be greater than or equal to the minimum."
  }

  const frequency = body.frequency
  if (!JOB_FREQUENCIES.includes(frequency as JobFrequency)) {
    errors.frequency = "Choose a pay frequency."
  }

  const responsibilities = text("responsibilities", MAX_LONG_TEXT)
  if (responsibilities.length < 10) {
    errors.responsibilities = "Describe the key responsibilities."
  }

  const qualifications = text("qualifications", MAX_LONG_TEXT)
  if (qualifications.length < 10) {
    errors.qualifications = "List the qualifications and requirements."
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors }
  }

  return {
    data: {
      title,
      company,
      category,
      type: type as JobType,
      isRemote: Boolean(body.isRemote),
      location,
      deadline: deadline as string,
      minSalary: minSalary as number,
      maxSalary: maxSalary as number,
      frequency: frequency as JobFrequency,
      responsibilities,
      qualifications,
    },
    errors,
  }
}

/* -------------------------------------------------------------------------- */
/*                                  Mapping                                   */
/* -------------------------------------------------------------------------- */

function toDTO(doc: JobDocument): JobDTO {
  return {
    id: doc._id.toString(),
    title: doc.title,
    company: doc.company,
    category: doc.category,
    type: doc.type,
    isRemote: doc.isRemote,
    location: doc.location,
    deadline: doc.deadline,
    minSalary: doc.minSalary,
    maxSalary: doc.maxSalary,
    frequency: doc.frequency,
    responsibilities: doc.responsibilities,
    qualifications: doc.qualifications,
    applicants: doc.applicants ?? 0,
    status: doc.status ?? "active",
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  }
}

function isObjectId(value: string) {
  return ObjectId.isValid(value) && value.length === 24
}

/* -------------------------------------------------------------------------- */
/*                                   Queries                                  */
/* -------------------------------------------------------------------------- */

export async function getJobsForOwner(ownerId: string): Promise<JobDTO[]> {
  const docs = await (await collection())
    .find({ ownerId })
    .sort({ createdAt: -1 })
    .toArray()

  return docs.map(toDTO)
}

export async function getJobForOwner(
  id: string,
  ownerId: string,
): Promise<JobDTO | null> {
  if (!isObjectId(id)) {
    return null
  }

  const doc = await (await collection()).findOne({
    _id: new ObjectId(id),
    ownerId,
  })

  return doc ? toDTO(doc) : null
}

export async function createJob(
  ownerId: string,
  input: JobInput,
): Promise<JobDTO> {
  const now = new Date()

  const result = await (
    await collection()
  ).insertOne({
    ...input,
    ownerId,
    applicants: 0,
    status: "active",
    createdAt: now,
    updatedAt: now,
  })

  return toDTO({
    ...input,
    _id: result.insertedId,
    ownerId,
    applicants: 0,
    status: "active",
    createdAt: now,
    updatedAt: now,
  })
}

export async function updateJob(
  id: string,
  ownerId: string,
  input: JobInput,
): Promise<JobDTO | null> {
  if (!isObjectId(id)) {
    return null
  }

  const doc = await (await collection()).findOneAndUpdate(
    { _id: new ObjectId(id), ownerId },
    { $set: { ...input, updatedAt: new Date() } },
    { returnDocument: "after" },
  )

  return doc ? toDTO(doc) : null
}

export async function updateJobStatus(
  id: string,
  ownerId: string,
  status: JobStatus,
): Promise<JobDTO | null> {
  if (!isObjectId(id)) {
    return null
  }

  const doc = await (await collection()).findOneAndUpdate(
    { _id: new ObjectId(id), ownerId },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" },
  )

  return doc ? toDTO(doc) : null
}

export async function deleteJob(id: string, ownerId: string) {
  if (!isObjectId(id)) {
    return false
  }

  const result = await (
    await collection()
  ).deleteOne({
    _id: new ObjectId(id),
    ownerId,
  })

  return result.deletedCount === 1
}

/* -------------------------------------------------------------------------- */
/*                                  Demo data                                 */
/* -------------------------------------------------------------------------- */

const DAY = 86_400_000

function isoDay(offsetDays: number) {
  return new Date(Date.now() + offsetDays * DAY).toISOString().slice(0, 10)
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * DAY)
}

const DEMO_JOBS: Array<
  Omit<JobDoc, "ownerId" | "createdAt" | "updatedAt"> & {
    createdAt: Date
    updatedAt: Date
  }
> = [
  {
    title: "Frontend Developer",
    company: "HirePulse Network",
    category: "Engineering",
    type: "Full-time",
    isRemote: true,
    location: "New York, USA",
    deadline: isoDay(45),
    minSalary: 25,
    maxSalary: 40,
    frequency: "per hour",
    responsibilities:
      "Build and maintain responsive, accessible interfaces for the HirePulse talent network. You will work with designers and backend engineers to ship polished, high-performance product experiences.",
    qualifications:
      "• 3+ years of experience with React and TypeScript\n• Solid understanding of DOM performance and component-driven design\n• Experience partnering closely with product and design teams",
    applicants: 34,
    status: "active",
    createdAt: daysAgo(40),
    updatedAt: daysAgo(2),
  },
  {
    title: "Senior Product Designer",
    company: "HirePulse Labs",
    category: "Design",
    type: "Full-time",
    isRemote: false,
    location: "London, UK",
    deadline: isoDay(75),
    minSalary: 90000,
    maxSalary: 115000,
    frequency: "per year",
    responsibilities:
      "Own end-to-end design for our hiring workflows, from discovery and prototyping to polished handoff. Partner with research and engineering to raise the quality bar across the platform.",
    qualifications:
      "• 5+ years designing complex web products\n• Strong systems thinking and interaction design craft\n• Portfolio showing measurable product impact",
    applicants: 19,
    status: "active",
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
  },
  {
    title: "DevOps Specialist",
    company: "HirePulse Platform",
    category: "Infrastructure",
    type: "Full-time",
    isRemote: false,
    location: "Berlin, Germany",
    deadline: isoDay(120),
    minSalary: 95000,
    maxSalary: 120000,
    frequency: "per year",
    responsibilities:
      "Operate and scale our cloud infrastructure, improve deployment pipelines, and keep observability and security practices current across services.",
    qualifications:
      "• Hands-on Kubernetes and Terraform experience\n• Strong scripting skills in Go or Python\n• Experience owning production reliability",
    applicants: 12,
    status: "active",
    createdAt: daysAgo(14),
    updatedAt: daysAgo(3),
  },
  {
    title: "Product Marketing Lead",
    company: "HirePulse Network",
    category: "Marketing",
    type: "Full-time",
    isRemote: true,
    location: "EU/US",
    deadline: isoDay(60),
    minSalary: 80000,
    maxSalary: 105000,
    frequency: "per year",
    responsibilities:
      "Shape positioning and go-to-market strategy for our recruiter products. Lead launches, craft messaging, and partner with sales on enablement.",
    qualifications:
      "• 4+ years in B2B product marketing\n• Strong writing and storytelling skills\n• Experience launching SaaS products",
    applicants: 27,
    status: "active",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    title: "QA Automation Engineer",
    company: "HirePulse Platform",
    category: "Quality",
    type: "Part-time",
    isRemote: false,
    location: "Dublin, Ireland",
    deadline: isoDay(-10),
    minSalary: 35,
    maxSalary: 50,
    frequency: "per hour",
    responsibilities:
      "Design and maintain automated test suites for our web platform, partner with engineers on quality gates, and triage regressions before release.",
    qualifications:
      "• Experience with Playwright or Cypress\n• Comfortable reading TypeScript\n• Strong debugging habits",
    applicants: 8,
    status: "active",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(10),
  },
]

/**
 * Gives brand-new recruiter accounts a realistic starting table (and a simple
 * way to explore update/delete). Runs at most once per account.
 */
export async function ensureDemoJobs(ownerId: string) {
  const db = await getDb()

  // Atomically claim the seed so concurrent renders can't insert twice.
  const claim = await db.collection("jobSeedState").updateOne(
    { ownerId },
    { $setOnInsert: { ownerId, seededAt: new Date() } },
    { upsert: true },
  )

  if (claim.upsertedCount === 0) {
    return
  }

  const existing = await (await collection()).countDocuments({ ownerId })

  if (existing === 0) {
    await (
      await collection()
    ).insertMany(DEMO_JOBS.map((job) => ({ ...job, ownerId })))
  }
}
