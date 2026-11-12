"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Globe,
  LoaderCircle,
  MapPin,
} from "lucide-react"

import {
  DEFAULT_JOB_FREQUENCY,
  DEFAULT_JOB_TYPE,
  JOB_FREQUENCIES,
  JOB_TYPES,
  formatDeadlineInput,
  type JobDTO,
  type JobType,
} from "@/lib/job-types"
import { cn } from "@/lib/utils"

const CATEGORY_OPTIONS = [
  "Engineering & Tech",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
]

const FIELD_CLASS =
  "h-12 w-full rounded-lg border border-white/[0.07] bg-[#141418] px-4 text-[14px] leading-5 text-[#ededef] outline-none transition placeholder:text-[#828997] focus:border-[#5c53fe]/60 focus:ring-2 focus:ring-[#5c53fe]/15"

const TEXTAREA_CLASS =
  "min-h-[96px] w-full resize-y rounded-lg border border-white/[0.07] bg-[#141418] px-4 py-3 text-[14px] leading-[22px] text-[#ededef] outline-none transition placeholder:text-[#828997] focus:border-[#5c53fe]/60 focus:ring-2 focus:ring-[#5c53fe]/15"

const INVALID_CLASS =
  "border-[#ef4444]/60 focus:border-[#ef4444]/70 focus:ring-[#ef4444]/15"

const LABEL_CLASS = "text-[13px] leading-5 font-medium text-[#ededef]"

type FieldErrors = Record<string, string>

function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-1 text-[#8f88ff]">
      *
    </span>
  )
}

function FieldLabel({
  htmlFor,
  children,
  required,
  hint,
}: {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={htmlFor} className={LABEL_CLASS}>
        {children}
        {required && <RequiredMark />}
      </label>
      {hint}
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null
  }

  return (
    <p id={`${id}-error`} className="text-[12px] leading-4 text-[#f87171]">
      {message}
    </p>
  )
}

function StepMarker() {
  return (
    <span
      aria-hidden="true"
      className="grid size-[17px] shrink-0 place-items-center rounded-full border-2 border-[#5c53fe] bg-[#5c53fe]/15"
    >
      <span className="size-[6px] rounded-full bg-[#5c53fe]" />
    </span>
  )
}

function SectionHeading({
  step,
  title,
}: {
  step: number
  title: string
}) {
  return (
    <h2 className="flex items-center gap-2.5 text-[16px] leading-6 font-medium tracking-[-0.01em] text-[#ededef]">
      <StepMarker />
      {step}. {title}
    </h2>
  )
}

