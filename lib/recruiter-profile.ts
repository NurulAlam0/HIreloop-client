import { getDb } from "@/lib/db"

/** Company size options offered in the recruiter settings select. */
export const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001+",
] as const

export type CompanySize = (typeof COMPANY_SIZE_OPTIONS)[number]

export type RecruiterProfile = {
  companyName: string
  website: string
  industry: string
  companySize: string
  location: string
  about: string
}

type RecruiterProfileDocument = {
  userId: string
  companyName?: string
  website?: string
  industry?: string
  companySize?: string
  location?: string
  about?: string
  updatedAt: Date
}

async function collection() {
  const db = await getDb()

  return db.collection<RecruiterProfileDocument>("recruiterProfiles")
}

export async function getRecruiterProfile(
  userId: string
): Promise<RecruiterProfile> {
  const profile = await (await collection()).findOne({ userId })

  return {
    companyName: profile?.companyName ?? "",
    website: profile?.website ?? "",
    industry: profile?.industry ?? "",
    companySize: profile?.companySize ?? "",
    location: profile?.location ?? "",
    about: profile?.about ?? "",
  }
}

export async function updateRecruiterProfile(
  userId: string,
  profile: RecruiterProfile
): Promise<RecruiterProfile> {
  await (
    await collection()
  ).updateOne(
    { userId },
    {
      $set: {
        ...profile,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  )

  return getRecruiterProfile(userId)
}
