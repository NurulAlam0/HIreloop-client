"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Upload, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CARD_CLASS, InitialAvatar } from "@/components/dashboard/primitives"
import { authClient } from "@/lib/auth-client"
import type {
  SeekerProfile,
  SeekerProfileFile,
  SeekerProfileFileKind,
} from "@/lib/seeker-profile"
import { cn } from "@/lib/utils"

const INPUT_CLASS =
  "h-10 w-full rounded-lg border border-white/[0.09] bg-[#0c0c0f] px-3.5 text-[13px] leading-5 text-[#ededef] outline-none transition-colors placeholder:text-[#6e6e78] focus:border-white/25"

const LABEL_CLASS = "block text-[13px] leading-5 font-normal text-[#a0a0ab]"

const PRIMARY_BUTTON_CLASS =
  "inline-flex h-8 items-center justify-center rounded-lg bg-[#fafafa] px-4 text-[13px] leading-5 font-semibold whitespace-nowrap text-[#111318] transition-colors hover:bg-white disabled:cursor-default disabled:opacity-70"

const SECONDARY_BUTTON_CLASS =
  "inline-flex h-8 items-center justify-center rounded-lg border border-white/[0.1] bg-[#1a1a1f] px-4 text-[13px] leading-5 font-medium whitespace-nowrap text-[#d4d4d8] transition-colors hover:bg-[#202026] hover:text-white disabled:cursor-default disabled:opacity-70"

const DEFAULT_SKILLS = ["Figma", "UI Design", "Prototyping"]
const DEFAULT_HEADLINE = "Senior UX/UI Designer"
const DEFAULT_BIO =
  "Passionate designer with 5+ years of experience crafting user-centric digital experiences..."

