import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { RecruiterSettingsView } from "@/components/dashboard/recruiter-settings-view"
import { getRecruiterProfile } from "@/lib/recruiter-profile"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const profile = await getRecruiterProfile(session.user.id)
  const user = {
    name: session.user.name?.trim() || "Recruiter",
    email: session.user.email,
  }

  return <RecruiterSettingsView user={user} profile={profile} />
}
