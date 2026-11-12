export const ROLE_LABELS = {
  "job-seeker": "Job Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
} as const

export type DashboardRole = keyof typeof ROLE_LABELS

export type DashboardUser = {
  name: string
  email: string
  role: DashboardRole
}

export const DASHBOARD_ROUTES: Record<DashboardRole, string> = {
  "job-seeker": "/dashboard/seeker",
  recruiter: "/dashboard/recruiter",
  admin: "/dashboard/admin",
}

export function normalizeRole(role?: string | null): DashboardRole {
  return role === "recruiter" || role === "admin" ? role : "job-seeker"
}

export function dashboardRoute(role?: string | null) {
  return DASHBOARD_ROUTES[normalizeRole(role)]
}
