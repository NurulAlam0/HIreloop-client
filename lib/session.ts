import { cache } from "react"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"

/**
 * Request-scoped session lookup so layouts and pages can both read the
 * session without hitting the database twice.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})
