const API_BASE = "https://v3.football.api-sports.io";

export function getApiFootballConfig() {
  const apiKey = process.env.API_FOOTBALL_KEY;

  return {
    apiKey,
    isConfigured: Boolean(apiKey),
    baseUrl: API_BASE,
    // API-Football league IDs — customize when syncing
    // 2 = UEFA Champions League, 39 = Premier League, 1 = World Cup
    defaultLeagueIds: (process.env.API_FOOTBALL_LEAGUE_IDS ?? "2,39,140,61,1")
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter(Boolean),
    defaultSeason: parseInt(process.env.API_FOOTBALL_SEASON ?? String(new Date().getFullYear()), 10),
  };
}
