import type { Metadata } from "next";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getTournamentMatchCount, getTournaments } from "@/lib/queries/tournaments";

export const metadata: Metadata = {
  title: "Tournaments",
  description: "Browse football matches by tournament on MatchDB.",
};

export default async function TournamentsPage() {
  const tournaments = await getTournaments();
  const counts = await Promise.all(tournaments.map((t) => getTournamentMatchCount(t.slug)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black">Tournaments</h1>
      <p className="mt-2 text-muted">Explore matches by league and competition.</p>

      {tournaments.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No tournaments yet"
          description="Tournaments will appear after syncing match data from API-Football."
        />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((tournament, i) => (
            <Link key={tournament.id} href={`/tournaments/${tournament.slug}`}>
              <Card className="group p-6 transition-all hover:border-accent/40 hover:bg-hover">
                <Trophy className="h-8 w-8 text-accent" />
                <h2 className="mt-4 text-xl font-bold group-hover:text-accent">{tournament.name}</h2>
                <p className="mt-2 text-xs text-muted">{counts[i]} matches</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
