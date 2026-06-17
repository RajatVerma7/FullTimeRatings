import type { MatchList } from "@/types";
import { getPrisma } from "@/lib/db";

async function withPrisma<T>(fn: (prisma: NonNullable<ReturnType<typeof getPrisma>>) => Promise<T>, fallback: T): Promise<T> {
  const prisma = getPrisma();
  if (!prisma) return fallback;
  try {
    return await fn(prisma);
  } catch {
    return fallback;
  }
}

export async function getPublicLists(): Promise<MatchList[]> {
  return withPrisma(async (prisma) => {
    const rows = await prisma.list.findMany({
      where: { isPublic: true },
      include: { user: true, _count: { select: { items: true } } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description ?? undefined,
      username: row.user.username,
      matchCount: row._count.items,
    }));
  }, []);
}

export async function getListBySlug(slug: string): Promise<MatchList | null> {
  return withPrisma(async (prisma) => {
    const row = await prisma.list.findFirst({
      where: { slug, isPublic: true },
      include: { user: true, _count: { select: { items: true } } },
    });
    if (!row) return null;
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description ?? undefined,
      username: row.user.username,
      matchCount: row._count.items,
    };
  }, null);
}
