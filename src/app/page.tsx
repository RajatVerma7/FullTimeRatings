import { HeroSection } from "@/components/home/hero-section";
import { MatchSection } from "@/components/home/match-section";
import { RecentReviewsSection } from "@/components/home/recent-reviews";
import { getRecentMatches, getTopRatedMatches } from "@/lib/queries/matches";
import { getRecentReviews } from "@/lib/queries/reviews";

export default async function HomePage() {
  const [recentMatches, topRated, recentReviews] = await Promise.all([
    getRecentMatches(8),
    getTopRatedMatches(4),
    getRecentReviews(4),
  ]);

  const allMatches = [...recentMatches, ...topRated];

  return (
    <div>
      <HeroSection />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <MatchSection
          title="Recent Matches"
          matches={recentMatches.slice(0, 4)}
          href="/tournaments"
          emptyMessage="Matches will appear here after syncing from API-Football."
        />
        <MatchSection
          title="Top Rated Matches"
          matches={topRated}
          href="/top-rated"
        />
        <RecentReviewsSection reviews={recentReviews} matches={allMatches} />
      </div>
    </div>
  );
}
