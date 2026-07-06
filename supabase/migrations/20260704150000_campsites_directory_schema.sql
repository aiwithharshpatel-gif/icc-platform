-- Alter campsites table to support directory details and coordinates
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
