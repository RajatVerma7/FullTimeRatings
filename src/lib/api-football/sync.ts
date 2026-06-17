import { getPrisma } from "@/lib/db";
import { getApiFootballConfig } from "./config";
import { fetchFixtures } from "./client";
import { mapFixture } from "./mapper";

export interface SyncResult {
  synced: number;
  skipped: number;
  errors: string[];
}

async function upsertTeam(
  prisma: NonNullable<ReturnType<typeof getPrisma>>,
  team: { externalId: number; name: string; slug: string }
) {
  return prisma.team.upsert({
    where: { externalId: team.externalId },
    create: { externalId: team.externalId, name: team.name, slug: team.slug },
    update: { name: team.name },
  });
}

async function upsertTournament(
  prisma: NonNullable<ReturnType<typeof getPrisma>>,
  tournament: { externalId: number; name: string; slug: string }
) {
  return prisma.tournament.upsert({
    where: { externalId: tournament.externalId },
    create: { externalId: tournament.externalId, name: tournament.name, slug: tournament.slug },
    update: { name: tournament.name },
  });
}

/** Sync finished fixtures for one league + season into the database */
export async function syncLeagueFixtures(
  leagueId: number,
  season: number
): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, skipped: 0, errors: [] };
  const prisma = getPrisma();

  if (!prisma) {
    result.errors.push("DATABASE_URL not configured.");
    return result;
  }

  const { isConfigured } = getApiFootballConfig();
  if (!isConfigured) {
    result.errors.push("API_FOOTBALL_KEY not configured.");
    return result;
  }

  try {
    const { response: fixtures } = await fetchFixtures(leagueId, season);

    for (const fixture of fixtures) {
      try {
        const mapped = mapFixture(fixture);

        const [homeTeam, awayTeam, tournament] = await Promise.all([
          upsertTeam(prisma, mapped.homeTeam),
          upsertTeam(prisma, mapped.awayTeam),
          upsertTournament(prisma, mapped.tournament),
        ]);

        await prisma.match.upsert({
          where: { externalId: mapped.externalId },
          create: {
            externalId: mapped.externalId,
            slug: mapped.slug,
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            tournamentId: tournament.id,
            matchDate: mapped.matchDate,
            homeScore: mapped.homeScore,
            awayScore: mapped.awayScore,
          },
          update: {
            homeScore: mapped.homeScore,
            awayScore: mapped.awayScore,
            matchDate: mapped.matchDate,
          },
        });

        result.synced++;
      } catch (err) {
        result.errors.push(
          err instanceof Error ? err.message : `Failed fixture ${fixture.fixture.id}`
        );
        result.skipped++;
      }
    }
  } catch (err) {
    result.errors.push(err instanceof Error ? err.message : "Sync failed");
  }

  return result;
}

/** Sync all configured leagues (see API_FOOTBALL_LEAGUE_IDS in .env) */
export async function syncAllLeagues(): Promise<SyncResult> {
  const { defaultLeagueIds, defaultSeason } = getApiFootballConfig();
  const combined: SyncResult = { synced: 0, skipped: 0, errors: [] };

  for (const leagueId of defaultLeagueIds) {
    const result = await syncLeagueFixtures(leagueId, defaultSeason);
    combined.synced += result.synced;
    combined.skipped += result.skipped;
    combined.errors.push(...result.errors);
  }

  return combined;
}
