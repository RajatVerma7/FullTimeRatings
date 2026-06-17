import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-black text-accent">MatchDB</p>
            <p className="mt-2 text-sm text-muted">
              The home of football match ratings. Discover, rate, and review the greatest games ever played.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/top-rated" className="hover:text-accent">Top Rated</Link></li>
              <li><Link href="/tournaments" className="hover:text-accent">Tournaments</Link></li>
              <li><Link href="/lists" className="hover:text-accent">Lists</Link></li>
              <li><Link href="/search" className="hover:text-accent">Search</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Community</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/community" className="hover:text-accent">Reviews</Link></li>
              <li><Link href="/lists" className="hover:text-accent">User Lists</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="#" className="hover:text-accent">Privacy</Link></li>
              <li><Link href="#" className="hover:text-accent">Terms</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} MatchDB. Football data for demonstration purposes.
        </p>
      </div>
    </footer>
  );
}
