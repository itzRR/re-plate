'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Plus,
  Package,
  TrendingUp,
  Clock,
  Users,
  Leaf,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { mockFoodListings, mockImpactMetrics, mockNotifications } from '@/lib/mock-data';

type DashboardTab = 'overview' | 'listings' | 'notifications';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const myListings = mockFoodListings.slice(0, 5);
  const recentNotifications = mockNotifications.slice(0, 5);

  const tabs = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: BarChart3 },
    { id: 'listings' as DashboardTab, label: 'My Listings', icon: Package },
    { id: 'notifications' as DashboardTab, label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-outfit)]">
                Dashboard
              </h1>
              <p className="text-slate-400 mt-1">Welcome back! Here&apos;s your impact summary.</p>
            </div>
            <Link
              href="/dashboard/post"
              className="btn-primary flex items-center gap-2 text-sm !py-2.5"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Post Surplus Food
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 1, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'notifications' && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {recentNotifications.length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: 'Food Donated',
                  value: mockImpactMetrics.food_saved_kg,
                  suffix: ' kg',
                  icon: Leaf,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10',
                },
                {
                  label: 'Meals Provided',
                  value: mockImpactMetrics.meals_provided,
                  suffix: '',
                  icon: Users,
                  color: 'text-green-400',
                  bg: 'bg-green-500/10',
                },
                {
                  label: 'CO₂ Saved',
                  value: parseFloat((mockImpactMetrics.co2_saved_kg / 1000).toFixed(1)),
                  suffix: 't',
                  decimals: 1,
                  icon: TrendingUp,
                  color: 'text-teal-400',
                  bg: 'bg-teal-500/10',
                },
                {
                  label: 'Active Listings',
                  value: mockFoodListings.filter((l) => l.status === 'available').length,
                  suffix: '',
                  icon: Package,
                  color: 'text-cyan-400',
                  bg: 'bg-cyan-500/10',
                },
              ].map((stat, i) => (
                <GlassCard key={stat.label} delay={i * 0.1} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-[family-name:var(--font-outfit)]">
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      decimals={(stat as { decimals?: number }).decimals || 0}
                      duration={1.5}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                </GlassCard>
              ))}
            </div>

            {/* Recent Listings & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Listings */}
              <GlassCard hover={false} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold font-[family-name:var(--font-outfit)]">
                    Recent Listings
                  </h3>
                  <Link
                    href="/marketplace"
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {myListings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/marketplace/${listing.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-emerald-400 transition-colors">
                          {listing.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500">
                            {listing.quantity} {listing.unit}
                          </span>
                          <CountdownTimer expiryTime={listing.expiry_time} className="!text-[10px] !px-1.5 !py-0.5" />
                        </div>
                      </div>
                      <StatusBadge status={listing.status} />
                    </Link>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Actions & Activity */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <GlassCard hover={false} className="p-6">
                  <h3 className="text-lg font-semibold font-[family-name:var(--font-outfit)] mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Post Food', icon: Plus, href: '/dashboard/post', color: 'bg-emerald-500/10 text-emerald-400' },
                      { label: 'View Map', icon: MapPin, href: '/map', color: 'bg-teal-500/10 text-teal-400' },
                      { label: 'Leaderboard', icon: TrendingUp, href: '/leaderboard', color: 'bg-green-500/10 text-green-400' },
                      { label: 'Settings', icon: Settings, href: '#', color: 'bg-slate-500/10 text-slate-400' },
                    ].map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all group"
                      >
                        <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center`}>
                          <action.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium group-hover:text-emerald-400 transition-colors">
                          {action.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </GlassCard>

                {/* Recent Activity */}
                <GlassCard hover={false} className="p-6">
                  <h3 className="text-lg font-semibold font-[family-name:var(--font-outfit)] mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {recentNotifications.slice(0, 3).map((notif) => (
                      <div
                        key={notif.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bell className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              {mockFoodListings.map((listing) => (
                <GlassCard key={listing.id} hover={true} className="p-4">
                  <Link
                    href={`/marketplace/${listing.id}`}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{listing.title}</h3>
                      <p className="text-sm text-slate-400 truncate">{listing.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">
                          {listing.quantity} {listing.unit}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {listing.pickup_location}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={listing.status} />
                      <CountdownTimer expiryTime={listing.expiry_time} className="!text-[10px]" />
                    </div>
                  </Link>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              {mockNotifications.map((notif) => (
                <GlassCard key={notif.id} hover={true} className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'achievement'
                          ? 'bg-amber-500/10'
                          : notif.type === 'claim'
                          ? 'bg-blue-500/10'
                          : notif.type === 'expiry'
                          ? 'bg-red-500/10'
                          : 'bg-emerald-500/10'
                      }`}
                    >
                      <Bell
                        className={`w-5 h-5 ${
                          notif.type === 'achievement'
                            ? 'text-amber-400'
                            : notif.type === 'claim'
                            ? 'text-blue-400'
                            : notif.type === 'expiry'
                            ? 'text-red-400'
                            : 'text-emerald-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{notif.title}</h3>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
