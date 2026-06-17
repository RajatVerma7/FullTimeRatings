import type { Metadata } from "next";
import { ReviewCard } from "@/components/match/review-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getRecentReviews } from "@/lib/queries/reviews";

export const metadata: Metadata = {
  title: "Community",
  description: "Latest reviews from the MatchDB community.",
};

export default async function CommunityPage() {
  const reviews = await getRecentReviews(50);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black">Community Reviews</h1>
      <p className="mt-2 text-muted">The latest takes from football fans around the world.</p>

      {reviews.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No reviews yet"
          description="Reviews will appear here once users start rating and reviewing matches."
        />
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
