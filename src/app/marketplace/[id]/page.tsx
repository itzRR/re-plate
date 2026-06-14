'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Package,
  Tag,
  Utensils,
  Navigation,
  Leaf,
  AlertTriangle,
  Sparkles,
  Loader2,
  X,
} from 'lucide-react';
import { mockFoodListings } from '@/lib/mock-data';
import { FOOD_CATEGORIES, DIETARY_TAGS } from '@/lib/constants';
import { cn, formatTimeRemaining } from '@/lib/utils';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FoodCard } from '@/components/food/FoodCard';

const dietaryColors: Record<string, string> = {
  vegetarian: 'bg-green-500/15 text-green-400 border-green-500/20',
  vegan: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  halal: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  kosher: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  'gluten-free': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'dairy-free': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'nut-free': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

interface RecipeSuggestion {
  emoji: string;
  title: string;
  description: string;
}

export default function MarketplaceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const listing = useMemo(
    () => mockFoodListings.find((l) => l.id === id),
    [id]
  );

  const relatedListings = useMemo(() => {
    if (!listing) return [];
    return mockFoodListings
      .filter((l) => l.id !== listing.id && l.status === 'available')
      .slice(0, 3);
  }, [listing]);

  const categoryConfig = listing
    ? FOOD_CATEGORIES.find((c) => c.value === listing.category)
    : null;

  // AI Recipe Suggestions state
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeSuggestions, setRecipeSuggestions] = useState<RecipeSuggestion[] | null>(null);
  const [recipeError, setRecipeError] = useState<string | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const fetchRecipeSuggestions = async () => {
    if (!listing) return;

    setRecipeLoading(true);
    setRecipeError(null);
    setShowRecipeModal(true);

    try {
      const res = await fetch('/api/ai/suggest-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: listing.title,
          description: listing.description,
          category: listing.category,
          dietary_tags: listing.dietary_tags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get recipe suggestions');
      }

      setRecipeSuggestions(data.suggestions);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setRecipeError(message);
    } finally {
      setRecipeLoading(false);
    }
  };

  // ── 404 Not Found ──
  if (!listing) {
    return (
      <main className="min-h-screen bg-[#0F172A] pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-3xl bg-white/[0.04] border border-white/[0.06] mb-6">
            <AlertTriangle className="w-12 h-12 text-amber-500/60" />
          </div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-3">
            Listing Not Found
          </h1>
          <p className="text-[#94A3B8] mb-8 max-w-md">
            This food listing may have been claimed, expired, or doesn&apos;t
            exist.
          </p>
          <Link
            href="/marketplace"
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-6 py-3',
              'bg-emerald-500/15 text-emerald-400 font-medium',
              'border border-emerald-500/20',
              'hover:bg-emerald-500/25 transition-all duration-300'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </motion.div>
      </main>
    );
  }

  const donorInitial = listing.donor_name.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#0F172A] pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Back Button ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/marketplace"
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2.5',
              'text-sm font-medium text-[#94A3B8]',
              'bg-white/[0.04] backdrop-blur-md border border-white/[0.08]',
              'hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15]',
              'transition-all duration-300'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
        </motion.div>

        {/* ── Hero Image ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-8"
        >
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent" />

          {/* Overlaid badges */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <StatusBadge status={listing.status} />
            {listing.priority_level === 'urgent' && (
              <StatusBadge status="urgent" />
            )}
          </div>

          {categoryConfig && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1.5 text-sm font-medium text-white/90">
                <span className="text-base leading-none">
                  {categoryConfig.icon}
                </span>
                {categoryConfig.label}
              </span>
            </div>
          )}

          {/* Bottom overlay info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <CountdownTimer
              expiryTime={listing.expiry_time}
              className="mb-3"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-outfit)] leading-tight">
              {listing.title}
            </h1>
          </div>
        </motion.div>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left Column: Details ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn(
                'rounded-2xl p-6',
                'bg-white/[0.05] backdrop-blur-xl',
                'border border-white/[0.08]'
              )}
            >
              <h2 className="text-lg font-semibold text-[#F8FAFC] mb-3">
                Description
              </h2>
              <p className="text-[#94A3B8] leading-relaxed text-base">
                {listing.description}
              </p>
            </motion.div>

            {/* Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {/* Quantity */}
              <div
                className={cn(
                  'rounded-2xl p-5',
                  'bg-white/[0.05] backdrop-blur-xl',
                  'border border-white/[0.08]'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Package className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm text-[#64748B] font-medium">
                    Quantity
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#F8FAFC]">
                  {listing.quantity}{' '}
                  <span className="text-base font-normal text-[#94A3B8]">
                    {listing.unit}
                  </span>
                </p>
              </div>

              {/* Category */}
              <div
                className={cn(
                  'rounded-2xl p-5',
                  'bg-white/[0.05] backdrop-blur-xl',
                  'border border-white/[0.08]'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Tag className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm text-[#64748B] font-medium">
                    Category
                  </span>
                </div>
                <p className="text-lg font-semibold text-[#F8FAFC]">
                  {categoryConfig?.icon} {categoryConfig?.label ?? listing.category}
                </p>
              </div>

              {/* Dietary Tags */}
              <div
                className={cn(
                  'rounded-2xl p-5',
                  'bg-white/[0.05] backdrop-blur-xl',
                  'border border-white/[0.08]'
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Utensils className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm text-[#64748B] font-medium">
                    Dietary Tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {listing.dietary_tags.map((tag) => {
                    const tagConfig = DIETARY_TAGS.find(
                      (t) => t.value === tag
                    );
                    return (
                      <span
                        key={tag}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-medium capitalize',
                          dietaryColors[tag] ??
                            'bg-slate-500/15 text-slate-400 border-slate-500/20'
                        )}
                      >
                        {tagConfig?.label ?? tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Pickup Location */}
              <div
                className={cn(
                  'rounded-2xl p-5',
                  'bg-white/[0.05] backdrop-blur-xl',
                  'border border-white/[0.08]'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm text-[#64748B] font-medium">
                    Pickup Location
                  </span>
                </div>
                <p className="text-base font-medium text-[#F8FAFC]">
                  {listing.pickup_location}
                </p>
              </div>
            </motion.div>

            {/* Expiry Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                'rounded-2xl p-5',
                'bg-white/[0.05] backdrop-blur-xl',
                'border border-white/[0.08]',
                'flex items-center gap-4'
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-[#64748B] font-medium">
                  Time Remaining
                </p>
                <p className="text-xl font-bold text-[#F8FAFC]">
                  {formatTimeRemaining(listing.expiry_time)}
                </p>
              </div>
              <CountdownTimer
                expiryTime={listing.expiry_time}
                className="ml-auto"
              />
            </motion.div>
          </div>

          {/* ── Right Column: Actions + Donor ── */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                'rounded-2xl p-6',
                'bg-white/[0.05] backdrop-blur-xl',
                'border border-white/[0.08]'
              )}
            >
              <button
                className={cn(
                  'w-full relative rounded-xl py-4 px-6 mb-3',
                  'bg-gradient-to-r from-emerald-500 to-green-500',
                  'text-white font-semibold text-base',
                  'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
                  'hover:shadow-[0_0_50px_rgba(34,197,94,0.5)]',
                  'hover:from-emerald-400 hover:to-green-400',
                  'transition-all duration-300',
                  'active:scale-[0.98]'
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Leaf className="w-5 h-5" />
                  Claim This Food
                </span>
              </button>

              <button
                className={cn(
                  'w-full rounded-xl py-3.5 px-6 mb-3',
                  'bg-white/[0.05] backdrop-blur-md',
                  'border border-white/[0.1]',
                  'text-[#94A3B8] font-medium text-sm',
                  'hover:bg-white/[0.1] hover:text-white hover:border-white/[0.15]',
                  'transition-all duration-300',
                  'flex items-center justify-center gap-2'
                )}
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </button>

              {/* AI Recipe Ideas Button */}
              <motion.button
                onClick={fetchRecipeSuggestions}
                disabled={recipeLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full relative rounded-xl py-3.5 px-6',
                  'bg-gradient-to-r from-purple-600/20 to-pink-600/20',
                  'backdrop-blur-md',
                  'border border-purple-500/20',
                  'text-purple-300 font-medium text-sm',
                  'hover:from-purple-600/30 hover:to-pink-600/30',
                  'hover:border-purple-500/30 hover:text-purple-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'transition-all duration-300',
                  'flex items-center justify-center gap-2',
                  'shadow-lg shadow-purple-500/10',
                  'hover:shadow-purple-500/20'
                )}
              >
                {recipeLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {recipeLoading ? 'Generating Ideas...' : '✨ AI Recipe Ideas'}
              </motion.button>
            </motion.div>

            {/* Donor Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className={cn(
                'rounded-2xl p-6',
                'bg-white/[0.05] backdrop-blur-xl',
                'border border-white/[0.08]'
              )}
            >
              <h3 className="text-sm font-medium text-[#64748B] mb-4">
                Donated by
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-xl font-bold text-white shadow-lg shadow-emerald-500/20">
                  {donorInitial}
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#F8FAFC]">
                    {listing.donor_name}
                  </p>
                  <p className="text-sm text-[#94A3B8]">
                    Verified Business Partner
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/[0.06] mb-4" />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <MapPin className="w-4 h-4 text-emerald-500/60 shrink-0" />
                  <span>{listing.pickup_location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Clock className="w-4 h-4 text-emerald-500/60 shrink-0" />
                  <span>Responds within 15 minutes</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={cn(
                'rounded-2xl p-5',
                'bg-gradient-to-br from-emerald-500/10 to-green-500/5',
                'backdrop-blur-xl',
                'border border-emerald-500/10'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">
                  Impact Estimate
                </span>
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Claiming this food could save approximately{' '}
                <span className="text-emerald-400 font-semibold">
                  {(listing.quantity * 0.4).toFixed(1)} kg
                </span>{' '}
                of food waste and prevent{' '}
                <span className="text-emerald-400 font-semibold">
                  {(listing.quantity * 0.4 * 3.58).toFixed(1)} kg
                </span>{' '}
                of CO₂ emissions.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Related Listings ── */}
        {relatedListings.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#F8FAFC] font-[family-name:var(--font-outfit)]">
                More Available Food
              </h2>
              <p className="mt-1 text-[#94A3B8]">
                Other listings you might be interested in
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedListings.map((item, i) => (
                <FoodCard key={item.id} listing={item} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* ── AI Recipe Suggestions Modal ── */}
      <AnimatePresence>
        {showRecipeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRecipeModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'relative w-full max-w-lg',
                'rounded-2xl p-6',
                'bg-[#1E293B]/90 backdrop-blur-2xl',
                'border border-white/[0.1]',
                'shadow-2xl shadow-purple-500/10',
                'max-h-[85vh] overflow-y-auto'
              )}
            >
              {/* Close button */}
              <button
                onClick={() => setShowRecipeModal(false)}
                className={cn(
                  'absolute top-4 right-4 p-2 rounded-xl',
                  'bg-white/[0.05] border border-white/[0.08]',
                  'text-slate-400 hover:text-white hover:bg-white/[0.1]',
                  'transition-all duration-200'
                )}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] font-[family-name:var(--font-outfit)]">
                    AI Recipe Ideas
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Creative ways to enjoy {listing.title}
                  </p>
                </div>
              </div>

              {/* Loading State */}
              {recipeLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
                    <Sparkles className="w-5 h-5 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm text-[#94A3B8] mt-4">
                    AI is cooking up ideas...
                  </p>
                </div>
              )}

              {/* Error State */}
              {recipeError && !recipeLoading && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-sm text-red-400 mb-4">{recipeError}</p>
                  <button
                    onClick={fetchRecipeSuggestions}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium',
                      'bg-white/[0.05] border border-white/[0.1]',
                      'text-[#94A3B8] hover:text-white hover:bg-white/[0.1]',
                      'transition-all duration-200'
                    )}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Suggestions */}
              {recipeSuggestions && !recipeLoading && (
                <div className="space-y-4">
                  {recipeSuggestions.map((suggestion, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.1 }}
                      className={cn(
                        'rounded-xl p-4',
                        'bg-white/[0.04] backdrop-blur-md',
                        'border border-white/[0.06]',
                        'hover:bg-white/[0.07] hover:border-white/[0.12]',
                        'transition-all duration-300',
                        'group'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/15 text-xl group-hover:scale-110 transition-transform duration-300">
                          {suggestion.emoji}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-[#F8FAFC] mb-1">
                            {suggestion.title}
                          </h4>
                          <p className="text-sm text-[#94A3B8] leading-relaxed">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Dietary note */}
                  {listing.dietary_tags.length > 0 && (
                    <div className="flex items-center gap-2 pt-2 px-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400/60 shrink-0" />
                      <p className="text-xs text-[#64748B]">
                        All suggestions respect{' '}
                        {listing.dietary_tags
                          .map(
                            (t) =>
                              DIETARY_TAGS.find((dt) => dt.value === t)
                                ?.label ?? t
                          )
                          .join(', ')}{' '}
                        dietary requirements
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
