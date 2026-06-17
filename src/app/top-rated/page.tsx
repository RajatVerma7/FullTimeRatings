import Link from "next/link";
import type { Metadata } from "next";
import { format } from "date-fns";
import { MatchCard } from "@/components/match/match-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getTopRatedMatches } from "@/lib/queries/matches";
import { formatRating } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Top Rated Matches",
  description: "The highest-rated football matches of all time on MatchDB.",
};

export default async function TopRatedPage() {
  const matches = await getTopRatedMatches();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black sm:text-4xl">Top Rated Matches</h1>
        <p className="mt-2 text-muted">
          The greatest football matches ever played, ranked by fan ratings.
        </p>
      </div>

      {matches.length === 0 ? (
        <EmptyState
          title="No rated matches yet"
          description="Matches will be ranked here once they are synced and rated by the community."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border md:block">
            <table className="w-full">
              <thead className="bg-card text-left text-sm text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">Match</th>
                  <th className="px-4 py-3 font-medium">Tournament</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, i) => (
                  <tr key={match.id} className="border-t border-border transition-colors hover:bg-hover">
                    <td className="px-4 py-3 font-bold text-muted">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/match/${match.slug}`} className="font-semibold hover:text-accent">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{match.tournament.name}</td>
                    <td className="px-4 py-3 text-sm text-muted">
                      {format(new Date(match.matchDate), "d MMM yyyy")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {match.homeScore != null && match.awayScore != null
                        ? `${match.homeScore} - ${match.awayScore}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-bold text-accent">{formatRating(match.avgRating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {matches.map((match, i) => (
              <MatchCard key={match.id} match={match} rank={i + 1} variant="horizontal" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
