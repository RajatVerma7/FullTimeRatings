import type { Match } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapMatchFromPrisma(row: any): Match {
  return {
    id: row.id,
    slug: row.slug,
    homeTeam: {
      id: row.homeTeam.id,
      name: row.homeTeam.name,
      slug: row.homeTeam.slug,
    },
    awayTeam: {
      id: row.awayTeam.id,
      name: row.awayTeam.name,
      slug: row.awayTeam.slug,
    },
    tournament: {
      id: row.tournament.id,
      name: row.tournament.name,
      slug: row.tournament.slug,
    },
    matchDate: row.matchDate instanceof Date ? row.matchDate.toISOString() : row.matchDate,
    homeScore: row.homeScore,
    awayScore: row.awayScore,
    avgRating: row.avgRating,
    ratingCount: row.ratingCount,
    reviewCount: row.reviewCount,
  };
}
