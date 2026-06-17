import type { Tournament } from "@/types";
import { getPrisma } from "@/lib/db";

async function withPrisma<T>(
  fn: (prisma: NonNullable<ReturnType<typeof getPrisma>>) => Promise<T>,
  fallback: T
): Promise<T> {
  const prisma = getPrisma();
  if (!prisma) return fallback;
  try {
    return await fn(prisma);
  } catch {
    return fallback;
  }
}

export async function getTournaments(): Promise<Tournament[]> {
  return withPrisma(async (prisma) => {
    const rows = await prisma.tournament.findMany({ orderBy: { name: "asc" } });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
    }));
  }, []);
}

export async function getTournamentBySlug(slug: string): Promise<Tournament | null> {
  return withPrisma(async (prisma) => {
    const row = await prisma.tournament.findUnique({ where: { slug } });
    if (!row) return null;
    return { id: row.id, name: row.name, slug: row.slug };
  }, null);
}

export async function getTournamentMatchCount(slug: string): Promise<number> {
  return withPrisma(
    (prisma) => prisma.match.count({ where: { tournament: { slug } } }),
    0
  );
}
