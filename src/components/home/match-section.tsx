import Link from "next/link";
import { MatchCard } from "@/components/match/match-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Match } from "@/types";

interface MatchSectionProps {
  title: string;
  matches: Match[];
  href?: string;
  emptyMessage?: string;
}

export function MatchSection({ title, matches, href, emptyMessage }: MatchSectionProps) {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {href && matches.length > 0 && (
          <Link href={href} className="text-sm font-medium text-accent hover:underline">
            See all →
          </Link>
        )}
      </div>
      {matches.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matches yet"
          description={emptyMessage ?? "Matches will appear here once added to the database."}
        />
      )}
    </section>
  );
}
