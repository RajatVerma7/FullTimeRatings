import { getApiFootballConfig } from "./config";
import type { ApiFootballFixturesResponse } from "./types";

export class ApiFootballError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiFootballError";
  }
}

export async function apiFootballFetch<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  const { apiKey, baseUrl, isConfigured } = getApiFootballConfig();

  if (!isConfigured) {
    throw new ApiFootballError("API_FOOTBALL_KEY is not set. Add it to .env.local when ready.");
  }

  const url = new URL(`${baseUrl}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const res = await fetch(url.toString(), {
    headers: { "x-apisports-key": apiKey! },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new ApiFootballError(`API-Football request failed: ${res.status}`, res.status);
  }

  const data = (await res.json()) as T & { errors?: Record<string, string> | unknown[] };

  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new ApiFootballError(`API-Football error: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

/** Fetch finished fixtures for a league + season */
export function fetchFixtures(leagueId: number, season: number) {
  return apiFootballFetch<ApiFootballFixturesResponse>("/fixtures", {
    league: leagueId,
    season,
    status: "FT",
  });
}