export function PostJobForm({ job }: { job?: JobDTO }) {
  const router = useRouter()
  const isEdit = Boolean(job)

  const [jobType, setJobType] = useState<JobType>(job?.type ?? DEFAULT_JOB_TYPE)
  const [isRemote, setIsRemote] = useState(job?.isRemote ?? true)
  const [pending, setPending] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const categories =
    job && !CATEGORY_OPTIONS.includes(job.category)
      ? [job.category, ...CATEGORY_OPTIONS]
      : CATEGORY_OPTIONS

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const payload = {
      title: String(formData.get("jobTitle") ?? ""),
      company: String(formData.get("companyName") ?? ""),
      category: String(formData.get("jobCategory") ?? ""),
      type: jobType,
      isRemote,
      location: String(formData.get("location") ?? ""),
      deadline: String(formData.get("deadline") ?? ""),
      minSalary: String(formData.get("minSalary") ?? ""),
      maxSalary: String(formData.get("maxSalary") ?? ""),
      frequency: String(formData.get("frequency") ?? ""),
      responsibilities: String(formData.get("responsibilities") ?? ""),
      qualifications: String(formData.get("qualifications") ?? ""),
    }

    setPending(true)
    setFieldErrors({})
    setFormError(null)

    try {
      const endpoint = job ? `/api/jobs/${job.id}` : "/api/jobs"
      const response = await fetch(endpoint, {
        method: job ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await response.json().catch(() => null)) as
        | { error?: string; fieldErrors?: FieldErrors }
        | null

      if (!response.ok) {
        setFieldErrors(data?.fieldErrors ?? {})
        setFormError(
          data?.error ?? "Something went wrong. Please try again.",
        )
        return
      }

      router.push("/dashboard/recruiter/manage-jobs")
      router.refresh()
    } catch {
      setFormError("Network error. Please check your connection and try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="p-4 pb-16 sm:px-6 sm:pt-6 lg:px-8 lg:pt-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-[13px] leading-5"
      >
        <span className="text-[#a0a0ab]">Manage Jobs</span>
        <ChevronRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-[#6e6e78]"
          strokeWidth={2}
        />
        <span className="text-[#ededef]">
          {isEdit ? "Edit Listing" : "Create New Listing"}
        </span>
      </nav>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-[34px] leading-[42px] font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[40px] sm:leading-[48px]">
            {isEdit ? "Edit Job Post" : "Post a New Job"}
          </h1>
          <p className="mt-2 text-[14px] leading-5 text-[#a0a0ab]">
            {isEdit
              ? "Update the position details and keep your listing accurate for applicants."
              : "Fill in the position specifications to attract qualified talent across our network."}
          </p>
        </div>

        <button
          type="submit"
          form="post-job-form"
          disabled={pending}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#5c53fe] px-6 text-[14px] leading-5 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(92,83,254,0.9)] transition-colors hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
                strokeWidth={2}
              />
              {isEdit ? "Saving…" : "Publishing…"}
            </>
          ) : (
            <>
              {isEdit ? "Update Job" : "Publish Job"}
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={2}
              />
            </>
          )}
        </button>
      </div>

      <div className="mt-6 border-t border-white/[0.07]" />

      {formError && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-[13px] leading-5 text-[#f87171]"
        >
          {formError}
        </div>
      )}

      <form
        id="post-job-form"
        onSubmit={handleSubmit}
        className="mt-12 space-y-14"
      >
        {/* 1. Basic Information */}
        <section className="space-y-5">
          <SectionHeading step={1} title="Basic Information" />

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="job-title" required>
              Job Title
            </FieldLabel>
            <input
              id="job-title"
              name="jobTitle"
              defaultValue={job?.title ?? "Frontend Developer"}
              aria-invalid={Boolean(fieldErrors.title)}
              aria-describedby={fieldErrors.title ? "job-title-error" : undefined}
              className={cn(FIELD_CLASS, fieldErrors.title && INVALID_CLASS)}
            />
            <FieldError id="job-title" message={fieldErrors.title} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="company-name" required>
                Company Name
              </FieldLabel>
              <div className="relative">
                <Building2
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#a0a0ab]"
                  strokeWidth={1.7}
                />
                <input
                  id="company-name"
                  name="companyName"
                  defaultValue={job?.company ?? "HirePulse Network"}
                  aria-invalid={Boolean(fieldErrors.company)}
                  aria-describedby={
                    fieldErrors.company ? "company-name-error" : undefined
                  }
                  className={cn(
                    FIELD_CLASS,
                    "pl-10",
                    fieldErrors.company && INVALID_CLASS,
                  )}
                />
              </div>
              <FieldError id="company-name" message={fieldErrors.company} />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="job-category" required>
                Job Category
              </FieldLabel>
              <div className="relative">
                <select
                  id="job-category"
                  name="jobCategory"
                  defaultValue={job?.category ?? "Engineering & Tech"}
                  aria-invalid={Boolean(fieldErrors.category)}
                  aria-describedby={
                    fieldErrors.category ? "job-category-error" : undefined
                  }
                  className={cn(
                    FIELD_CLASS,
                    "appearance-none pr-10",
                    fieldErrors.category && INVALID_CLASS,
                  )}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#a0a0ab]"
                  strokeWidth={1.8}
                />
              </div>
              <FieldError id="job-category" message={fieldErrors.category} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className={LABEL_CLASS}>
              Job Type
              <RequiredMark />
            </span>
            <div
              role="radiogroup"
              aria-label="Job Type"
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4"
            >
              {JOB_TYPES.map((type) => {
                const active = jobType === type
                return (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setJobType(type)}
                    className={cn(
                      "h-10 rounded-lg border text-[14px] leading-5 font-medium transition-colors",
                      active
                        ? "border-[#5c53fe]/70 bg-[#5c53fe]/12 text-[#ededef]"
                        : "border-white/[0.07] bg-[#141418] text-[#a0a0ab] hover:bg-[#1a1a1f] hover:text-[#ededef]",
                    )}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
            {fieldErrors.type && (
              <p className="text-[12px] leading-4 text-[#f87171]">
                {fieldErrors.type}
              </p>
            )}
          </div>
        </section>

        {/* 2. Location, Compensation & Timeline */}
        <section className="space-y-5">
          <SectionHeading
            step={2}
            title="Location, Compensation & Timeline"
          />

          <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-[#141418] px-5 py-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#222228]">
              <Globe
                aria-hidden="true"
                className="size-[18px] text-[#e5e2e3]"
                strokeWidth={1.6}
              />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] leading-5 font-medium text-[#ededef]">
                Remote Work Allowed (isRemote)
              </p>
              <p className="text-[12.5px] leading-[18px] text-[#a0a0ab]">
                Enable worldwide or distributed candidate applications
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isRemote}
              aria-label="Remote work allowed"
              onClick={() => setIsRemote((value) => !value)}
              className={cn(
                "relative ml-auto h-6 w-11 shrink-0 rounded-full border border-white/[0.08] transition-colors",
                isRemote ? "bg-[#2a2a33]" : "bg-[#141418]",
              )}
            >
              <span
                className={cn(
                  "absolute top-1/2 size-[18px] -translate-y-1/2 rounded-full transition-all duration-200",
                  isRemote
                    ? "right-[3px] bg-white"
                    : "left-[3px] bg-[#6e6e78]",
                )}
              />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="job-location">
                Job Location (location)
              </FieldLabel>
              <div className="relative">
                <MapPin
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#a0a0ab]"
                  strokeWidth={1.7}
                />
                <input
                  id="job-location"
                  name="location"
                  defaultValue={job?.location ?? "New York, USA"}
                  aria-invalid={Boolean(fieldErrors.location)}
                  aria-describedby={
                    fieldErrors.location ? "job-location-error" : undefined
                  }
                  className={cn(
                    FIELD_CLASS,
                    "pl-10",
                    fieldErrors.location && INVALID_CLASS,
                  )}
                />
              </div>
              <FieldError id="job-location" message={fieldErrors.location} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[11px] leading-4 font-medium tracking-[0.02em] text-[#6e6e78]">
                  Required
                </span>
                <label htmlFor="application-deadline" className={LABEL_CLASS}>
                  Application Deadline (deadline)
                </label>
              </div>
              <div className="relative">
                <CalendarDays
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#a0a0ab]"
                  strokeWidth={1.7}
                />
                <input
                  id="application-deadline"
                  name="deadline"
                  defaultValue={
                    job?.deadline
                      ? formatDeadlineInput(job.deadline)
                      : "05/30/2025"
                  }
                  inputMode="numeric"
                  placeholder="MM/DD/YYYY"
                  aria-invalid={Boolean(fieldErrors.deadline)}
                  aria-describedby={
                    fieldErrors.deadline
                      ? "application-deadline-error"
                      : undefined
                  }
                  className={cn(
                    FIELD_CLASS,
                    "pl-10",
                    fieldErrors.deadline && INVALID_CLASS,
                  )}
                />
              </div>
              <FieldError
                id="application-deadline"
                message={fieldErrors.deadline}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="min-salary">Min Salary / Rate</FieldLabel>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[14px] leading-5 text-[#a0a0ab]"
                >
                  €
                </span>
                <input
                  id="min-salary"
                  name="minSalary"
                  defaultValue={String(job?.minSalary ?? 25)}
                  inputMode="numeric"
                  aria-invalid={Boolean(fieldErrors.minSalary)}
                  aria-describedby={
                    fieldErrors.minSalary ? "min-salary-error" : undefined
                  }
                  className={cn(
                    FIELD_CLASS,
                    "pl-8",
                    fieldErrors.minSalary && INVALID_CLASS,
                  )}
                />
              </div>
              <FieldError id="min-salary" message={fieldErrors.minSalary} />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="max-salary">Max Salary / Rate</FieldLabel>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[14px] leading-5 text-[#a0a0ab]"
                >
                  €
                </span>
                <input
                  id="max-salary"
                  name="maxSalary"
                  defaultValue={String(job?.maxSalary ?? 40)}
                  inputMode="numeric"
                  aria-invalid={Boolean(fieldErrors.maxSalary)}
                  aria-describedby={
                    fieldErrors.maxSalary ? "max-salary-error" : undefined
                  }
                  className={cn(
                    FIELD_CLASS,
                    "pl-8",
                    fieldErrors.maxSalary && INVALID_CLASS,
                  )}
                />
              </div>
              <FieldError id="max-salary" message={fieldErrors.maxSalary} />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="salary-frequency">Frequency</FieldLabel>
              <div className="relative">
                <select
                  id="salary-frequency"
                  name="frequency"
                  defaultValue={job?.frequency ?? DEFAULT_JOB_FREQUENCY}
                  aria-invalid={Boolean(fieldErrors.frequency)}
                  aria-describedby={
                    fieldErrors.frequency ? "salary-frequency-error" : undefined
                  }
                  className={cn(
                    FIELD_CLASS,
                    "appearance-none pr-10",
                    fieldErrors.frequency && INVALID_CLASS,
                  )}
                >
                  {JOB_FREQUENCIES.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#a0a0ab]"
                  strokeWidth={1.8}
                />
              </div>
              <FieldError
                id="salary-frequency"
                message={fieldErrors.frequency}
              />
            </div>
          </div>
        </section>

        {/* 3. Responsibilities & Requirements */}
        <section className="space-y-5">
          <SectionHeading step={3} title="Responsibilities & Requirements" />

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="responsibilities" required>
              Key Responsibilities
            </FieldLabel>
            <textarea
              id="responsibilities"
              name="responsibilities"
              rows={3}
              defaultValue={
                job?.responsibilities ??
                "Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."
              }
              aria-invalid={Boolean(fieldErrors.responsibilities)}
              aria-describedby={
                fieldErrors.responsibilities
                  ? "responsibilities-error"
                  : undefined
              }
              className={cn(
                TEXTAREA_CLASS,
                fieldErrors.responsibilities && INVALID_CLASS,
              )}
            />
            <FieldError
              id="responsibilities"
              message={fieldErrors.responsibilities}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="qualifications" required>
              Qualifications &amp; Requirements
            </FieldLabel>
            <textarea
              id="qualifications"
              name="qualifications"
              rows={3}
              defaultValue={
                job?.qualifications ??
                "• 3+ years of experience with React, TypeScript, and modern state architectures\n• Solid understanding of DOM performance and component-driven designs\n• Experience partnering closely with product teams and UI/UX designers"
              }
              aria-invalid={Boolean(fieldErrors.qualifications)}
              aria-describedby={
                fieldErrors.qualifications ? "qualifications-error" : undefined
              }
              className={cn(
                TEXTAREA_CLASS,
                fieldErrors.qualifications && INVALID_CLASS,
              )}
            />
            <FieldError
              id="qualifications"
              message={fieldErrors.qualifications}
            />
          </div>
        </section>
      </form>
    </div>
  )
}
