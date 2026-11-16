import { getDb } from "@/lib/db"

export type PaymentPurpose = "apply-unlock" | "growth-plan"

type PaymentDoc = {
  userId: string
  stripeSessionId: string
  purpose: PaymentPurpose
  amount: number
  createdAt: Date
}

async function collection() {
  const db = await getDb()

  return db.collection<PaymentDoc>("payments")
}

/** One record per checkout session; built lazily so dev restarts stay cheap. */
let indexesReady: Promise<unknown> | null = null

function ensureIndexes() {
  indexesReady ??= collection()
    .then((payments) =>
      payments.createIndex({ stripeSessionId: 1 }, { unique: true })
    )
    .catch((error) => {
      indexesReady = null
      console.error("Failed to index payments", error)
    })

  return indexesReady
}

function isDuplicateKey(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === 11000
  )
}

/** True once the user paid for a plan — Starter $20 or Growth $35/month both lift the apply limit. */
export async function hasApplyUnlock(userId: string): Promise<boolean> {
  await ensureIndexes()

  const doc = await (
    await collection()
  ).findOne(
    { userId, purpose: { $in: ["apply-unlock", "growth-plan"] } },
    { projection: { _id: 1 } }
  )

  return Boolean(doc)
}

/**
 * Credits a completed Stripe checkout session to the payer. Idempotent —
 * the success page can re-render (refresh) without double counting.
 */
export async function recordPayment(params: {
  userId: string
  stripeSessionId: string
  amount: number
  purpose: PaymentPurpose
}): Promise<void> {
  await ensureIndexes()

  try {
    await (
      await collection()
    ).updateOne(
      { stripeSessionId: params.stripeSessionId },
      {
        $setOnInsert: {
          userId: params.userId,
          stripeSessionId: params.stripeSessionId,
          purpose: params.purpose,
          amount: params.amount,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )
  } catch (error) {
    // Unique-index race: another render recorded the same session first.
    if (!isDuplicateKey(error)) {
      throw error
    }
  }
}
