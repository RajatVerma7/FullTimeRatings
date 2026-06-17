import type { Review } from "@/types";
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

export async function getReviewsForMatch(matchId: string): Promise<Review[]> {
  return withPrisma(async (prisma) => {
    const rows = await prisma.review.findMany({
      where: { matchId },
      include: { user: true },
      orderBy: { helpfulCount: "desc" },
    });
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      username: row.user.username,
      avatarUrl: row.user.avatarUrl ?? undefined,
      matchId: row.matchId,
      title: row.title ?? undefined,
      content: row.content,
      rating: row.rating ?? undefined,
      helpfulCount: row.helpfulCount,
      createdAt: row.createdAt.toISOString(),
    }));
  }, []);
}

export async function getRecentReviews(limit = 10): Promise<Review[]> {
  return withPrisma(async (prisma) => {
    const rows = await prisma.review.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      username: row.user.username,
      avatarUrl: row.user.avatarUrl ?? undefined,
      matchId: row.matchId,
      title: row.title ?? undefined,
      content: row.content,
      rating: row.rating ?? undefined,
      helpfulCount: row.helpfulCount,
      createdAt: row.createdAt.toISOString(),
    }));
  }, []);
}
