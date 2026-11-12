import { getDb } from "@/lib/db"

export type SeekerProfileFile = {
  name: string
  size: number
  contentType: string
  updatedAt: Date
}

export type SeekerProfile = {
  headline: string
  bio: string
  skills: string[]
  avatar: SeekerProfileFile | null
  resume: SeekerProfileFile | null
}

type StoredProfileFile = SeekerProfileFile & {
  data: Buffer
}

type SeekerProfileDocument = {
  userId: string
  headline?: string
  bio?: string
  skills?: string[]
  avatar?: StoredProfileFile
  resume?: StoredProfileFile
  updatedAt: Date
}

export type SeekerProfileFileKind = "avatar" | "resume"

async function collection() {
  const db = await getDb()

  return db.collection<SeekerProfileDocument>("seekerProfiles")
}

function publicFile(
  file: StoredProfileFile | undefined
): SeekerProfileFile | null {
  if (!file) return null

  return {
    name: file.name,
    size: file.size,
    contentType: file.contentType,
    updatedAt: file.updatedAt,
  }
}

export async function getSeekerProfile(userId: string): Promise<SeekerProfile> {
  const profile = await (await collection()).findOne({ userId })

  return {
    headline: profile?.headline ?? "",
    bio: profile?.bio ?? "",
    skills: profile?.skills ?? [],
    avatar: publicFile(profile?.avatar),
    resume: publicFile(profile?.resume),
  }
}

export async function updateSeekerProfile(
  userId: string,
  profile: Pick<SeekerProfile, "headline" | "bio" | "skills">
) {
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

  return getSeekerProfile(userId)
}

export async function saveSeekerProfileFile(
  userId: string,
  kind: SeekerProfileFileKind,
  file: StoredProfileFile
) {
  const files = await collection()

  await files.updateOne(
    { userId },
    {
      $set: {
        [kind]: file,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  )

  return publicFile(file)
}

export async function removeSeekerProfileFile(
  userId: string,
  kind: SeekerProfileFileKind
) {
  await (
    await collection()
  ).updateOne(
    { userId },
    {
      $unset: { [kind]: "" },
      $set: { updatedAt: new Date() },
    }
  )
}

export async function getSeekerProfileFile(
  userId: string,
  kind: SeekerProfileFileKind
) {
  const profile = await (
    await collection()
  ).findOne({ userId }, { projection: { [kind]: 1 } })

  return profile?.[kind] ?? null
}
