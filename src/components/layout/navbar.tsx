"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthButton } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/top-rated", label: "Top Rated" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/lists", label: "Lists" },
  { href: "/community", label: "Community" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-accent">MatchDB</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-hover",
                pathname === link.href ? "text-accent" : "text-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-hover hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <AuthButton />

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-muted md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-card px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <form action="/search" className="mx-auto flex max-w-2xl gap-2">
            <Input
              name="q"
              placeholder="Search matches, teams, tournaments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <nav className="border-t border-border bg-card px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-hover hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setMobileOpen(false)} className="mt-2 block">
            <Button className="w-full" size="sm">Sign In</Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
