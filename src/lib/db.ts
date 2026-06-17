import type { PrismaClient } from "@/generated/prisma";
import { isDatabaseConfigured } from "@/lib/env";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export { isDatabaseConfigured, getDatabaseUrl } from "@/lib/env";

export function getPrisma(): PrismaClient | null {
  if (!isDatabaseConfigured()) return null;

  if (!globalForPrisma.prisma) {
    const { PrismaClient } = require("@/generated/prisma") as typeof import("@/generated/prisma");
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}
