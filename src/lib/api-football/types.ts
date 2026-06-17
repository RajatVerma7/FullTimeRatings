/** API-Football response types — only fields we use (match, score, date, tournament) */

export interface ApiFootballFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string };
  };
  league: {
    id: number;
    name: string;
    season: number;
  };
  teams: {
    home: { id: number; name: string };
    away: { id: number; name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

export interface ApiFootballFixturesResponse {
  response: ApiFootballFixture[];
  errors: Record<string, string> | unknown[];
  paging: { current: number; total: number };
}

export interface ApiFootballLeague {
  league: { id: number; name: string; type: string };
  country: { name: string };
  seasons: { year: number; current: boolean }[];
}

export interface ApiFootballLeaguesResponse {
  response: ApiFootballLeague[];
  errors: Record<string, string> | unknown[];
}
