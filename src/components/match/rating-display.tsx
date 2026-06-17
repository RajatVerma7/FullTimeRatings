import { formatNumber, formatRating, ratingToStars } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  count: number;
  size?: "sm" | "lg";
}

export function RatingDisplay({ rating, count, size = "lg" }: RatingDisplayProps) {
  const isLarge = size === "lg";

  return (
    <div className={`rounded-xl border border-border bg-card ${isLarge ? "p-6" : "p-4"}`}>
      <div className="flex items-start gap-4">
        <div className="text-center">
          <div className={`font-black text-accent ${isLarge ? "text-5xl" : "text-3xl"}`}>
            {formatRating(rating)}
          </div>
          <div className={`text-muted ${isLarge ? "text-sm" : "text-xs"}`}>/ 10</div>
        </div>
        <div className="flex-1">
          <p className={`tracking-widest text-accent ${isLarge ? "text-lg" : "text-sm"}`}>
            {ratingToStars(rating)}
          </p>
          <p className={`mt-2 text-muted ${isLarge ? "text-sm" : "text-xs"}`}>
            Based on {formatNumber(count)} ratings
          </p>
        </div>
      </div>
    </div>
  );
}
