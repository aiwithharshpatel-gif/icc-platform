-- Alter profiles table to add new columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievements TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trips_joined INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS events_organized INTEGER DEFAULT 0;

-- Create follows table
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

-- Enable RLS on follows
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Follows policies
DROP POLICY IF EXISTS "Allow public read follows" ON public.follows;
CREATE POLICY "Allow public read follows" 
  ON public.follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert own follows" ON public.follows;
CREATE POLICY "Allow insert own follows"
  ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Allow delete own follows" ON public.follows;
CREATE POLICY "Allow delete own follows"
  ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Update handle_new_user function to include defaults for new columns
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
