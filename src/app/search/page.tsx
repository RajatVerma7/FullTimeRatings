import type { Metadata } from "next";
import Link from "next/link";
import { MatchCard } from "@/components/match/match-card";
import { EmptyState } from "@/components/ui/empty-state";
import { searchMatches } from "@/lib/queries/matches";

export const metadata: Metadata = {
  title: "Search Matches",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const results = q ? await searchMatches(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black">Search</h1>
      {q ? (
        <>
          <p className="mt-2 text-muted">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
          </p>
          {results.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-8"
              title="No matches found"
              description="Try a different search term, or check back once matches are added."
            />
          )}
        </>
      ) : (
        <p className="mt-4 text-muted">
          Use the search bar to find matches by team or tournament.
        </p>
      )}
      <Link href="/" className="mt-8 inline-block text-sm text-accent hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
