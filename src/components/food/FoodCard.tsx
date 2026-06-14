'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { FoodListing } from '@/lib/types';
import { FOOD_CATEGORIES } from '@/lib/constants';

interface FoodCardProps {
  listing: FoodListing;
  index?: number;
}

const dietaryColors: Record<string, string> = {
  vegetarian: 'bg-green-500/15 text-green-400 border-green-500/20',
  vegan: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  halal: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  kosher: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  'gluten-free': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'dairy-free': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'nut-free': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

export function FoodCard({ listing, index = 0 }: FoodCardProps) {
  const donorInitial = listing.donor_name.charAt(0).toUpperCase();
  const categoryConfig = FOOD_CATEGORIES.find((c) => c.value === listing.category);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.015 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'bg-white/[0.05] backdrop-blur-xl',
        'border border-white/[0.08]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
        'transition-shadow duration-300',
        'hover:shadow-[0_12px_40px_rgba(34,197,94,0.15)] hover:border-emerald-500/20'
      )}
    >
      {/* ── Image section ── */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={listing.image_url}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />

        {/* Status badge - top right */}
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={listing.status} />
        </div>

        {/* Category badge - top left */}
        {categoryConfig && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-1 text-xs font-medium text-white/90">
              <span className="text-sm leading-none">{categoryConfig.icon}</span>
              {categoryConfig.label}
            </span>
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#F8FAFC] leading-tight line-clamp-1 group-hover:text-emerald-400 transition-colors duration-200">
          {listing.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
          {listing.description}
        </p>

        {/* Quantity + Dietary tags row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <Users className="w-3 h-3" />
            {listing.quantity} {listing.unit}
          </span>

          {listing.dietary_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={cn(
                'rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize',
                dietaryColors[tag] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/20'
              )}
            >
              {tag}
            </span>
          ))}
          {listing.dietary_tags.length > 3 && (
            <span className="text-[10px] text-[#94A3B8]">
              +{listing.dietary_tags.length - 3}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-[#94A3B8]">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-500/60" />
          <span className="truncate">{listing.pickup_location}</span>
        </div>

        {/* Countdown */}
        <CountdownTimer expiryTime={listing.expiry_time} />

        {/* Divider */}
        <div className="h-px bg-white/[0.06]" />

        {/* Bottom: Donor info + View Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-xs font-bold text-white shadow-lg shadow-emerald-500/20">
              {donorInitial}
            </div>
            <span className="text-sm text-[#CBD5E1] font-medium truncate max-w-[120px]">
              {listing.donor_name}
            </span>
          </div>

          <Link
            href={`/marketplace/${listing.id}`}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2',
              'bg-emerald-500/10 text-emerald-400 text-xs font-semibold',
              'border border-emerald-500/20',
              'transition-all duration-200',
              'hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:text-emerald-300',
              'group/btn'
            )}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
