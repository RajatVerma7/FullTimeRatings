"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return <div className="hidden h-8 w-20 animate-pulse rounded-lg bg-hover sm:block" />;
  }

  if (!user) {
    return (
      <Link href="/login" className="hidden sm:block">
        <Button variant="default" size="sm">
          Sign In
        </Button>
      </Link>
    );
  }

  const username =
    user.user_metadata?.preferred_username ??
    user.user_metadata?.user_name ??
    user.email?.split("@")[0] ??
    "User";

  return (
    <div className="hidden items-center gap-3 sm:flex">
      <div className="flex items-center gap-2">
        <Avatar username={username} src={user.user_metadata?.avatar_url ?? user.user_metadata?.picture} size="sm" />
        <span className="max-w-[120px] truncate text-sm font-medium">{username}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}
