import { MongoClient, type Db } from "mongodb"

const uri = process.env.BETTER_AUTH_MONGODB_URI

if (!uri) {
  throw new Error("BETTER_AUTH_MONGODB_URI must be set to access the database.")
}

declare global {
  var __hireloopMongo: Promise<MongoClient> | undefined
}

const clientPromise =
  process.env.NODE_ENV === "development"
    ? (global.__hireloopMongo ??= new MongoClient(uri).connect())
    : new MongoClient(uri).connect()

export async function getDb(): Promise<Db> {
  const client = await clientPromise

  return client.db("hireloopdb")
}
