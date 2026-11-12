import type { Metadata } from "next"

import { SavedJobsView } from "@/components/dashboard/saved-jobs-view"

export const metadata: Metadata = {
  title: "Saved Jobs",
}

export default function SavedJobsPage() {
  return <SavedJobsView />
}
