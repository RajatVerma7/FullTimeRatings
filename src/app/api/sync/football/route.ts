import { NextResponse } from "next/server";
import { syncAllLeagues, syncLeagueFixtures } from "@/lib/api-football/sync";

/**
 * POST /api/sync/football
 *
 * Sync match data from API-Football into the database.
 * Requires SYNC_SECRET header when SYNC_SECRET env is set.
 *
 * Body (optional): { "leagueId": 2, "season": 2023 }
 * Omit body to sync all leagues from API_FOOTBALL_LEAGUE_IDS.
 */
export async function POST(request: Request) {
  const syncSecret = process.env.SYNC_SECRET;
  if (syncSecret && request.headers.get("x-sync-secret") !== syncSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const result =
      body.leagueId != null
        ? await syncLeagueFixtures(Number(body.leagueId), Number(body.season ?? new Date().getFullYear()))
        : await syncAllLeagues();

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
