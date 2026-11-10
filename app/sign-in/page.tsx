import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign in — HireLoop",
  description: "Sign in to your HireLoop account.",
}

export default function SignInPage() {
  return (
    <AuthShell>
      <SignInForm />
    </AuthShell>
  )
}
