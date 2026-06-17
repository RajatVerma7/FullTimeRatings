import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MatchCard } from "@/components/match/match-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getListBySlug } from "@/lib/queries/lists";
import { getListMatches } from "@/lib/queries/matches";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const list = await getListBySlug(slug);
  return { title: list?.title ?? "List" };
}

export default async function ListPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const list = await getListBySlug(slug);
  if (!list) notFound();

  const matches = await getListMatches(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-sm text-accent">List by {list.username}</p>
      <h1 className="mt-1 text-3xl font-black">{list.title}</h1>
      {list.description && <p className="mt-2 text-muted">{list.description}</p>}

      {matches.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="This list is empty"
          description="Matches will appear here once they are added to this list."
        />
      ) : (
        <div className="mt-8 space-y-3">
          {matches.map((match, i) => (
            <MatchCard key={match.id} match={match} rank={i + 1} variant="horizontal" />
          ))}
        </div>
      )}
    </div>
  );
}
