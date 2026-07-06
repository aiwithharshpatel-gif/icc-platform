-- Alter events table to add new columns
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS google_map_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS difficulty TEXT CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging')) DEFAULT 'Easy';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS checklist TEXT[] DEFAULT '{}';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS camping_type TEXT DEFAULT 'Mountain';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Create event registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

-- Enable RLS on event registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Event registrations policies
DROP POLICY IF EXISTS "Allow public read event registrations" ON public.event_registrations;
CREATE POLICY "Allow public read event registrations" 
  ON public.event_registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert own event registrations" ON public.event_registrations;
CREATE POLICY "Allow insert own event registrations"
  ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow delete own event registrations" ON public.event_registrations;
CREATE POLICY "Allow delete own event registrations"
  ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, event_id)
);

-- Enable RLS on bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Bookmarks policies
DROP POLICY IF EXISTS "Allow public read bookmarks" ON public.bookmarks;
CREATE POLICY "Allow public read bookmarks" 
  ON public.bookmarks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert own bookmarks" ON public.bookmarks;
CREATE POLICY "Allow insert own bookmarks"
  ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow delete own bookmarks" ON public.bookmarks;
CREATE POLICY "Allow delete own bookmarks"
  ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);
