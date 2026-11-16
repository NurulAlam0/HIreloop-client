import Link from "next/link"
import { redirect } from "next/navigation"

import { recordPayment, type PaymentPurpose } from "@/lib/payments"
import { stripe } from "@/lib/stripe"

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)")

  const checkout = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })
  const { status, customer_details } = checkout

  if (status === "open") {
    return redirect("/")
  }

  if (status === "complete") {
    const purpose = checkout.metadata?.purpose
    const payerId = checkout.client_reference_id ?? checkout.metadata?.userId
    const paymentPurpose: PaymentPurpose | null =
      purpose === "apply-unlock" || purpose === "growth-plan"
        ? purpose
        : null

    // Credit the completed checkout to the payer (idempotent on session id).
    if (paymentPurpose && payerId) {
      await recordPayment({
        userId: payerId,
        stripeSessionId: checkout.id,
        amount: checkout.amount_total ?? 0,
        purpose: paymentPurpose,
      })
    }

    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{" "}
          {customer_details?.email}. If you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
        {paymentPurpose === "apply-unlock" && (
          <p className="mt-4">
            <Link href="/jobs">
              Your apply limit is lifted — keep applying →
            </Link>
          </p>
        )}
        {paymentPurpose === "growth-plan" && (
          <p className="mt-4">
            <Link href="/dashboard">
              Your Growth plan is active — head to your dashboard →
            </Link>
          </p>
        )}
      </section>
    )
  }

  // 'expired' (or a null status) — send the visitor home instead of a blank page
  return redirect("/")
}
