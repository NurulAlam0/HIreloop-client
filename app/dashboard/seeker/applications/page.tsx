import type { Metadata } from "next"

import { ApplicationsView } from "@/components/dashboard/applications-view"

export const metadata: Metadata = {
  title: "My Applications",
}

export default function ApplicationsPage() {
  return <ApplicationsView />
}
