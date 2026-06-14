export type UserRole = 'admin' | 'business' | 'charity' | 'volunteer' | 'public';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  location?: string;
  dietary_preferences?: string[];
  created_at: string;
}

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  category: FoodCategory;
  dietary_tags: DietaryTag[];
  expiry_time: string;
  pickup_location: string;
  pickup_lat: number;
  pickup_lng: number;
  image_url: string;
  donor_id: string;
  donor_name: string;
  donor_avatar?: string;
  status: 'available' | 'claimed' | 'collected' | 'expired';
  priority_level: 'normal' | 'high' | 'urgent';
  created_at: string;
}

export type FoodCategory =
  | 'bakery'
  | 'prepared-meals'
  | 'fruits-vegetables'
  | 'dairy'
  | 'beverages'
  | 'snacks'
  | 'other';

export type DietaryTag =
  | 'vegan'
  | 'vegetarian'
  | 'halal'
  | 'kosher'
  | 'gluten-free'
  | 'nut-free'
  | 'dairy-free';

export interface Claim {
  id: string;
  food_listing_id: string;
  user_id: string;
  user_name: string;
  claim_time: string;
  pickup_time?: string;
  status: 'pending' | 'confirmed' | 'collected' | 'cancelled';
}

export interface ImpactMetrics {
  food_saved_kg: number;
  meals_provided: number;
  co2_saved_kg: number;
  money_saved: number;
  active_donors: number;
  active_volunteers: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar_url: string;
  role: UserRole;
  score: number;
  food_donated_kg: number;
  meals_provided: number;
  badges: Badge[];
  rank: number;
}

export type Badge =
  | 'eco-hero'
  | 'food-saver'
  | 'community-champion'
  | 'first-donation'
  | 'weekly-warrior'
  | 'monthly-master';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'claim' | 'expiry' | 'donation' | 'achievement';
  read: boolean;
  created_at: string;
}
