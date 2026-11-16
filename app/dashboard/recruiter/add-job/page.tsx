import type { Metadata } from "next"

import { PostJobForm } from "@/components/dashboard/post-job-form"
import { getRecruiterProfile } from "@/lib/recruiter-profile"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Post a New Job",
}

export default async function AddJobPage() {
  const session = await getSession()
  const profile = session?.user
    ? await getRecruiterProfile(session.user.id)
    : null

  return <PostJobForm defaultCompany={profile?.companyName || undefined} />
}
