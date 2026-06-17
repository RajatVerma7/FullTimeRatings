"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SsoButtons } from "@/components/auth/sso-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState(
    searchParams.get("error") === "auth_callback_failed"
      ? "Sign in failed. Please try again."
      : ""
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    const { error } = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
    } else if (isSignUp) {
      setMessage("Check your email to confirm your account.");
    } else {
      router.push(redirectTo);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-black">
        {isSignUp ? "Join MatchDB" : "Sign In"}
      </h1>
      <p className="mt-2 text-center text-muted">
        Rate matches, write reviews, and build your football legacy.
      </p>

      <Card className="mt-8 p-6">
        <SsoButtons redirectTo={redirectTo} />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1"
            />
          </div>
          {message && <p className="text-sm text-accent">{message}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 w-full text-center text-sm text-muted hover:text-accent"
        >
          {isSignUp ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </Card>

      <Link href="/" className="mt-6 text-center text-sm text-muted hover:text-accent">
        ← Back to home
      </Link>
    </div>
  );
}
