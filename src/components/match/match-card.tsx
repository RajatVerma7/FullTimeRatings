import Link from "next/link";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatNumber, formatRating } from "@/lib/utils";
import type { Match } from "@/types";

interface MatchCardProps {
  match: Match;
  rank?: number;
  variant?: "default" | "horizontal";
}

function formatScore(home: number | null, away: number | null): string {
  if (home == null || away == null) return "—";
  return `${home} - ${away}`;
}

export function MatchCard({ match, rank, variant = "default" }: MatchCardProps) {
  const date = format(new Date(match.matchDate), "MMM d, yyyy");
  const score = formatScore(match.homeScore, match.awayScore);

  if (variant === "horizontal") {
    return (
      <Link href={`/match/${match.slug}`}>
        <Card className="group flex items-center gap-4 p-4 transition-all duration-200 hover:bg-hover hover:border-accent/30">
          {rank && <span className="w-8 shrink-0 text-lg font-bold text-muted">{rank}</span>}
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold group-hover:text-accent transition-colors">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </p>
            <p className="text-sm text-muted">
              {match.tournament.name} · {date}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold">{score}</p>
            {match.ratingCount > 0 && (
              <p className="text-xs text-accent">{formatRating(match.avgRating)} / 10</p>
            )}
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/match/${match.slug}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
        <div className="relative h-32 bg-gradient-to-br from-hover via-card to-background p-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
          <Badge className="relative">{match.tournament.name}</Badge>
          <div className="relative mt-6 text-center">
            <p className="text-2xl font-black tracking-wider">{score}</p>
            <p className="text-xs text-muted">{date}</p>
          </div>
        </div>
        <div className="p-4">
          <p className="truncate font-semibold group-hover:text-accent transition-colors">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </p>
          {match.ratingCount > 0 && (
            <div className="mt-3 flex items-center gap-1 text-accent">
              <Star className="h-4 w-4 fill-accent" />
              <span className="font-bold">{formatRating(match.avgRating)}</span>
              <span className="text-muted text-sm">/ 10 · {formatNumber(match.ratingCount)}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
