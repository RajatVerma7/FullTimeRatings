export interface Team {
  id: string;
  name: string;
  slug: string;
}

export interface Tournament {
  id: string;
  name: string;
  slug: string;
}

export interface Match {
  id: string;
  slug: string;
  homeTeam: Team;
  awayTeam: Team;
  tournament: Tournament;
  matchDate: string;
  homeScore: number | null;
  awayScore: number | null;
  avgRating: number;
  ratingCount: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  matchId: string;
  title?: string;
  content: string;
  rating?: number;
  helpfulCount: number;
  createdAt: string;
}

export interface MatchList {
  id: string;
  title: string;
  slug: string;
  description?: string;
  username: string;
  matchCount: number;
}
