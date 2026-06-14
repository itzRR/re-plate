'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  MapPin, 
  Leaf, 
  Clock, 
  Award, 
  Settings, 
  LogOut,
  ShoppingBag,
  TrendingUp,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

// Mock Data
const PROFILE = {
  name: "Sarah Jenkins",
  role: "Food Rescuer",
  location: "Colombo 07, Sri Lanka",
  avatar: "SJ",
  joined: "March 2026",
  stats: {
    mealsRescued: 42,
    co2Saved: "124 kg",
    moneySaved: "$315"
  }
};

const RECENT_ACTIVITY = [
  {
    id: 1,
    title: "Claimed Artisan Sourdough Loaves",
    business: "Flour Bakery",
    time: "2 hours ago",
    type: "claim",
    icon: ShoppingBag,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20"
  },
  {
    id: 2,
    title: "Claimed Margherita Pizza Slices",
    business: "Cargills FoodCity",
    time: "Yesterday",
    type: "claim",
    icon: ShoppingBag,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20"
  },
  {
    id: 3,
    title: "Earned 'Eco Hero' Badge",
    business: "RePlate Community",
    time: "3 days ago",
    type: "badge",
    icon: Award,
    color: "text-amber-400",
    bg: "bg-amber-500/20"
  }
];

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUserProfile({
          ...PROFILE,
          name: profile.name,
          role: profile.role.charAt(0).toUpperCase() + profile.role.slice(1),
          location: profile.location || 'Unknown Location',
          avatar: profile.name.substring(0, 2).toUpperCase(),
          joined: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        });
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* ── Background Effects ───────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: 'rgba(22,163,74,0.06)', filter: 'blur(120px)', top: '-20%', left: '-10%' }}
          animate={{ x: [0, 40, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ background: 'rgba(34,197,94,0.04)', filter: 'blur(100px)', bottom: '10%', right: '-10%' }}
          animate={{ x: [0, -30, 20, 0], y: [0, 30, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── Left Sidebar (User Info) ───────── */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-8 text-center"
            >
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-green-600 p-[3px] mb-4 shadow-lg shadow-emerald-500/30">
                <div className="w-full h-full rounded-full bg-[#1E293B] border-4 border-[#0F172A] flex items-center justify-center overflow-hidden">
                  <span className="text-3xl font-bold text-white">{userProfile.avatar}</span>
                </div>
              </div>
              
              <h1 className="font-heading text-2xl font-bold text-[#F8FAFC] mb-1">{userProfile.name}</h1>
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
                <Leaf className="w-3.5 h-3.5" />
                {userProfile.role}
              </div>
              
              <div className="space-y-3 mt-6 text-sm text-[#94A3B8]">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-[#64748B]" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#64748B]" />
                  <span>Joined {userProfile.joined}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-4 flex flex-col gap-2"
            >
              <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/[0.04] transition-colors text-left text-sm font-medium text-[#E2E8F0]">
                <User className="w-4 h-4 text-[#94A3B8]" /> Edit Profile
              </button>
              <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/[0.04] transition-colors text-left text-sm font-medium text-[#E2E8F0]">
                <Settings className="w-4 h-4 text-[#94A3B8]" /> Account Settings
              </button>
              <div className="h-px bg-white/[0.06] my-1" />
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 transition-colors text-left text-sm font-medium text-red-400"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </motion.div>
          </div>

          {/* ── Right Content Area ─────────────── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Impact Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Heart className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-[#94A3B8] mb-1">Meals Rescued</p>
                  <p className="font-heading text-3xl font-bold text-gradient">{userProfile.stats.mealsRescued}</p>
                </div>
              </div>
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Leaf className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-[#94A3B8] mb-1">CO₂ Saved</p>
                  <p className="font-heading text-3xl font-bold text-gradient">{userProfile.stats.co2Saved}</p>
                </div>
              </div>
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-[#94A3B8] mb-1">Money Saved</p>
                  <p className="font-heading text-3xl font-bold text-gradient">{userProfile.stats.moneySaved}</p>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-bold text-[#F8FAFC]">Recent Activity</h2>
                <Link href="/dashboard" className="text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                  View full dashboard &rarr;
                </Link>
              </div>

              <div className="space-y-6">
                {RECENT_ACTIVITY.map((activity, i) => (
                  <div key={activity.id} className="flex gap-4 relative">
                    {/* Timeline line */}
                    {i !== RECENT_ACTIVITY.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-[-24px] w-px bg-white/[0.08]" />
                    )}
                    
                    {/* Icon */}
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-white/5", activity.bg)}>
                      <activity.icon className={cn("w-5 h-5", activity.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3 className="text-[#F8FAFC] font-medium text-sm sm:text-base">{activity.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#94A3B8] font-medium">{activity.business}</span>
                        <span className="w-1 h-1 rounded-full bg-[#64748B]" />
                        <span className="text-xs text-[#64748B]">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
