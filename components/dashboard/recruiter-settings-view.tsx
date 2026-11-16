"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CARD_CLASS, InitialAvatar } from "@/components/dashboard/primitives"
import { authClient } from "@/lib/auth-client"
import type { RecruiterProfile } from "@/lib/recruiter-profile"
import { cn } from "@/lib/utils"

const INPUT_CLASS =
  "h-10 w-full rounded-lg border border-white/[0.09] bg-[#0c0c0f] px-3.5 text-[13px] leading-5 text-[#ededef] outline-none transition-colors placeholder:text-[#6e6e78] focus:border-white/25"

const LABEL_CLASS = "block text-[13px] leading-5 font-normal text-[#a0a0ab]"

const PRIMARY_BUTTON_CLASS =
  "inline-flex h-8 items-center justify-center rounded-lg bg-[#fafafa] px-4 text-[13px] leading-5 font-semibold whitespace-nowrap text-[#111318] transition-colors hover:bg-white disabled:cursor-default disabled:opacity-70"

const SECONDARY_BUTTON_CLASS =
  "inline-flex h-8 items-center justify-center rounded-lg border border-white/[0.1] bg-[#1a1a1f] px-4 text-[13px] leading-5 font-medium whitespace-nowrap text-[#d4d4d8] transition-colors hover:bg-[#202026] hover:text-white disabled:cursor-default disabled:opacity-70"

const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001+",
]

const TEXTAREA_CLASS =
  "mt-2 min-h-[112px] w-full resize-y rounded-lg border border-white/[0.1] bg-[#1a1a1f] px-3.5 py-3 text-[13px] leading-5 text-[#ededef] transition-colors outline-none placeholder:text-[#6e6e78] focus:border-white/25"

async function responseError(response: Response, fallback: string) {
  try {
    const body: unknown = await response.json()
    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
    ) {
      return body.error
    }
  } catch {
    return fallback
  }

  return fallback
}

