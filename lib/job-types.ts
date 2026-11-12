export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const

export type JobType = (typeof JOB_TYPES)[number]

export const JOB_FREQUENCIES = [
  "per hour",
  "per day",
  "per month",
  "per year",
] as const

export type JobFrequency = (typeof JOB_FREQUENCIES)[number]

export type JobStatus = "active" | "closed"

export type JobDTO = {
  id: string
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
  applicants: number
  status: JobStatus
  createdAt: string
  updatedAt: string
}

export const DEFAULT_JOB_TYPE: JobType = "Full-time"
export const DEFAULT_JOB_FREQUENCY: JobFrequency = "per hour"

const FREQUENCY_SUFFIX: Record<JobFrequency, string> = {
  "per hour": "/ hr",
  "per day": "/ day",
  "per month": "/ mo",
  "per year": "/ yr",
}

function formatAmount(value: number, frequency: JobFrequency) {
  if (frequency === "per year" && value >= 1000) {
    return `€${Math.round(value / 1000)}k`
  }

  return `€${value.toLocaleString("en-US")}`
}

export function formatCompensation(
  job: Pick<JobDTO, "minSalary" | "maxSalary" | "frequency">,
) {
  return `${formatAmount(job.minSalary, job.frequency)} – ${formatAmount(
    job.maxSalary,
    job.frequency,
  )} ${FREQUENCY_SUFFIX[job.frequency]}`
}

const deadlineFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function formatDeadline(deadline: string) {
  return deadlineFormatter.format(new Date(`${deadline}T00:00:00Z`))
}

/** Converts a stored `YYYY-MM-DD` date into the `MM/DD/YYYY` form value. */
export function formatDeadlineInput(deadline: string) {
  const [year, month, day] = deadline.split("-")

  if (!year || !month || !day) {
    return ""
  }

  return `${month}/${day}/${year}`
}

export function getDisplayStatus(
  job: Pick<JobDTO, "deadline" | "status">,
): "Active" | "Expired" | "Closed" {
  if (job.status === "closed") {
    return "Closed"
  }

  const end = new Date(`${job.deadline}T23:59:59Z`)

  return end.getTime() < Date.now() ? "Expired" : "Active"
}

export function formatPosted(createdAt: string) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000),
  )

  if (days === 0) {
    return "Posted today"
  }

  if (days < 7) {
    return `Posted ${days}d ago`
  }

  return `Posted ${Math.floor(days / 7)}w ago`
}
