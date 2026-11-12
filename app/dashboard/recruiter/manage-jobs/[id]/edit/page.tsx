import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { PostJobForm } from "@/components/dashboard/post-job-form"
import { getJobForOwner } from "@/lib/jobs"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Edit Job Post",
}

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  const { id } = await params
  const job = await getJobForOwner(id, session.user.id)

  if (!job) {
    notFound()
  }

  return <PostJobForm job={job} />
}
