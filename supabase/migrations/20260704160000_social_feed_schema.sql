-- Social Feed Module Schema
-- Creates tables for posts, comments, likes, poll votes, and notifications

-- ============================================
-- 1. Feed Posts
-- ============================================
CREATE TABLE IF NOT EXISTS feed_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Anonymous Camper',
  author_avatar TEXT,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'photo', 'question', 'poll')),
  content TEXT NOT NULL,
  photos JSONB DEFAULT '[]'::jsonb,
  poll_options JSONB DEFAULT '[]'::jsonb,
  poll_total_votes INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_feed_posts_created ON feed_posts(created_at DESC);
CREATE INDEX idx_feed_posts_author ON feed_posts(author_id);
CREATE INDEX idx_feed_posts_type ON feed_posts(type);

-- ============================================
-- 2. Feed Comments (with nested replies)
-- ============================================
CREATE TABLE IF NOT EXISTS feed_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES feed_comments(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous Camper',
  author_avatar TEXT,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_feed_comments_post ON feed_comments(post_id, created_at);
CREATE INDEX idx_feed_comments_parent ON feed_comments(parent_comment_id);

-- ============================================
-- 3. Feed Likes (polymorphic: post or comment)
-- ============================================
CREATE TABLE IF NOT EXISTS feed_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES feed_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT like_target CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

-- ============================================
-- 4. Feed Poll Votes
-- ============================================
CREATE TABLE IF NOT EXISTS feed_poll_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- ============================================
-- 5. Feed Notifications
-- ============================================
CREATE TABLE IF NOT EXISTS feed_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'reply', 'follow', 'mention', 'poll_result')),
  actor_name TEXT NOT NULL,
  actor_avatar TEXT,
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_feed_notifications_user ON feed_notifications(user_id, created_at DESC);
CREATE INDEX idx_feed_notifications_unread ON feed_notifications(user_id, is_read) WHERE is_read = false;

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_notifications ENABLE ROW LEVEL SECURITY;

-- Public read for posts and comments
CREATE POLICY "Anyone can read posts" ON feed_posts FOR SELECT USING (true);
CREATE POLICY "Anyone can read comments" ON feed_comments FOR SELECT USING (true);

-- Authenticated users can create
CREATE POLICY "Auth users can create posts" ON feed_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Auth users can delete own posts" ON feed_posts FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Auth users can create comments" ON feed_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Auth users can like" ON feed_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth users can unlike" ON feed_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Auth users can vote" ON feed_poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications only visible to owner
CREATE POLICY "Users see own notifications" ON feed_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON feed_notifications FOR UPDATE USING (auth.uid() = user_id);
