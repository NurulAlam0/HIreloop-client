import type { Metadata } from "next"

import { PostJobForm } from "@/components/dashboard/post-job-form"

export const metadata: Metadata = {
  title: "Post a New Job",
}

export default function AddJobPage() {
  return <PostJobForm />
}
