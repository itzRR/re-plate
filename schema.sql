-- ========================================================================================
-- RePlate Database Schema v2
-- Run this script in your Supabase SQL Editor
-- If you already ran v1, run the ALTER TABLE statements at the bottom instead
-- ========================================================================================

-- 1. Profiles Table (extends the Supabase auth.users table)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('business', 'charity', 'volunteer', 'public')),
  location TEXT,
  dietary_preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies (use IF NOT EXISTS pattern via DO block)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone.' AND tablename = 'profiles') THEN
    CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile.' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile.' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- 2. Food Listings Table
CREATE TABLE IF NOT EXISTS public.food_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'portions',
  dietary_tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  priority_level TEXT NOT NULL DEFAULT 'normal' CHECK (priority_level IN ('normal', 'high', 'urgent')),
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'completed', 'expired')),
  claimed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS for food_listings
ALTER TABLE public.food_listings ENABLE ROW LEVEL SECURITY;

-- Food Listings Policies
DO $$ BEGIN
  -- Everyone can read listings
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Listings are viewable by everyone' AND tablename = 'food_listings') THEN
    CREATE POLICY "Listings are viewable by everyone" ON public.food_listings FOR SELECT USING (true);
  END IF;

  -- Business, Volunteer, and Charity can create listings
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authorized roles can create listings' AND tablename = 'food_listings') THEN
    CREATE POLICY "Authorized roles can create listings" ON public.food_listings FOR INSERT
    WITH CHECK (
      auth.uid() = business_id AND
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('business', 'volunteer', 'charity'))
    );
  END IF;

  -- Owners can update their own listings, logged-in users can claim available listings
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update listings' AND tablename = 'food_listings') THEN
    CREATE POLICY "Users can update listings" ON public.food_listings FOR UPDATE
    USING (auth.uid() = business_id OR (status = 'available' AND auth.uid() IS NOT NULL));
  END IF;
END $$;

-- 3. Set up Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.food_listings;

-- ========================================================================================
-- IF YOU ALREADY RAN SCHEMA v1, run these ALTER statements instead of the full script:
-- ========================================================================================
-- ALTER TABLE public.food_listings ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT 'portions';
-- ALTER TABLE public.food_listings ADD COLUMN IF NOT EXISTS image_url TEXT;
-- ALTER TABLE public.food_listings ADD COLUMN IF NOT EXISTS priority_level TEXT NOT NULL DEFAULT 'normal';
-- ALTER TABLE public.food_listings DROP CONSTRAINT IF EXISTS food_listings_priority_level_check;
-- ALTER TABLE public.food_listings ADD CONSTRAINT food_listings_priority_level_check CHECK (priority_level IN ('normal', 'high', 'urgent'));
-- DROP POLICY IF EXISTS "Businesses can create listings" ON public.food_listings;
-- CREATE POLICY "Authorized roles can create listings" ON public.food_listings FOR INSERT WITH CHECK (auth.uid() = business_id AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('business', 'volunteer', 'charity')));

-- ========================================================================================
-- 4. STORAGE BUCKET FOR FOOD IMAGES
-- Run this in Supabase SQL Editor, or create manually in Dashboard > Storage
-- ========================================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload food images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'food-images');

-- Allow public read access to food images
CREATE POLICY "Public can view food images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'food-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own food images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'food-images' AND (storage.foldername(name))[1] = auth.uid()::text);
