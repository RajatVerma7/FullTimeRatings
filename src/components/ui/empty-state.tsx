import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center",
        className
      )}
    >
      <Inbox className="h-10 w-10 text-muted" />
      <p className="mt-4 font-semibold">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
    </div>
  );
}
