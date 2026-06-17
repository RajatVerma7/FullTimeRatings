"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ratingSchema = z.object({
  matchId: z.string(),
  value: z.number().min(1).max(10),
});

export async function submitRating(matchId: string, value: number) {
  const parsed = ratingSchema.safeParse({ matchId, value });
  if (!parsed.success) return { error: "Invalid rating" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to rate matches" };

  const { error } = await supabase.from("ratings").upsert(
    { user_id: user.id, match_id: matchId, value },
    { onConflict: "user_id,match_id" }
  );

  if (error) return { error: error.message };

  revalidatePath(`/match/${matchId}`);
  return { success: true };
}

const reviewSchema = z.object({
  matchId: z.string(),
  title: z.string().optional(),
  content: z.string().min(10),
  rating: z.number().min(1).max(10).optional(),
});

export async function submitReview(data: z.infer<typeof reviewSchema>) {
  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid review" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to write reviews" };

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    match_id: parsed.data.matchId,
    title: parsed.data.title,
    content: parsed.data.content,
    rating: parsed.data.rating,
  });

  if (error) return { error: error.message };

  revalidatePath(`/match/${parsed.data.matchId}`);
  return { success: true };
}

export async function likeReview(reviewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in" };

  const { error } = await supabase.from("likes").insert({
    user_id: user.id,
    review_id: reviewId,
  });

  if (error) return { error: error.message };
  return { success: true };
}
