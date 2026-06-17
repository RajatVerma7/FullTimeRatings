import type { PrismaClient } from "@/generated/prisma";
import { getDatabaseUrl, isDatabaseConfigured } from "@/lib/env";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export { isDatabaseConfigured, getDatabaseUrl } from "@/lib/env";

export function getPrisma(): PrismaClient | null {
  if (!isDatabaseConfigured()) return null;

  if (!globalForPrisma.prisma) {
    try {
      const { PrismaClient } = require("@/generated/prisma") as typeof import("@/generated/prisma");
      const { PrismaPg } = require("@prisma/adapter-pg") as typeof import("@prisma/adapter-pg");
      const pg = require("pg") as typeof import("pg");

      const connectionString = getDatabaseUrl();
      if (!connectionString) return null;

      const pool = new pg.Pool({
        connectionString,
        ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false },
      });
      const adapter = new PrismaPg(pool);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    } catch {
      return null;
    }
  }

  return globalForPrisma.prisma ?? null;
}
