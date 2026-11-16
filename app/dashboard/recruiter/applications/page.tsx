import type { Metadata } from "next"

import { RecruiterApplicationsView } from "@/components/dashboard/recruiter-applications"

export const metadata: Metadata = {
  title: "Applications",
}

export default function RecruiterApplicationsPage() {
  return <RecruiterApplicationsView />
}
