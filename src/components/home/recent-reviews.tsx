import Link from "next/link";
import { ReviewCard } from "@/components/match/review-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Match, Review } from "@/types";

interface RecentReviewsProps {
  reviews: Review[];
  matches: Match[];
}

export function RecentReviewsSection({ reviews, matches }: RecentReviewsProps) {
  const matchMap = Object.fromEntries(matches.map((m) => [m.id, m]));

  return (
    <section className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recent Reviews</h2>
        {reviews.length > 0 && (
          <Link href="/community" className="text-sm font-medium text-accent hover:underline">
            See all →
          </Link>
        )}
      </div>
      {reviews.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {reviews.map((review) => {
            const match = matchMap[review.matchId];
            return (
              <div key={review.id}>
                {match && (
                  <Link
                    href={`/match/${match.slug}`}
                    className="mb-2 block text-xs font-medium text-accent hover:underline"
                  >
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </Link>
                )}
                <ReviewCard review={review} />
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No reviews yet"
          description="Be the first to review a match once data is available."
        />
      )}
    </section>
  );
}
