-- Create profiles table
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

-- Create campsites table
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

-- Create events table
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campsites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Campsites Policies
CREATE POLICY "Allow public read campsites" 
  ON public.campsites FOR SELECT USING (true);

CREATE POLICY "Allow admin write campsites" 
  ON public.campsites FOR ALL USING (auth.role() = 'authenticated');

-- Events Policies
CREATE POLICY "Allow public read events" 
  ON public.events FOR SELECT USING (true);

CREATE POLICY "Allow admin write events" 
  ON public.events FOR ALL USING (auth.role() = 'authenticated');

-- Automatic Profile Sync trigger on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, name, avatar_url, city, state, phone, instagram, camping_experience, vehicle, bio
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
    COALESCE(new.raw_user_meta_data->>'bio', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create trigger if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
