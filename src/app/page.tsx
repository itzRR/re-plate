'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  Leaf,
  MapPin,
  BarChart3,
  Users,
  Truck,
  Store,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlassCard } from '@/components/ui/GlassCard';
import { FoodCard } from '@/components/food/FoodCard';
import { mockFoodListings, mockImpactMetrics } from '@/lib/mock-data';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const featuredListings = mockFoodListings.filter(l => l.status === 'available').slice(0, 6);

  return (
    <div className="relative">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        {/* Animated Background Orbs */}
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Reducing Food Waste, One Meal at a Time</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-outfit)] leading-[1.1] tracking-tight mb-6"
          >
            Rescue Food.{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient">Feed Communities.</span>
            <br />
            Save the Planet.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-10"
          >
            Connecting surplus food from restaurants, bakeries, and stores with
            charities, students, and families who need it — before it becomes waste.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/marketplace" className="btn-primary text-base !px-8 !py-3.5 w-full sm:w-auto">
              <span className="flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Find Food Near You
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              href="/register"
              className="btn-secondary text-base !px-8 !py-3.5 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5" />
              List Surplus Food
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
          >
            {[
              { icon: ShieldCheck, text: '100% Free Platform' },
              { icon: Users, text: '2,500+ Active Users' },
              { icon: Store, text: '180+ Partner Businesses' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-emerald-500/60" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-1.5"
          >
            <motion.div className="w-1.5 h-3 bg-emerald-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-3">
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Three simple steps to rescue food and make an impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            {[
              {
                icon: Store,
                step: '01',
                title: 'Businesses Post',
                desc: 'Restaurants, bakeries, and stores list their surplus food with photos, quantity, and pickup details.',
                color: 'from-emerald-500 to-green-500',
              },
              {
                icon: Search,
                step: '02',
                title: 'Users Discover',
                desc: 'Browse the marketplace or map to find available food near you. Filter by dietary needs and distance.',
                color: 'from-green-500 to-teal-500',
              },
              {
                icon: Users,
                step: '03',
                title: 'Collect & Save',
                desc: 'Claim the food, pick it up before it expires, and help reduce waste while getting great meals.',
                color: 'from-teal-500 to-emerald-500',
              },
            ].map((item, i) => (
              <GlassCard key={item.step} delay={i * 0.15} className="p-8 text-center">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20`}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-bold text-emerald-500/40 tracking-widest uppercase">
                  Step {item.step}
                </span>
                <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          IMPACT COUNTER
          ============================================ */}
      <section className="section-padding relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] to-transparent" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-3">
              Real Impact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4">
              Our <span className="text-gradient">Collective Impact</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Every meal rescued creates a measurable difference for communities and the environment
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Food Rescued',
                value: mockImpactMetrics.food_saved_kg,
                suffix: ' kg',
                icon: Leaf,
                gradient: 'from-emerald-500/20 to-green-500/20',
              },
              {
                label: 'Meals Provided',
                value: mockImpactMetrics.meals_provided,
                suffix: '+',
                icon: Users,
                gradient: 'from-green-500/20 to-teal-500/20',
              },
              {
                label: 'CO₂ Saved',
                value: parseFloat((mockImpactMetrics.co2_saved_kg / 1000).toFixed(1)),
                suffix: ' tonnes',
                decimals: 1,
                icon: BarChart3,
                gradient: 'from-teal-500/20 to-cyan-500/20',
              },
              {
                label: 'Money Saved',
                value: mockImpactMetrics.money_saved,
                prefix: '$',
                suffix: '',
                icon: Truck,
                gradient: 'from-cyan-500/20 to-emerald-500/20',
              },
            ].map((stat, i) => (
              <GlassCard key={stat.label} delay={i * 0.1} className="p-6 sm:p-8 text-center">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-4`}
                >
                  <stat.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[family-name:var(--font-outfit)] text-white mb-1">
                  <AnimatedCounter
                    end={stat.value}
                    prefix={stat.prefix || ''}
                    suffix={stat.suffix || ''}
                    decimals={(stat as { decimals?: number }).decimals || 0}
                    duration={2.5}
                  />
                </div>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED LISTINGS
          ============================================ */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="inline-block text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-3">
                Available Now
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-outfit)]">
                Food Near <span className="text-gradient">You</span>
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors group"
            >
              View All Listings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing, i) => (
              <FoodCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURES GRID
          ============================================ */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-3">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4">
              Built for <span className="text-gradient">Impact</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Interactive Live Map',
                desc: 'See food donations near you in real-time. Find the closest pickup points with route guidance.',
                href: '/map',
              },
              {
                icon: BarChart3,
                title: 'Carbon Impact Dashboard',
                desc: 'Track your environmental impact — food rescued, CO₂ saved, and meals provided with beautiful charts.',
                href: '/impact',
              },
              {
                icon: Sparkles,
                title: 'AI Recommendations',
                desc: 'Smart suggestions based on your location, dietary preferences, and collection history.',
                href: '/marketplace',
              },
              {
                icon: ShieldCheck,
                title: 'Charity Priority System',
                desc: 'When food is close to expiry, charities and food banks get priority access automatically.',
                href: '/marketplace',
              },
              {
                icon: Users,
                title: 'Community Leaderboard',
                desc: 'Earn badges like Eco Hero and Food Saver. Compete on leaderboards and celebrate impact.',
                href: '/leaderboard',
              },
              {
                icon: Truck,
                title: 'Volunteer Delivery',
                desc: 'Can\'t pick up? Volunteers can deliver food to you — like Uber for Good.',
                href: '/register',
              },
            ].map((feature, i) => (
              <Link key={feature.title} href={feature.href}>
                <GlassCard delay={i * 0.1} className="p-6 h-full group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-outfit)] mb-2 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="section-padding relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative">
          <GlassCard hover={false} className="p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            {/* BG Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-green-500/5" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4">
                Join the <span className="text-gradient">Movement</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
                Whether you&apos;re a business with surplus food, a charity in need, or a volunteer
                ready to help — there&apos;s a place for you on RePlate.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="btn-primary text-base !px-8 !py-3.5 w-full sm:w-auto">
                  <span className="flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link
                  href="/impact"
                  className="btn-secondary text-base !px-8 !py-3.5 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  See Our Impact
                </Link>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
