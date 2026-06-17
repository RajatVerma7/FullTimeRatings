import { cn } from "@/lib/utils";

interface AvatarProps {
  username: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 text-xl" };

export function Avatar({ username, src, size = "md", className }: AvatarProps) {
  const initials = username.slice(0, 2).toUpperCase();

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={username}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-accent/20 font-bold text-accent",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
