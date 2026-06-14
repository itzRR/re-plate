'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Medal,
  Crown,
  Users,
  HandHeart,
  Utensils,
  TrendingUp,
  Leaf,
  Star,
  ChevronRight,
} from 'lucide-react';
import { mockLeaderboard, mockImpactMetrics } from '@/lib/mock-data';
import { BADGE_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import type { LeaderboardEntry } from '@/lib/types';

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'donors', label: 'Top Donors', icon: HandHeart },
  { id: 'volunteers', label: 'Top Volunteers', icon: Users },
  { id: 'rescued', label: 'Most Rescued', icon: Utensils },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ─── Rank accent colors ──────────────────────────────────────────────────────
const RANK_COLORS = [
  { bg: 'from-amber-500/20 to-yellow-600/10', border: 'border-amber-500/40', text: 'text-amber-400', icon: Crown, glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]' },
  { bg: 'from-slate-300/20 to-slate-400/10', border: 'border-slate-400/40', text: 'text-slate-300', icon: Medal, glow: 'shadow-[0_0_30px_rgba(148,163,184,0.15)]' },
  { bg: 'from-amber-700/20 to-orange-800/10', border: 'border-amber-700/40', text: 'text-amber-600', icon: Medal, glow: 'shadow-[0_0_30px_rgba(180,83,9,0.15)]' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('donors');

  const sortedData = useMemo(() => {
    const copy = [...mockLeaderboard];
    switch (activeTab) {
      case 'donors':
        return copy
          .filter((e) => e.role === 'business' || e.food_donated_kg > 0)
          .sort((a, b) => b.food_donated_kg - a.food_donated_kg);
      case 'volunteers':
        return copy
          .filter((e) => e.role === 'volunteer' || e.role === 'charity')
          .sort((a, b) => b.score - a.score);
      case 'rescued':
        return copy.sort((a, b) => b.meals_provided - a.meals_provided);
    }
  }, [activeTab]);

  // Re-assign rank based on sorted order
  const ranked = useMemo(
    () => sortedData.map((entry, i) => ({ ...entry, rank: i + 1 })),
    [sortedData],
  );

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (activeTab) {
      case 'donors':
        return `${entry.food_donated_kg} kg`;
      case 'volunteers':
        return `${entry.score} pts`;
      case 'rescued':
        return `${entry.meals_provided} meals`;
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* ── Header ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 1, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
          <Trophy className="w-4 h-4" />
          Community Leaderboard
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
          Our <span className="text-gradient">Heroes</span>
        </h1>
        <p className="text-[#94A3B8] max-w-2xl mx-auto">
          Celebrating the incredible people and organisations making a difference through food rescue.
        </p>
      </motion.div>

      {/* ── Stats summary ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { label: 'Active Donors', value: mockImpactMetrics.active_donors, icon: HandHeart, color: 'text-emerald-400' },
          { label: 'Food Rescued', value: `${formatNumber(mockImpactMetrics.food_saved_kg)} kg`, icon: Leaf, color: 'text-green-400' },
          { label: 'Volunteers', value: mockImpactMetrics.active_volunteers, icon: Users, color: 'text-teal-400' },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.1} hover={false} className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading">{stat.value}</p>
                <p className="text-xs text-[#94A3B8]">{stat.label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ── Tabs ────────────────────────────────── */}
      <GlassCard hover={false} className="p-1.5 mb-10">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all relative',
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-[#94A3B8] hover:text-[#CBD5E1]',
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* ── Top 3 podium ────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:items-end mb-8">
            {top3.map((entry, i) => {
              const accent = RANK_COLORS[i];
              const RankIcon = accent.icon;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 1, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className={cn(
                    'relative rounded-2xl p-6 text-center border overflow-hidden',
                    'bg-gradient-to-b',
                    accent.bg,
                    accent.border,
                    accent.glow,
                    i === 0 && 'sm:order-2 sm:-mt-8 sm:scale-105 sm:z-10',
                    i === 1 && 'sm:order-1',
                    i === 2 && 'sm:order-3',
                  )}
                >
                  {/* Rank badge */}
                  <div className={cn('absolute top-3 right-3 flex items-center gap-1 text-xs font-bold', accent.text)}>
                    <RankIcon className="w-4 h-4" />
                    #{entry.rank}
                  </div>

                  {/* Avatar */}
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className={cn('absolute inset-0 rounded-full bg-gradient-to-br opacity-40', accent.bg)} />
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {entry.name.charAt(0)}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-heading mb-1">{entry.name}</h3>
                  <p className={cn('text-2xl font-extrabold font-heading mb-3', accent.text)}>
                    {getMetricValue(entry)}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {entry.badges.map((badge) => {
                      const config = BADGE_CONFIG[badge];
                      if (!config) return null;
                      return (
                        <span
                          key={badge}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/[0.06] text-[10px] text-[#CBD5E1]"
                          title={config.description}
                        >
                          {config.icon} {config.label}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Rest of the leaderboard ──────────── */}
          {rest.length > 0 && (
            <GlassCard hover={false} className="overflow-hidden">
              <div className="divide-y divide-white/[0.04]">
                {rest.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 1, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Rank */}
                    <span className="w-8 text-center text-sm font-bold text-[#64748B]">
                      {entry.rank}
                    </span>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/60 to-green-600/60 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {entry.name.charAt(0)}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#F8FAFC] truncate">{entry.name}</h4>
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {entry.badges.slice(0, 3).map((badge) => {
                          const config = BADGE_CONFIG[badge];
                          if (!config) return null;
                          return (
                            <span
                              key={badge}
                              className="text-[10px] text-[#94A3B8]"
                              title={config.description}
                            >
                              {config.icon}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Score */}
                    <span className="text-sm font-bold text-emerald-400 shrink-0">
                      {getMetricValue(entry)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
