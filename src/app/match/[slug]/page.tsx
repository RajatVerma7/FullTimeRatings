import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MatchPageClient } from "@/components/match/match-page-client";
import { getMatchBySlug } from "@/lib/queries/matches";
import { getReviewsForMatch } from "@/lib/queries/reviews";

interface MatchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  if (!match) return { title: "Match Not Found" };

  const score =
    match.homeScore != null && match.awayScore != null
      ? `${match.homeScore}-${match.awayScore}`
      : "TBD";

  const title = `${match.homeTeam.name} vs ${match.awayTeam.name} (${score})`;
  return {
    title,
    description: `${match.tournament.name} — ${new Date(match.matchDate).toLocaleDateString()} on MatchDB.`,
    openGraph: { title, description: match.tournament.name },
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  if (!match) notFound();

  const reviews = await getReviewsForMatch(match.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    startDate: match.matchDate,
    ...(match.ratingCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: match.avgRating,
        bestRating: 10,
        ratingCount: match.ratingCount,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MatchPageClient match={match} reviews={reviews} />
    </>
  );
}
