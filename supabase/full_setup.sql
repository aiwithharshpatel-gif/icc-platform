-- ============================================================
-- ICC Platform — Full Database Setup Script
-- Run this ONCE in the Supabase SQL Editor to initialize
-- all tables, RLS policies, triggers, indexes, and seed data.
-- ============================================================

-- ============================================================
-- MIGRATION 1: Core Tables (profiles, campsites, events)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT,
  avatar_url TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  instagram TEXT,
  camping_experience TEXT CHECK (camping_experience IN ('Beginner', 'Intermediate', 'Expert')),
  vehicle TEXT CHECK (vehicle IN ('None', 'Two-Wheeler', 'Four-Wheeler', 'RV/Camper')),
  bio TEXT
);

CREATE TABLE IF NOT EXISTS public.campsites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  terrain TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  description TEXT,
  amenities TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  price NUMERIC NOT NULL,
  guide TEXT NOT NULL,
  guide_title TEXT NOT NULL,
  capacity TEXT NOT NULL,
  availability TEXT NOT NULL,
  status TEXT NOT NULL,
  image_url TEXT,
  description TEXT
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campsites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow public read campsites"
  ON public.campsites FOR SELECT USING (true);
CREATE POLICY "Allow admin write campsites"
  ON public.campsites FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read events"
  ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow admin write events"
  ON public.events FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- MIGRATION 2: Member Module (profile extensions + follows)
-- ============================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievements TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trips_joined INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS events_organized INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read follows" ON public.follows;
CREATE POLICY "Allow public read follows"
  ON public.follows FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert own follows" ON public.follows;
CREATE POLICY "Allow insert own follows"
  ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
DROP POLICY IF EXISTS "Allow delete own follows" ON public.follows;
CREATE POLICY "Allow delete own follows"
  ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- ============================================================
-- MIGRATION 3: Event Management (registrations + bookmarks)
-- ============================================================

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS google_map_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging')) DEFAULT 'Easy';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS checklist TEXT[] DEFAULT '{}';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS camping_type TEXT DEFAULT 'Mountain';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.event_registrations (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read event registrations" ON public.event_registrations;
CREATE POLICY "Allow public read event registrations"
  ON public.event_registrations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert own event registrations" ON public.event_registrations;
CREATE POLICY "Allow insert own event registrations"
  ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow delete own event registrations" ON public.event_registrations;
CREATE POLICY "Allow delete own event registrations"
  ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read bookmarks" ON public.bookmarks;
CREATE POLICY "Allow public read bookmarks"
  ON public.bookmarks FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert own bookmarks" ON public.bookmarks;
CREATE POLICY "Allow insert own bookmarks"
  ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Allow delete own bookmarks"
  ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- MIGRATION 4: Campsites Directory (extended columns)
-- ============================================================

ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS map_url TEXT;
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS has_water BOOLEAN DEFAULT TRUE;
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS has_washroom BOOLEAN DEFAULT TRUE;
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS has_parking BOOLEAN DEFAULT TRUE;
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS network_details TEXT DEFAULT 'Available';
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Challenging')) DEFAULT 'Beginner';
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS best_season TEXT DEFAULT 'Oct - May';
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS nearby_attractions TEXT[] DEFAULT '{}';
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS altitude INTEGER DEFAULT 500;
ALTER TABLE public.campsites ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'Maharashtra';

-- ============================================================
-- MIGRATION 5: Social Feed (posts, comments, likes, polls, notifications)
-- ============================================================

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

CREATE TABLE IF NOT EXISTS feed_poll_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

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

ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts" ON feed_posts FOR SELECT USING (true);
CREATE POLICY "Anyone can read comments" ON feed_comments FOR SELECT USING (true);
CREATE POLICY "Auth users can create posts" ON feed_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Auth users can delete own posts" ON feed_posts FOR DELETE USING (auth.uid() = author_id);
CREATE POLICY "Auth users can create comments" ON feed_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Auth users can like" ON feed_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth users can unlike" ON feed_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Auth users can vote" ON feed_poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users see own notifications" ON feed_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON feed_notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- MIGRATION 6: Admin Dashboard (roles, logs, reports, approvals)
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_admin_roles_user ON admin_roles(user_id);
CREATE INDEX idx_admin_roles_role ON admin_roles(role);

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_name TEXT NOT NULL DEFAULT 'System',
  action TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'update', 'delete', 'approve', 'reject', 'suspend', 'restore')),
  target_type TEXT NOT NULL,
  target_id TEXT,
  target_name TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activity_logs_created ON admin_activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX idx_activity_logs_type ON admin_activity_logs(action_type);

CREATE TABLE IF NOT EXISTS content_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_name TEXT NOT NULL DEFAULT 'Anonymous',
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment', 'member', 'event', 'campsite')),
  content_id TEXT NOT NULL,
  content_preview TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_reports_status ON content_reports(status, created_at DESC);
CREATE INDEX idx_reports_type ON content_reports(content_type);

