import { redirect } from "next/navigation"

import { dashboardRoute } from "@/lib/dashboard"
import { getSession } from "@/lib/session"

export default async function DashboardIndexPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/sign-in")
  }

  redirect(dashboardRoute(session.user.role))
}
