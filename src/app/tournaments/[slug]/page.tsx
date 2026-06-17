import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MatchCard } from "@/components/match/match-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getMatchesByTournament } from "@/lib/queries/matches";
import { getTournamentBySlug } from "@/lib/queries/tournaments";

interface TournamentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TournamentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tournament = await getTournamentBySlug(slug);
  return { title: tournament?.name ?? "Tournament" };
}

export default async function TournamentPage({ params }: TournamentPageProps) {
  const { slug } = await params;
  const tournament = await getTournamentBySlug(slug);
  if (!tournament) notFound();

  const matches = await getMatchesByTournament(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black">{tournament.name}</h1>
      <p className="mt-2 text-muted">{matches.length} matches</p>

      {matches.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No matches in this tournament yet"
          description="Sync fixtures from API-Football to populate this tournament."
        />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