CREATE TABLE IF NOT EXISTS pending_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL CHECK (item_type IN ('event', 'campsite', 'post')),
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  item_preview TEXT,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_by_name TEXT NOT NULL DEFAULT 'Unknown',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_approvals_status ON pending_approvals(status, created_at DESC);
CREATE INDEX idx_approvals_type ON pending_approvals(item_type);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage roles" ON admin_roles FOR ALL USING (true);
CREATE POLICY "Read activity logs" ON admin_activity_logs FOR SELECT USING (true);
CREATE POLICY "Insert activity logs" ON admin_activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Read reports" ON content_reports FOR ALL USING (true);
CREATE POLICY "Manage approvals" ON pending_approvals FOR ALL USING (true);

-- ============================================================
-- AUTO-PROFILE TRIGGER (creates profile on user signup)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, name, avatar_url, city, state, phone, instagram, camping_experience, vehicle, bio,
    cover_photo_url, twitter, github, website, gallery, achievements, trips_joined, events_organized
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'city', ''),
    COALESCE(new.raw_user_meta_data->>'state', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'instagram', ''),
    COALESCE(new.raw_user_meta_data->>'camping_experience', 'Beginner'),
    COALESCE(new.raw_user_meta_data->>'vehicle', 'None'),
    COALESCE(new.raw_user_meta_data->>'bio', ''),
    '',
    '',
    '',
    '',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    0,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED DATA (sample campsites and events)
-- ============================================================

INSERT INTO public.campsites (id, title, location, price, rating, reviews_count, terrain, tags, image_url, description, amenities) VALUES
('c1', 'Camp Roxx', 'Kangojodi, Himachal Pradesh', 2200, 4.8, 248, 'Forest', ARRAY['Forest', 'Adventure', 'Zip-lining'], 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80', 'Nestled inside a private 1,700-acre pine forest near Nahan. Features alpine cabin tents, nature trails, rock climbing, and zip-lining over pure mountain streams.', ARRAY['Cabin Tents', 'Running Water', 'First Aid', 'Adventure Sports', 'Bonfire Pit']),
('c2', 'Winds Desert Camp', 'Sam Sand Dunes, Jaisalmer', 4500, 4.9, 312, 'Desert', ARRAY['Desert', 'Cultural Show', 'Camel Safari'], 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80', 'Experience royal Rajasthani hospitality at Kanoi near Sam Sand Dunes. Luxury Swiss tents with attached bathrooms, camel safaris, and evening folk performances under Thar''s starry skies.', ARRAY['Attached Bath', 'Swiss Luxury Tents', 'Rajasthani Buffet', 'Cultural Show', 'Stargazing']),
('c3', 'Pawna Lake Camping', 'Thakursai, Lonavala', 1500, 4.7, 512, 'Lakeside', ARRAY['Lakeside', 'Bonfire & DJ', 'Kayaking'], 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=800&q=80', 'Relax by the calm waters of Pawna Lake in Thakursai. Offers dome tents, delicious local Maharashtrian barbecue, acoustic music nights, and scenic views of Tikona Fort.', ARRAY['Lakeside Tents', 'Barbecue', 'DJ Night', 'Toilets', 'Charging Points']),
('c4', 'Shivpuri Riverside Camp', 'Shivpuri, Rishikesh', 1800, 4.8, 420, 'Riverside', ARRAY['Riverside', 'Rafting', 'Bonfire'], 'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=800&q=80', 'Located on the sandy banks of the Ganges in Shivpuri. Wake up to the roar of river rapids, enjoy beach volleyball, and set off on world-class white water rafting expeditions.', ARRAY['Dome Tents', 'Rafting Access', 'Volleyball Court', 'First Aid', 'Clean Washrooms'])
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  terrain = EXCLUDED.terrain,
  tags = EXCLUDED.tags,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description,
  amenities = EXCLUDED.amenities;

INSERT INTO public.events (id, title, location, date, price, guide, guide_title, capacity, availability, status, image_url, description) VALUES
('e1', 'Monsoon Trek & Camp', 'Harishchandragad, MH', 'July 15-16, 2026', 2200, 'Sameer Joshi', 'Western Ghats Specialist', '25 Campers', '8 Slots Left', 'Upcoming', 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80', 'Experience the monsoon beauty of Harishchandragad fort, camp above the clouds, and view the iconic Kokankada cliff.'),
('e2', 'High Altitude Expedition', 'Hampta Pass, HP', 'Aug 10-15, 2026', 9500, 'Aryan Negi', 'Himalayan Guide', '15 Campers', '4 Slots Left', 'Upcoming', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', 'Cross the lush green valleys of Kullu to the stark high-altitude deserts of Spiti Valley over the glorious Hampta Pass.'),
('e3', 'Beach Trek & Stargazing', 'Gokarna, Karnataka', 'Sept 04-06, 2026', 4500, 'Priya Nair', 'Coastal Trek Leader', '30 Campers', '12 Slots Left', 'Upcoming', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80', 'A weekend coastal beach trek covering Om Beach, Half Moon Beach, and Paradise Beach, topped with astronomical stargazing sessions.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- DONE! Your ICC database is fully initialized.
-- ============================================================
