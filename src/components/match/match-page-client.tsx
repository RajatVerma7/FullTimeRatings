"use client";

import { useState } from "react";
import { MatchHero } from "@/components/match/match-hero";
import { RatingDisplay } from "@/components/match/rating-display";
import { ReviewCard } from "@/components/match/review-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import type { Match, Review } from "@/types";

interface MatchPageClientProps {
  match: Match;
  reviews: Review[];
}

const reviewTabs = [
  { id: "helpful", label: "Most Helpful" },
  { id: "recent", label: "Most Recent" },
  { id: "highest", label: "Highest Rated" },
  { id: "lowest", label: "Lowest Rated" },
];

export function MatchPageClient({ match, reviews }: MatchPageClientProps) {
  const [reviewSort, setReviewSort] = useState("helpful");

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === "helpful") return b.helpfulCount - a.helpfulCount;
    if (reviewSort === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (reviewSort === "highest") return (b.rating ?? 0) - (a.rating ?? 0);
    return (a.rating ?? 0) - (b.rating ?? 0);
  });

  const scoreLabel =
    match.homeScore != null && match.awayScore != null
      ? `${match.homeScore} - ${match.awayScore}`
      : "—";

  return (
    <div>
      <MatchHero match={match} scoreLabel={scoreLabel} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold">
              Reviews ({match.reviewCount.toLocaleString()})
            </h2>
            <Tabs tabs={reviewTabs} active={reviewSort} onChange={setReviewSort} className="mb-4" />
            {sortedReviews.length > 0 ? (
              <div className="space-y-4">
                {sortedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No reviews yet"
                description="Be the first to review this match."
              />
            )}
          </div>
          <div>
            <RatingDisplay rating={match.avgRating} count={match.ratingCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
