import type { Metadata } from "next";
import Link from "next/link";
import { List } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublicLists } from "@/lib/queries/lists";

export const metadata: Metadata = {
  title: "Community Lists",
  description: "Curated football match lists from the MatchDB community.",
};

export default async function ListsPage() {
  const lists = await getPublicLists();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black">Community Lists</h1>
      <p className="mt-2 text-muted">Curated collections of the greatest matches, by fans for fans.</p>

      {lists.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No lists yet"
          description="Community lists will appear here once users create them."
        />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <Link key={list.id} href={`/lists/${list.slug}`}>
              <Card className="group p-6 transition-all hover:border-accent/40 hover:bg-hover">
                <List className="h-6 w-6 text-accent" />
                <h2 className="mt-3 text-xl font-bold group-hover:text-accent">{list.title}</h2>
                {list.description && <p className="mt-2 text-sm text-muted">{list.description}</p>}
                <p className="mt-3 text-xs text-muted">
                  by {list.username} · {list.matchCount} matches
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
