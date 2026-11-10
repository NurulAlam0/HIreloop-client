import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Create your account — HireLoop",
  description:
    "Create your HireLoop account in three minutes. Matches start arriving today.",
}

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUpForm />
    </AuthShell>
  )
}
