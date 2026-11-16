import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

// $20 one-time — Starter plan / job-page apply unlock (credited on /success).
const APPLY_UNLOCK_PRICE = "price_1Uc4tqD7s18E8gRFuoSuu21S"
// $35/month recurring — Growth plan from the pricing cards (credited on /success).
const GROWTH_PLAN_PRICE = "price_1Uc7LtD7s18E8gRFNPq20QkW"

type CheckoutPurpose = "apply-unlock" | "growth-plan"

/**
 * Reads the `plan` field from a form POST (pricing cards' "Add to Cart") or a
 * JSON body. Absent/unknown → the default $20 apply-unlock checkout.
 */
async function readPlan(request: Request): Promise<string | null> {
  try {
    const contentType = request.headers.get("content-type") ?? ""

    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData()
      return form.get("plan")?.toString() ?? null
    }

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { plan?: unknown }
      return typeof body.plan === "string" ? body.plan : null
    }
  } catch {
    // Empty or unparsable body — fall through to the default checkout.
  }

  return null
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get("origin")

    const authSession = await auth.api.getSession({ headers: headersList })

    if (!authSession?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const plan = await readPlan(request)
    const isGrowth = plan === "growth"
    const purpose: CheckoutPurpose = isGrowth ? "growth-plan" : "apply-unlock"

    // Starter & the job page's "Pay $20 to Unlock" use the $20 one-time price;
    // Growth is a $35/month subscription.
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: isGrowth ? GROWTH_PLAN_PRICE : APPLY_UNLOCK_PRICE,
          quantity: 1,
        },
      ],
      mode: isGrowth ? "subscription" : "payment",
      client_reference_id: authSession.user.id,
      metadata: { userId: authSession.user.id, purpose },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      // Label for this Checkout integration (alphanumeric, dashes, underscores, periods only)
      integration_identifier: "hireloop-web",
    })

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Checkout session URL is missing" },
        { status: 500 }
      )
    }

    return NextResponse.redirect(checkoutSession.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    )
  }
}
