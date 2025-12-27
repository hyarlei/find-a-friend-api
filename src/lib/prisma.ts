import { env } from "@/env"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaClient } from "@prisma/client"

const adapter = new PrismaLibSql({
  url: env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })
