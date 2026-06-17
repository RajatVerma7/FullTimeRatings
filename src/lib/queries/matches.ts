import type { Match } from "@/types";
import { getPrisma } from "@/lib/db";
import { mapMatchFromPrisma } from "@/lib/queries/mappers";

const matchInclude = {
  homeTeam: true,
  awayTeam: true,
  tournament: true,
} as const;

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

export async function getTopRatedMatches(limit = 250): Promise<Match[]> {
  return withPrisma(async (prisma) => {
    const rows = await prisma.match.findMany({
      orderBy: { avgRating: "desc" },
      take: limit,
      include: matchInclude,
    });
    return rows.map(mapMatchFromPrisma);
  }, []);
}

export async function getRecentMatches(limit = 8): Promise<Match[]> {
  return withPrisma(async (prisma) => {
    const rows = await prisma.match.findMany({
      orderBy: { matchDate: "desc" },
      take: limit,
      include: matchInclude,
    });
    return rows.map(mapMatchFromPrisma);
  }, []);
}

export async function getMatchBySlug(slug: string): Promise<Match | null> {
  return withPrisma(async (prisma) => {
    const row = await prisma.match.findUnique({
      where: { slug },
      include: matchInclude,
    });
    return row ? mapMatchFromPrisma(row) : null;
  }, null);
}

export async function getMatchesByTournament(slug: string): Promise<Match[]> {
  return withPrisma(async (prisma) => {
    const rows = await prisma.match.findMany({
      where: { tournament: { slug } },
      orderBy: { matchDate: "desc" },
      include: matchInclude,
    });
    return rows.map(mapMatchFromPrisma);
  }, []);
}

export async function searchMatches(query: string): Promise<Match[]> {
  if (!query.trim()) return [];
  return withPrisma(async (prisma) => {
    const rows = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeam: { name: { contains: query, mode: "insensitive" } } },
          { awayTeam: { name: { contains: query, mode: "insensitive" } } },
          { tournament: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: matchInclude,
      orderBy: { matchDate: "desc" },
      take: 50,
    });
    return rows.map(mapMatchFromPrisma);
  }, []);
}

export async function getListMatches(listSlug: string): Promise<Match[]> {
  return withPrisma(async (prisma) => {
    const items = await prisma.listItem.findMany({
      where: { list: { slug: listSlug } },
      orderBy: { position: "asc" },
      include: { match: { include: matchInclude } },
    });
    return items.map((item) => mapMatchFromPrisma(item.match));
  }, []);
}
