-- ========================================================================================
-- RePlate Database Schema
-- Run this script in your Supabase SQL Editor
-- ========================================================================================

-- Enable Row Level Security (RLS)
-- Wait, actually let's create tables first.

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

-- Profiles Policies
-- Everyone can read profiles
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Trigger to automatically create a profile stub when a new user signs up (Optional, but good practice)
-- Usually handled by the frontend passing metadata, but this ensures a row always exists.
-- For now, our frontend will just insert into profiles explicitly.

-- 3. Food Listings Table
CREATE TABLE IF NOT EXISTS public.food_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity TEXT NOT NULL,
  dietary_tags TEXT[] DEFAULT '{}',
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
-- Everyone can read available listings
CREATE POLICY "Listings are viewable by everyone" 
  ON public.food_listings FOR SELECT USING (true);

-- Businesses can create listings
CREATE POLICY "Businesses can create listings" 
  ON public.food_listings FOR INSERT 
  WITH CHECK (
    auth.uid() = business_id AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'business')
  );

-- Business can update their own listings, or anyone can update status to claim it
CREATE POLICY "Businesses can update their own listings" 
  ON public.food_listings FOR UPDATE 
  USING (auth.uid() = business_id OR status = 'available'); -- Allows claiming

-- 4. Set up Realtime
-- Enable realtime for both tables so the app can instantly see changes
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.food_listings;
