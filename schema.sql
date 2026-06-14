-- ========================================================================================
-- RePlate Database Schema v3 (FINAL)
-- Safe to re-run - all statements use IF NOT EXISTS / ON CONFLICT / exception handling
-- ========================================================================================

-- ========================================================================================
-- 1. PROFILES TABLE
-- ========================================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('business', 'charity', 'volunteer', 'public')),
  location TEXT DEFAULT 'Colombo, Sri Lanka',
  dietary_preferences TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

-- ========================================================================================
-- 2. FOOD LISTINGS TABLE
-- ========================================================================================
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

ALTER TABLE public.food_listings ENABLE ROW LEVEL SECURITY;

-- Food Listings Policies
DO $$ BEGIN
  -- Everyone can read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Listings are viewable by everyone' AND tablename = 'food_listings') THEN
    CREATE POLICY "Listings are viewable by everyone" ON public.food_listings FOR SELECT USING (true);
  END IF;
  -- Business/Volunteer/Charity can create
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authorized roles can create listings' AND tablename = 'food_listings') THEN
    CREATE POLICY "Authorized roles can create listings" ON public.food_listings FOR INSERT
    WITH CHECK (
      auth.uid() = business_id AND
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('business', 'volunteer', 'charity'))
    );
  END IF;
  -- Owners update own listings, any logged-in user can claim available ones
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update listings' AND tablename = 'food_listings') THEN
    CREATE POLICY "Users can update listings" ON public.food_listings FOR UPDATE
    USING (auth.uid() = business_id OR (status = 'available' AND auth.uid() IS NOT NULL));
  END IF;
END $$;

-- ========================================================================================
-- 3. REALTIME (safe for re-runs)
-- ========================================================================================
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.food_listings;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ========================================================================================
-- 4. STORAGE BUCKET FOR FOOD IMAGES
-- ========================================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload food images' AND tablename = 'objects' AND schemaname = 'storage') THEN
    CREATE POLICY "Authenticated users can upload food images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'food-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view food images' AND tablename = 'objects' AND schemaname = 'storage') THEN
    CREATE POLICY "Public can view food images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'food-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own food images' AND tablename = 'objects' AND schemaname = 'storage') THEN
    CREATE POLICY "Users can delete own food images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'food-images' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;

-- ========================================================================================
-- 5. UPGRADE PATCH (run if you already had v1 or v2)
-- These are safe to re-run - they only add what's missing
-- ========================================================================================
ALTER TABLE public.food_listings ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT 'portions';
ALTER TABLE public.food_listings ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.food_listings ADD COLUMN IF NOT EXISTS priority_level TEXT NOT NULL DEFAULT 'normal';
ALTER TABLE public.food_listings ADD COLUMN IF NOT EXISTS claimed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Fix policies (drop old ones if they exist, re-create)
DROP POLICY IF EXISTS "Businesses can create listings" ON public.food_listings;
DROP POLICY IF EXISTS "Users can update listings" ON public.food_listings;
CREATE POLICY "Users can update listings" ON public.food_listings FOR UPDATE
USING (auth.uid() = business_id OR (status = 'available' AND auth.uid() IS NOT NULL));
