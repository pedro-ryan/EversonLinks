import dotenv from "dotenv"
import path from "path"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaClient, Prisma } from "../generated/prisma/client"

// Load the .env file from the packages/db directory
dotenv.config({ path: path.resolve(import.meta.dir, "../.env") })

let databaseUrl = process.env.DATABASE_URL ?? ""

if (databaseUrl.startsWith("file:")) {
  const filePath = databaseUrl.replace(/^file:/, "")
  if (!path.isAbsolute(filePath)) {
    // Resolve relative to packages/db directory
    const absolutePath = path.resolve(import.meta.dir, "..", filePath)
    databaseUrl = `file:${absolutePath}`
  }
}

const adapter = new PrismaLibSql({
  url: databaseUrl,
})

const prisma = new PrismaClient({ adapter })

export { prisma, Prisma }