function SkillChip({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex h-6 shrink-0 items-center gap-2 rounded-full bg-[#222228] pr-2 pl-3 text-[12px] leading-4 font-medium text-[#ededef]">
      {label}
      <button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        className="grid size-3 place-items-center text-[#c4c4cb] transition-colors hover:text-white"
      >
        <X aria-hidden="true" className="size-[10px]" strokeWidth={2.6} />
      </button>
    </span>
  )
}

function formatFileSize(size: number) {
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(size / 1024))} KB`
}

function formatUpdatedAt(date: Date) {
  const days = Math.floor(
    (Date.now() - new Date(date).getTime()) / (24 * 60 * 60 * 1000)
  )

  if (days < 1) return "today"
  if (days === 1) return "1 day ago"
  return `${days} days ago`
}

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

export function SettingsView({
  user,
  profile,
}: {
  user: { name: string; email: string }
  profile: SeekerProfile
}) {
  const router = useRouter()
  const avatarInput = useRef<HTMLInputElement>(null)
  const resumeInput = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user.name)
  const [headline, setHeadline] = useState(profile.headline || DEFAULT_HEADLINE)
  const [bio, setBio] = useState(profile.bio || DEFAULT_BIO)
  const [skills, setSkills] = useState(
    profile.skills.length ? profile.skills : DEFAULT_SKILLS
  )
  const [skillDraft, setSkillDraft] = useState("")
  const [resume, setResume] = useState<SeekerProfileFile | null>(profile.resume)
  const [avatar, setAvatar] = useState(profile.avatar)
  const [avatarVersion, setAvatarVersion] = useState(
    profile.avatar?.updatedAt.getTime() ?? 0
  )
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingDetails, setSavingDetails] = useState(false)
  const [uploading, setUploading] = useState<SeekerProfileFileKind | null>(null)
  const [removingResume, setRemovingResume] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [detailsSaved, setDetailsSaved] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [detailsError, setDetailsError] = useState("")
  const [fileError, setFileError] = useState("")
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSaved, setPasswordSaved] = useState(false)

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

  async function handleSaveDetails() {
    if (savingDetails) return
    setSavingDetails(true)
    setDetailsSaved(false)
    setDetailsError("")
    try {
      const response = await fetch("/api/seeker/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, bio, skills }),
      })
      if (!response.ok) {
        setDetailsError(
          await responseError(response, "Could not save your details.")
        )
        return
      }

      setDetailsSaved(true)
      router.refresh()
    } catch {
      setDetailsError("Could not save your details. Please try again.")
    } finally {
      setSavingDetails(false)
    }
  }

  function addSkill() {
    const value = skillDraft.trim().replace(/,$/, "")
    if (!value) return
    if (value.length > 40) {
      setDetailsError("Skills must be 40 characters or fewer.")
      return
    }
    if (
      skills.length >= 30 &&
      !skills.some((item) => item.toLowerCase() === value.toLowerCase())
    ) {
      setDetailsError("You can add up to 30 skills.")
      return
    }

    setSkills((current) =>
      current.some((skill) => skill.toLowerCase() === value.toLowerCase())
        ? current
        : [...current, value]
    )
    setSkillDraft("")
    setDetailsSaved(false)
    setDetailsError("")
  }

  function removeSkill(skill: string) {
    setSkills((current) => current.filter((item) => item !== skill))
    setDetailsSaved(false)
  }

  async function handleFileUpload(
    kind: SeekerProfileFileKind,
    file: File | undefined
  ) {
    if (!file) return

    setUploading(kind)
    setFileError("")
    const formData = new FormData()
    formData.set("kind", kind)
    formData.set("file", file)
    try {
      const response = await fetch("/api/seeker/profile", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        setFileError(
          await responseError(
            response,
            `Could not upload your ${kind}. Please try again.`
          )
        )
        return
      }

      const result = (await response.json()) as { file: SeekerProfileFile }
      if (kind === "avatar") {
        setAvatar(result.file)
        setAvatarVersion(Date.now())
      } else {
        setResume(result.file)
      }
      router.refresh()
    } catch {
      setFileError(`Could not upload your ${kind}. Please try again.`)
    } finally {
      setUploading(null)
    }
  }

  async function handleRemoveResume() {
    if (removingResume) return
    setRemovingResume(true)
    setFileError("")
    try {
      const response = await fetch("/api/seeker/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "resume" }),
      })
      if (!response.ok) {
        setFileError(
          await responseError(response, "Could not remove your resume.")
        )
        return
      }

      setResume(null)
      router.refresh()
    } catch {
      setFileError("Could not remove your resume. Please try again.")
    } finally {
      setRemovingResume(false)
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
          Manage your account details and professional profile.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-5 min-[900px]:grid-cols-[733fr_348fr] min-[900px]:items-start min-[900px]:gap-[22px]">
        <div className="flex min-w-0 flex-col gap-4">
          <section
            aria-label="Profile information"
            className={cn(CARD_CLASS, "p-6")}
          >
            <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
              Profile Information
            </h2>

            <div className="mt-4 flex items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-[#222228]">
                {avatar ? (
                  <Image
                    key={avatarVersion}
                    src={`/api/seeker/profile/files/avatar?v=${avatarVersion}`}
                    alt={`${name}'s profile picture`}
                    fill
                    unoptimized
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <InitialAvatar
                    name={name || "?"}
                    className="size-full text-[24px] ring-white/10"
                  />
                )}
              </div>
              <input
                ref={avatarInput}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="sr-only"
                aria-label="Choose a profile picture"
                onChange={(event) => {
                  void handleFileUpload("avatar", event.target.files?.[0])
                  event.target.value = ""
                }}
              />
              <div className="flex flex-col items-start gap-1">
                <button
                  type="button"
                  onClick={() => avatarInput.current?.click()}
                  disabled={uploading !== null}
                  className={cn(SECONDARY_BUTTON_CLASS, "px-3")}
                >
                  {uploading === "avatar" ? "Uploading..." : "Change Avatar"}
                </button>
                <p className="text-[13px] leading-5 text-[#a0a0ab]">
                  JPG, GIF or PNG. Max size of 5MB.
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
            aria-label="Professional details"
            className={cn(CARD_CLASS, "p-6")}
          >
            <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
              Professional Details
            </h2>

            <div className="mt-4">
              <label htmlFor="settings-headline" className={LABEL_CLASS}>
                Professional Headline
              </label>
              <input
                id="settings-headline"
                name="headline"
                maxLength={120}
                value={headline}
                onChange={(event) => {
                  setHeadline(event.target.value)
                  setDetailsSaved(false)
                  setDetailsError("")
                }}
                className={cn(INPUT_CLASS, "mt-2")}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="settings-bio" className={LABEL_CLASS}>
                Bio
              </label>
              <textarea
                id="settings-bio"
                name="bio"
                maxLength={2000}
                value={bio}
                onChange={(event) => {
                  setBio(event.target.value)
                  setDetailsSaved(false)
                  setDetailsError("")
                }}
                className="mt-2 min-h-[112px] w-full resize-y rounded-lg border border-white/[0.1] bg-[#1a1a1f] px-3.5 py-3 text-[13px] leading-5 text-[#ededef] transition-colors outline-none placeholder:text-[#6e6e78] focus:border-white/25"
              />
            </div>

            <div className="mt-5">
              <label htmlFor="settings-skill" className={LABEL_CLASS}>
                Skills
              </label>
              <div className="mt-2 flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2">
                {skills.map((skill) => (
                  <SkillChip
                    key={skill}
                    label={skill}
                    onRemove={() => removeSkill(skill)}
                  />
                ))}
                <input
                  id="settings-skill"
                  aria-label="Add a skill"
                  value={skillDraft}
                  onChange={(event) => setSkillDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault()
                      addSkill()
                    } else if (
                      event.key === "Backspace" &&
                      !skillDraft &&
                      skills.length
                    ) {
                      removeSkill(skills[skills.length - 1])
                    }
                  }}
                  onBlur={addSkill}
                  placeholder="Add a skill..."
                  className="h-6 min-w-[120px] flex-1 bg-transparent text-[12px] leading-5 text-[#ededef] outline-none placeholder:text-[#6e6e78]"
                />
              </div>
            </div>

            <div className="mt-7 border-t border-white/[0.07]" />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDetails}
                disabled={savingDetails}
                className={PRIMARY_BUTTON_CLASS}
              >
                {savingDetails ? "Saving..." : "Save Details"}
              </button>
              {detailsSaved && (
                <span role="status" className="text-[12px] text-[#22c55e]">
                  Details saved
                </span>
              )}
            </div>
            {detailsError && (
              <p role="alert" className="mt-2 text-[12px] text-[#fca5a5]">
                {detailsError}
              </p>
            )}
          </section>
        </div>

        <section
          id="resume"
          aria-label="Resume"
          className={cn(CARD_CLASS, "flex flex-col p-6 xl:self-start")}
        >
          <h2 className="text-[20px] leading-7 font-semibold tracking-[-0.02em] text-[#ededef]">
            Resume
          </h2>
          <p className="mt-2 max-w-[280px] text-[13px] leading-5 text-[#a0a0ab]">
            Upload your most recent resume to enable one-click applications.
          </p>

          <div className="mt-3 flex min-h-[166px] flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.13] px-4 py-4 text-center">
            <span className="grid size-9 place-items-center rounded-full bg-[#222228]">
              <FileText
                aria-hidden="true"
                className="size-[16px] text-[#ededef]"
                strokeWidth={1.8}
              />
            </span>

            <p className="mt-3 max-w-full truncate text-[13px] leading-5 font-normal text-[#ededef]">
              {resume?.name ?? "No resume uploaded"}
            </p>
            <p className="mt-1 text-[12px] leading-4 text-[#8a8a93]">
              {resume
                ? `Last updated ${formatUpdatedAt(resume.updatedAt)} • ${formatFileSize(resume.size)}`
                : "PDF, DOC, or DOCX • Max size 5 MB"}
            </p>

            <input
              ref={resumeInput}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              aria-label="Choose a resume"
              onChange={(event) => {
                void handleFileUpload("resume", event.target.files?.[0])
                event.target.value = ""
              }}
            />
            <div className="mt-5 flex w-full justify-center gap-2.5">
              <button
                type="button"
                onClick={() => resumeInput.current?.click()}
                disabled={uploading !== null}
                className={cn(SECONDARY_BUTTON_CLASS, "h-9 w-[120px] px-0")}
              >
                {uploading === "resume" ? (
                  "Uploading..."
                ) : resume ? (
                  "Replace"
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Upload aria-hidden="true" className="size-3.5" />
                    Upload
                  </span>
                )}
              </button>
              {resume && (
                <button
                  type="button"
                  onClick={handleRemoveResume}
                  disabled={removingResume}
                  className={cn(
                    SECONDARY_BUTTON_CLASS,
                    "h-9 w-[120px] px-0 text-[#fca5a5] hover:text-[#fecaca]"
                  )}
                >
                  {removingResume ? "Removing..." : "Remove"}
                </button>
              )}
            </div>
          </div>
          {fileError && (
            <p role="alert" className="mt-2 text-[12px] text-[#fca5a5]">
              {fileError}
            </p>
          )}
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
                minLength={8}
                required
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
