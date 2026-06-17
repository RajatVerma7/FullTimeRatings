-- MatchDB complete schema
-- Teams, tournaments, matches + user ratings/reviews/lists + SSO profile trigger

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Core football data ───────────────────────────────────────────────────────

CREATE TABLE teams (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  external_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tournaments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  external_id INTEGER UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE matches (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  external_id INTEGER UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  home_team_id TEXT NOT NULL REFERENCES teams(id),
  away_team_id TEXT NOT NULL REFERENCES teams(id),
  tournament_id TEXT NOT NULL REFERENCES tournaments(id),
  match_date TIMESTAMPTZ NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  avg_rating DOUBLE PRECISION NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_date ON matches(match_date DESC);
CREATE INDEX idx_matches_rating ON matches(avg_rating DESC);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_home_team ON matches(home_team_id);
CREATE INDEX idx_matches_away_team ON matches(away_team_id);

-- ─── Users (linked to Supabase Auth / SSO) ───────────────────────────────────

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);

-- Auto-create profile when user signs up via email or SSO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  base_username := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'preferred_username', ''),
    NULLIF(NEW.raw_user_meta_data->>'user_name', ''),
    NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
    'user'
  );
  base_username := lower(regexp_replace(base_username, '[^a-z0-9_]', '', 'g'));
  IF base_username = '' THEN
    base_username := 'user';
  END IF;
  final_username := base_username || '_' || substr(replace(NEW.id::text, '-', ''), 1, 8);

  INSERT INTO public.users (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'name', ''),
      NULLIF(NEW.raw_user_meta_data->>'user_name', '')
    ),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
      NULLIF(NEW.raw_user_meta_data->>'picture', '')
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Ratings & reviews ───────────────────────────────────────────────────────

CREATE TABLE ratings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  value INTEGER NOT NULL CHECK (value >= 1 AND value <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

CREATE INDEX idx_ratings_match ON ratings(match_id);
CREATE INDEX idx_ratings_user ON ratings(user_id);

CREATE TABLE reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_match ON reviews(match_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

CREATE TABLE likes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  review_id TEXT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, review_id)
);

CREATE INDEX idx_likes_review ON likes(review_id);

CREATE TABLE comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  review_id TEXT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_review ON comments(review_id);

-- ─── Lists & follows ─────────────────────────────────────────────────────────

CREATE TABLE lists (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

CREATE INDEX idx_lists_user ON lists(user_id);

CREATE TABLE list_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  note TEXT,
  UNIQUE(list_id, match_id)
);

CREATE INDEX idx_list_items_list ON list_items(list_id);

CREATE TABLE follows (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id <> following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- ─── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Public football data (read-only for everyone)
CREATE POLICY "teams_public_read" ON teams FOR SELECT USING (true);
CREATE POLICY "tournaments_public_read" ON tournaments FOR SELECT USING (true);
CREATE POLICY "matches_public_read" ON matches FOR SELECT USING (true);

-- Service role / sync writes football data (API sync uses service role key)
CREATE POLICY "teams_service_write" ON teams FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "tournaments_service_write" ON tournaments FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "matches_service_write" ON matches FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- User profiles
CREATE POLICY "users_public_read" ON users FOR SELECT USING (true);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Ratings
CREATE POLICY "ratings_public_read" ON ratings FOR SELECT USING (true);
CREATE POLICY "ratings_insert_own" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ratings_update_own" ON ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ratings_delete_own" ON ratings FOR DELETE USING (auth.uid() = user_id);

-- Reviews
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Likes
CREATE POLICY "likes_public_read" ON likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_own" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Comments
CREATE POLICY "comments_public_read" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_own" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete_own" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Lists
CREATE POLICY "lists_public_read" ON lists FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "lists_insert_own" ON lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lists_update_own" ON lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "lists_delete_own" ON lists FOR DELETE USING (auth.uid() = user_id);

-- List items (readable if list is public or owned)
CREATE POLICY "list_items_public_read" ON list_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM lists
    WHERE lists.id = list_items.list_id
      AND (lists.is_public = true OR lists.user_id = auth.uid())
  )
);
CREATE POLICY "list_items_manage_own" ON list_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM lists
    WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()
  )
);

-- Follows
CREATE POLICY "follows_public_read" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_own" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- ─── Updated-at helper ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER ratings_updated_at BEFORE UPDATE ON ratings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER lists_updated_at BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
