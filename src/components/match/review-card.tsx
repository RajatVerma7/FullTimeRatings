import { formatDistanceToNow } from "date-fns";
import { ThumbsUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="p-5 transition-colors hover:bg-hover/50">
      <div className="flex items-start gap-3">
        <Avatar username={review.username} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{review.username}</span>
            {review.rating && (
              <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent">
                {review.rating}/10
              </span>
            )}
            <span className="text-xs text-muted">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
          {review.title && (
            <h4 className="mt-2 font-bold text-foreground">{review.title}</h4>
          )}
          <p className="mt-2 text-sm leading-relaxed text-muted">{review.content}</p>
          <button className="mt-3 flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent">
            <ThumbsUp className="h-3.5 w-3.5" />
            Helpful ({review.helpfulCount.toLocaleString()})
          </button>
        </div>
      </div>
    </Card>
  );
}
