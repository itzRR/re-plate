'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ChevronDown, Leaf, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { FoodCard } from '@/components/food/FoodCard';
import { mockFoodListings } from '@/lib/mock-data';
import { FOOD_CATEGORIES, DIETARY_TAGS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import type { FoodCategory, DietaryTag, FoodListing } from '@/lib/types';

type SortOption = 'expiring' | 'newest' | 'quantity';

const sortLabels: Record<SortOption, string> = {
  expiring: 'Expiring Soon',
  newest: 'Newest',
  quantity: 'Most Available',
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<FoodCategory[]>([]);
  const [activeDietaryTags, setActiveDietaryTags] = useState<DietaryTag[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('expiring');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showDietaryDropdown, setShowDietaryDropdown] = useState(false);
  const [realListings, setRealListings] = useState<FoodListing[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();
  const canPost = userRole && ['business', 'volunteer', 'charity'].includes(userRole);

  // Fetch real listings from Supabase + subscribe to realtime
  useEffect(() => {
    // Check auth + role
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setUserRole(profile?.role || null);
      }
    });

    const fetchListings = async () => {
      const { data } = await supabase
        .from('food_listings')
        .select(`
          *,
          profiles:business_id (name, role, location)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (data) {
        const mapped: FoodListing[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          quantity: parseInt(item.quantity) || 1,
          unit: item.unit || 'portions',
          category: item.category as FoodCategory,
          dietary_tags: item.dietary_tags || [],
          expiry_time: item.expiry_time,
          pickup_location: item.location,
          pickup_lat: item.lat || 6.9271,
          pickup_lng: item.lng || 79.8612,
          image_url: item.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
          donor_id: item.business_id,
          donor_name: item.profiles?.name || 'Anonymous',
          status: item.status,
          priority_level: item.priority_level || 'normal',
          created_at: item.created_at,
        }));
        setRealListings(mapped);
      }
    };

    fetchListings();

    // Realtime subscription
    const channel = supabase
      .channel('food_listings_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'food_listings' }, () => {
        fetchListings(); // Re-fetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const toggleCategory = (cat: FoodCategory) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleDietaryTag = (tag: DietaryTag) => {
    setActiveDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Merge real listings (first) with mock listings as fallback
  const allListings = useMemo(() => {
    const realIds = new Set(realListings.map(l => l.id));
    const mockFiltered = mockFoodListings.filter(l => !realIds.has(l.id));
    return [...realListings, ...mockFiltered];
  }, [realListings]);

  const filteredListings = useMemo(() => {
    const now = new Date().getTime();
    let results = [...allListings];

    // Hide expired listings (real posts disappear when time is over)
    results = results.filter((l) => new Date(l.expiry_time).getTime() > now);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategories.length > 0) {
      results = results.filter((l) => activeCategories.includes(l.category));
    }

    // Dietary tags filter
    if (activeDietaryTags.length > 0) {
      results = results.filter((l) =>
        activeDietaryTags.every((tag) => l.dietary_tags.includes(tag))
      );
    }

    // Sort
    switch (sortBy) {
      case 'expiring':
        results.sort(
          (a, b) =>
            new Date(a.expiry_time).getTime() - new Date(b.expiry_time).getTime()
        );
        break;
      case 'newest':
        results.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'quantity':
        results.sort((a, b) => b.quantity - a.quantity);
        break;
    }

    return results;
  }, [searchQuery, activeCategories, activeDietaryTags, sortBy]);

  const activeFilterCount =
    activeCategories.length + activeDietaryTags.length + (searchQuery ? 1 : 0);

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveCategories([]);
    setActiveDietaryTags([]);
    setSortBy('expiring');
  };

  return (
    <main className="min-h-screen bg-[#0F172A] pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-heading">
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              Food Marketplace
            </span>
          </h1>
          <p className="mt-3 text-lg text-[#94A3B8] max-w-2xl">
            Discover surplus food near you. Rescue meals, reduce waste, and make
            an impact.
          </p>
          {canPost && (
            <Link
              href="/dashboard/post"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/25"
            >
              <Plus className="w-4 h-4" />
              Post Surplus Food
            </Link>
          )}
        </motion.div>

        {/* ── Search Bar ── */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food listings..."
              className={cn(
                'w-full rounded-2xl py-4 pl-12 pr-4',
                'bg-white/[0.05] backdrop-blur-xl',
                'border border-white/[0.08]',
                'text-[#F8FAFC] placeholder:text-[#64748B]',
                'outline-none transition-all duration-300',
                'focus:border-emerald-500/40 focus:bg-white/[0.08]',
                'focus:shadow-[0_0_30px_rgba(34,197,94,0.1)]'
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-[#94A3B8]" />
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Category Filters ── */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-4"
        >
          <div className="flex flex-wrap gap-2">
            {FOOD_CATEGORIES.map((cat) => {
              const isActive = activeCategories.includes(
                cat.value as FoodCategory
              );
              return (
                <motion.button
                  key={cat.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCategory(cat.value as FoodCategory)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2.5',
                    'text-sm font-medium transition-all duration-300',
                    'border backdrop-blur-md',
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#94A3B8] hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white'
                  )}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Sort & Dietary Filter Row ── */}
        <motion.div
          initial={{ opacity: 1, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            {/* Dietary dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDietaryDropdown(!showDietaryDropdown);
                  setShowSortDropdown(false);
                }}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-4 py-2.5',
                  'text-sm font-medium transition-all duration-300',
                  'bg-white/[0.04] backdrop-blur-md border',
                  activeDietaryTags.length > 0
                    ? 'border-emerald-500/40 text-emerald-300'
                    : 'border-white/[0.08] text-[#94A3B8] hover:bg-white/[0.08] hover:text-white'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Dietary
                {activeDietaryTags.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                    {activeDietaryTags.length}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    showDietaryDropdown && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {showDietaryDropdown && (
                  <motion.div
                    initial={{ opacity: 1, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'absolute top-full left-0 z-50 mt-2 w-56 rounded-2xl p-2',
                      'bg-[#1E293B]/95 backdrop-blur-xl',
                      'border border-white/[0.08]',
                      'shadow-[0_16px_48px_rgba(0,0,0,0.4)]'
                    )}
                  >
                    {DIETARY_TAGS.map((tag) => {
                      const isActive = activeDietaryTags.includes(
                        tag.value as DietaryTag
                      );
                      return (
                        <button
                          key={tag.value}
                          onClick={() =>
                            toggleDietaryTag(tag.value as DietaryTag)
                          }
                          className={cn(
                            'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'text-[#94A3B8] hover:bg-white/[0.06] hover:text-white'
                          )}
                        >
                          <span
                            className={cn(
                              'h-4 w-4 rounded-md border-2 transition-all duration-200 flex items-center justify-center',
                              isActive
                                ? 'border-emerald-500 bg-emerald-500'
                                : 'border-white/20'
                            )}
                          >
                            {isActive && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </span>
                          {tag.label}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowDietaryDropdown(false);
                }}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-4 py-2.5',
                  'text-sm font-medium transition-all duration-300',
                  'bg-white/[0.04] backdrop-blur-md border border-white/[0.08]',
                  'text-[#94A3B8] hover:bg-white/[0.08] hover:text-white'
                )}
              >
                Sort: {sortLabels[sortBy]}
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    showSortDropdown && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 1, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'absolute top-full left-0 z-50 mt-2 w-48 rounded-2xl p-2',
                      'bg-[#1E293B]/95 backdrop-blur-xl',
                      'border border-white/[0.08]',
                      'shadow-[0_16px_48px_rgba(0,0,0,0.4)]'
                    )}
                  >
                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key);
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          'w-full rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200',
                          sortBy === key
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'text-[#94A3B8] hover:bg-white/[0.06] hover:text-white'
                        )}
                      >
                        {sortLabels[key]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear all */}
            {activeFilterCount > 0 && (
              <motion.button
                initial={{ opacity: 1, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear all
              </motion.button>
            )}
          </div>

          {/* Results count */}
          <p className="text-sm text-[#64748B]">
            <span className="text-[#F8FAFC] font-semibold">
              {filteredListings.length}
            </span>{' '}
            listing{filteredListings.length !== 1 && 's'} found
          </p>
        </motion.div>

        {/* ── Food Cards Grid ── */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing, i) => (
              <FoodCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        ) : (
          /* ── Empty State ── */
          <motion.div
            initial={{ opacity: 1, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative mb-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/[0.04] border border-white/[0.06]">
                <Leaf className="w-12 h-12 text-emerald-500/40" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1E293B] border border-white/[0.08]">
                <span className="text-lg">😞</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">
              No food listings found
            </h3>
            <p className="text-[#94A3B8] max-w-md mb-6">
              Try adjusting your filters or search query to discover more
              available food near you.
            </p>
            <button
              onClick={clearAllFilters}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-6 py-3',
                'bg-emerald-500/15 text-emerald-400 font-medium',
                'border border-emerald-500/20',
                'hover:bg-emerald-500/25 hover:border-emerald-500/30',
                'transition-all duration-300'
              )}
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Click-away handler for dropdowns */}
      {(showSortDropdown || showDietaryDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowSortDropdown(false);
            setShowDietaryDropdown(false);
          }}
        />
      )}

      {/* Floating Action Button - Post Food */}
      {canPost && (
        <Link
          href="/dashboard/post"
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="hidden sm:inline">Post Food</span>
        </Link>
      )}
    </main>
  );
}
