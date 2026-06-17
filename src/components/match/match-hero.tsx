import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Match } from "@/types";

interface MatchHeroProps {
  match: Match;
  scoreLabel: string;
}

export function MatchHero({ match, scoreLabel }: MatchHeroProps) {
  const date = format(new Date(match.matchDate), "d MMMM yyyy");

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-card/80 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <Badge className="mb-4">{match.tournament.name}</Badge>
        <h1 className="mt-2 text-3xl font-black sm:text-5xl">
          {match.homeTeam.name}{" "}
          <span className="text-muted">vs</span>{" "}
          {match.awayTeam.name}
        </h1>
        <div className="mt-6 flex items-center gap-1.5 text-sm text-muted">
          <Calendar className="h-4 w-4" />
          {date}
        </div>
        <div className="mt-8 flex items-center justify-center gap-8 sm:gap-16">
          <TeamBlock name={match.homeTeam.name} />
          <div className="text-center">
            <p className="text-5xl font-black tracking-wider sm:text-7xl">{scoreLabel}</p>
          </div>
          <TeamBlock name={match.awayTeam.name} />
        </div>
      </div>
    </section>
  );
}

function TeamBlock({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-hover text-xs font-bold ring-2 ring-border sm:h-20 sm:w-20 sm:text-sm">
        {initials}
      </div>
      <p className="max-w-[140px] text-center text-sm font-medium">{name}</p>
    </div>
  );
}
