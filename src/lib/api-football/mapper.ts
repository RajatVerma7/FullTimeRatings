import { format } from "date-fns";
import { slugify } from "@/lib/utils";
import type { ApiFootballFixture } from "./types";

export function slugFromTeamName(name: string): string {
  return slugify(name);
}

export function matchSlugFromFixture(fixture: ApiFootballFixture): string {
  const home = slugFromTeamName(fixture.teams.home.name);
  const away = slugFromTeamName(fixture.teams.away.name);
  const date = format(new Date(fixture.fixture.date), "yyyy-MM-dd");
  return `${home}-vs-${away}-${date}`;
}

export function tournamentSlugFromName(name: string): string {
  return slugify(name);
}

export interface MappedFixture {
  externalId: number;
  slug: string;
  matchDate: Date;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: { externalId: number; name: string; slug: string };
  awayTeam: { externalId: number; name: string; slug: string };
  tournament: { externalId: number; name: string; slug: string };
}

/** Map API-Football fixture → our minimal match shape */
export function mapFixture(fixture: ApiFootballFixture): MappedFixture {
  return {
    externalId: fixture.fixture.id,
    slug: matchSlugFromFixture(fixture),
    matchDate: new Date(fixture.fixture.date),
    homeScore: fixture.goals.home,
    awayScore: fixture.goals.away,
    homeTeam: {
      externalId: fixture.teams.home.id,
      name: fixture.teams.home.name,
      slug: slugFromTeamName(fixture.teams.home.name),
    },
    awayTeam: {
      externalId: fixture.teams.away.id,
      name: fixture.teams.away.name,
      slug: slugFromTeamName(fixture.teams.away.name),
    },
    tournament: {
      externalId: fixture.league.id,
      name: fixture.league.name,
      slug: tournamentSlugFromName(fixture.league.name),
    },
  };
}
