import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { SettingsView } from "@/components/dashboard/settings-view"
import { getSeekerProfile } from "@/lib/seeker-profile"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const profile = await getSeekerProfile(session.user.id)
  const user = {
    name: session.user.name?.trim() || "Job Seeker",
    email: session.user.email,
  }

  return <SettingsView user={user} profile={profile} />
}