export function RecruiterSettingsView({
  user,
  profile,
}: {
  user: { name: string; email: string }
  profile: RecruiterProfile
}) {
  const router = useRouter()

  const [name, setName] = useState(user.name)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSaved, setPasswordSaved] = useState(false)

  const [companyName, setCompanyName] = useState(profile.companyName)
  const [website, setWebsite] = useState(profile.website)
  const [industry, setIndustry] = useState(profile.industry)
  const [companySize, setCompanySize] = useState(profile.companySize)
  const [location, setLocation] = useState(profile.location)
  const [about, setAbout] = useState(profile.about)
  const [savingCompany, setSavingCompany] = useState(false)
  const [companySaved, setCompanySaved] = useState(false)
  const [companyError, setCompanyError] = useState("")

  async function handleUpdateProfile() {
    const trimmed = name.trim()
    if (!trimmed) {
      setProfileError("Enter your full name.")
      return
    }
    if (savingProfile) return

    setSavingProfile(true)
    setProfileSaved(false)
    setProfileError("")
    try {
      const result = await authClient.updateUser({ name: trimmed })
      if (result.error) {
        setProfileError(
          result.error.message ?? "Could not update your profile."
        )
        return
      }

      setName(trimmed)
      setProfileSaved(true)
      router.refresh()
    } catch {
      setProfileError("Could not update your profile. Please try again.")
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleSaveCompany() {
    if (savingCompany) return

    if (!companyName.trim()) {
      setCompanyError("Enter your company name.")
      setCompanySaved(false)
      return
    }

    setSavingCompany(true)
    setCompanySaved(false)
    setCompanyError("")
    try {
      const response = await fetch("/api/recruiter/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          website,
          industry,
          companySize,
          location,
          about,
        }),
      })
      if (!response.ok) {
        setCompanyError(
          await responseError(response, "Could not save your company profile.")
        )
        return
      }

      setCompanySaved(true)
      router.refresh()
    } catch {
      setCompanyError("Could not save your company profile. Please try again.")
    } finally {
      setSavingCompany(false)
    }
  }

  async function handleChangePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (savingPassword) return
    setPasswordError("")

    if (newPassword.length < 8) {
      setPasswordError("Your new password must be at least 8 characters.")
      return
    }

    setSavingPassword(true)
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
      })
      if (result.error) {
        setPasswordError(
          result.error.message ?? "Could not change your password."
        )
        return
      }

      setCurrentPassword("")
      setNewPassword("")
      setPasswordSaved(true)
      setPasswordOpen(false)
    } catch {
      setPasswordError("Could not change your password. Please try again.")
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="p-4 pb-16 min-[900px]:px-6 min-[900px]:pt-4 sm:px-6 sm:pt-6">
      <div className="min-w-0">
        <h1 className="text-[28px] leading-9 font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[30px] sm:leading-[38px]">
          Settings
        </h1>
        <p className="mt-4 text-[14px] leading-5 text-[#a0a0ab]">
          Manage your account and company profile.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-5 min-[900px]:grid-cols-[733fr_348fr] min-[900px]:items-start min-[900px]:gap-[22px]">
        <div className="flex min-w-0 flex-col gap-4">
          <section
            aria-label="Account information"
            className={cn(CARD_CLASS, "p-6")}
          >
            <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
              Account Information
            </h2>

            <div className="mt-4 flex items-center gap-4">
              <InitialAvatar
                name={name || "?"}
                className="size-16 text-[24px] ring-white/10"
              />
              <div className="flex flex-col items-start gap-1">
                <p className="text-[13px] leading-5 font-medium text-[#ededef]">
                  {name}
                </p>
                <p className="text-[13px] leading-5 text-[#a0a0ab]">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="settings-name" className={LABEL_CLASS}>
                  Full Name
                </label>
                <input
                  id="settings-name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    setProfileSaved(false)
                    setProfileError("")
                  }}
                  className={cn(INPUT_CLASS, "mt-2")}
                />
              </div>

              <div>
                <label htmlFor="settings-email" className={LABEL_CLASS}>
                  Email Address
                </label>
                <input
                  id="settings-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={user.email}
                  readOnly
                  className={cn(INPUT_CLASS, "mt-2")}
                />
              </div>
            </div>

            <div className="mt-6 border-t border-white/[0.07]" />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleUpdateProfile}
                disabled={savingProfile}
                className={PRIMARY_BUTTON_CLASS}
              >
                {savingProfile ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasswordSaved(false)
                  setPasswordError("")
                  setPasswordOpen(true)
                }}
                className={SECONDARY_BUTTON_CLASS}
              >
                Reset Password
              </button>
              {profileSaved && (
                <span role="status" className="text-[12px] text-[#22c55e]">
                  Profile updated
                </span>
              )}
              {passwordSaved && (
                <span role="status" className="text-[12px] text-[#22c55e]">
                  Password updated
                </span>
              )}
            </div>
            {profileError && (
              <p role="alert" className="mt-2 text-[12px] text-[#fca5a5]">
                {profileError}
              </p>
            )}
          </section>

          <section
            aria-label="Company profile"
            className={cn(CARD_CLASS, "p-6")}
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-[10px] bg-[#222228]">
                <Building2
                  aria-hidden="true"
                  className="size-[18px] text-[#e5e2e3]"
                  strokeWidth={1.6}
                />
              </span>
              <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
                Company Profile
              </h2>
            </div>
            <p className="mt-2 text-[13px] leading-5 text-[#a0a0ab]">
              Used to prefill company details when you post a job.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="company-name" className={LABEL_CLASS}>
                  Company Name <span className="text-[#8f88ff]">*</span>
                </label>
                <input
                  id="company-name"
                  name="companyName"
                  maxLength={120}
                  value={companyName}
                  onChange={(event) => {
                    setCompanyName(event.target.value)
                    setCompanySaved(false)
                    setCompanyError("")
                  }}
                  className={cn(INPUT_CLASS, "mt-2")}
                  placeholder="e.g. Acme Inc."
                />
              </div>

              <div>
                <label htmlFor="company-website" className={LABEL_CLASS}>
                  Website
                </label>
                <input
                  id="company-website"
                  name="website"
                  type="url"
                  maxLength={200}
                  value={website}
                  onChange={(event) => {
                    setWebsite(event.target.value)
                    setCompanySaved(false)
                    setCompanyError("")
                  }}
                  className={cn(INPUT_CLASS, "mt-2")}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label htmlFor="company-industry" className={LABEL_CLASS}>
                  Industry
                </label>
                <input
                  id="company-industry"
                  name="industry"
                  maxLength={80}
                  value={industry}
                  onChange={(event) => {
                    setIndustry(event.target.value)
                    setCompanySaved(false)
                    setCompanyError("")
                  }}
                  className={cn(INPUT_CLASS, "mt-2")}
                  placeholder="e.g. Software & SaaS"
                />
              </div>

              <div>
                <label htmlFor="company-size" className={LABEL_CLASS}>
                  Company Size
                </label>
                <select
                  id="company-size"
                  name="companySize"
                  value={companySize}
                  onChange={(event) => {
                    setCompanySize(event.target.value)
                    setCompanySaved(false)
                    setCompanyError("")
                  }}
                  className={cn(INPUT_CLASS, "mt-2 [color-scheme:dark]")}
                >
                  <option value="">Select size</option>
                  {COMPANY_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} employees
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="company-location" className={LABEL_CLASS}>
                  Location
                </label>
                <input
                  id="company-location"
                  name="location"
                  maxLength={120}
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value)
                    setCompanySaved(false)
                    setCompanyError("")
                  }}
                  className={cn(INPUT_CLASS, "mt-2")}
                  placeholder="e.g. Dhaka, Bangladesh"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="company-about" className={LABEL_CLASS}>
                  About the Company
                </label>
                <textarea
                  id="company-about"
                  name="about"
                  maxLength={2000}
                  value={about}
                  onChange={(event) => {
                    setAbout(event.target.value)
                    setCompanySaved(false)
                    setCompanyError("")
                  }}
                  className={TEXTAREA_CLASS}
                  placeholder="What does your company do?"
                />
              </div>
            </div>

            <div className="mt-6 border-t border-white/[0.07]" />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveCompany}
                disabled={savingCompany}
                className={PRIMARY_BUTTON_CLASS}
              >
                {savingCompany ? "Saving..." : "Save Company Profile"}
              </button>
              {companySaved && (
                <span role="status" className="text-[12px] text-[#22c55e]">
                  Company profile saved
                </span>
              )}
            </div>
            {companyError && (
              <p role="alert" className="mt-2 text-[12px] text-[#fca5a5]">
                {companyError}
              </p>
            )}
          </section>
        </div>

        <section
          aria-label="Hiring tips"
          className={cn(CARD_CLASS, "flex flex-col p-6 xl:self-start")}
        >
          <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
            Profile checklist
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-[13px] leading-5 text-[#a0a0ab]">
            <li className="flex gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 size-1.5 shrink-0 rounded-full",
                  name.trim() ? "bg-[#22c55e]" : "bg-[#6e6e78]"
                )}
              />
              Add your full name so candidates know who is hiring.
            </li>
            <li className="flex gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 size-1.5 shrink-0 rounded-full",
                  companyName.trim() ? "bg-[#22c55e]" : "bg-[#6e6e78]"
                )}
              />
              Set a company name to prefill every job post.
            </li>
            <li className="flex gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1.5 size-1.5 shrink-0 rounded-full",
                  website.trim() || about.trim()
                    ? "bg-[#22c55e]"
                    : "bg-[#6e6e78]"
                )}
              />
              Add a website or company description to build trust.
            </li>
          </ul>
        </section>
      </div>

      <Dialog
        open={passwordOpen}
        onOpenChange={(open) => {
          setPasswordOpen(open)
          if (!open) setPasswordError("")
        }}
      >
        <DialogContent className="border border-white/10 bg-[#141418] text-[#ededef]">
          <DialogHeader>
            <DialogTitle className="text-[20px] font-semibold">
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#a0a0ab]">
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
            <label className={LABEL_CLASS} htmlFor="current-password">
              Current Password
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className={cn(INPUT_CLASS, "mt-1")}
              />
            </label>
            <label className={LABEL_CLASS} htmlFor="new-password">
              New Password
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className={cn(INPUT_CLASS, "mt-1")}
              />
            </label>
            {passwordError && (
              <p role="alert" className="text-[12px] text-[#fca5a5]">
                {passwordError}
              </p>
            )}
            <div className="mt-1 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPasswordOpen(false)}
                className={SECONDARY_BUTTON_CLASS}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingPassword}
                className={PRIMARY_BUTTON_CLASS}
              >
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
