'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'motion/react';
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

/* ── Floating Food Emoji Component ── */
function FloatingEmoji({ emoji, index }: { emoji: string; index: number }) {
  const randomX = 10 + (index * 13) % 80;
  const randomY = 10 + ((index * 17 + 7) % 70);
  const size = 24 + (index % 3) * 12;
  const duration = 12 + (index % 5) * 3;
  const delay = index * 0.6;
  const depth = 0.3 + (index % 4) * 0.2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: depth, scale: 1 }}
      transition={{ delay: 1 + delay, duration: 0.6, type: 'spring' }}
      style={{
        position: 'absolute',
        left: `${randomX}%`,
        top: `${randomY}%`,
        fontSize: `${size}px`,
        zIndex: 1,
        filter: `blur(${(1 - depth) * 2}px)`,
        pointerEvents: 'none' as const,
      }}
    >
      <motion.span
        animate={{
          y: [0, -20 * depth, 5 * depth, -15 * depth, 0],
          x: [0, 10 * depth, -8 * depth, 12 * depth, 0],
          rotate: [0, 10, -5, 8, 0],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ display: 'inline-block' }}
      >
        {emoji}
      </motion.span>
    </motion.div>
  );
}

/* ── Counting Stat Component ── */
function CountingStat({ end, label, suffix }: { end: number; label: string; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const stepTime = 40;
    const steps = 50;
    const increment = end / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 px-4 sm:px-6">
      <span
        className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-outfit)]"
        style={{
          background: 'linear-gradient(135deg, #34d399 0%, #6ee7b7 50%, #a7f3d0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ── Magnetic CTA Button ── */
function MagneticCTA({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, position: 'relative', display: 'inline-flex' }}
      className="btn-primary text-base w-full sm:w-auto"
      whileTap={{ scale: 0.97 }}
    >
      {/* Glowing pulse ring */}
      <motion.span
        style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, rgba(52,211,153,0.4), rgba(16,185,129,0.1))',
          zIndex: -1,
          pointerEvents: 'none' as const,
        }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span
        className="flex items-center justify-center gap-2"
        style={{ padding: '14px 32px' }}
      >
        <Search className="w-5 h-5" />
        {children}
        <ArrowRight className="w-4 h-4" />
      </span>
    </motion.a>
  );
}

/* ── Food Emojis Data ── */
const floatingEmojis = ['🍞', '�-', '🍕', '🍎', '🥑', '🍰', '🥕', '🍜'];

/* ── Headline Words ── */
const headlineWords = [
  { text: 'Rescue', gradient: false },
  { text: 'Food.', gradient: false },
  { text: 'Feed', gradient: true },
  { text: 'Communities.', gradient: true },
  { text: 'Save', gradient: false },
  { text: 'the', gradient: false },
  { text: 'Planet.', gradient: false },
];

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
        className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden"
      >
        {/* ── Animated Gradient Mesh Background ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {/* Primary mesh layer */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '50% 0%', '0% 50%', '0% 0%'],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: '-50%',
              width: '200%',
              height: '200%',
              background: `
                radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(52,211,153,0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 40% 80%, rgba(5,150,105,0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 60%, rgba(110,231,183,0.06) 0%, transparent 40%)
              `,
              backgroundSize: '100% 100%',
            }}
          />
          {/* Secondary morph layer */}
          <motion.div
            animate={{
              backgroundPosition: ['100% 100%', '0% 0%', '50% 100%', '100% 50%', '100% 100%'],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: '-30%',
              width: '160%',
              height: '160%',
              background: `
                radial-gradient(circle at 60% 30%, rgba(20,184,166,0.07) 0%, transparent 45%),
                radial-gradient(circle at 30% 70%, rgba(34,197,94,0.06) 0%, transparent 45%)
              `,
              backgroundSize: '100% 100%',
            }}
          />
          {/* Subtle noise texture overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />
        </div>

        {/* ── Floating Food Emojis ── */}
        {floatingEmojis.map((emoji, i) => (
          <FloatingEmoji key={i} emoji={emoji} index={i} />
        ))}

        {/* ── Main Hero Content ── */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* ── Shimmer Badge ── */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
            style={{ position: 'relative', display: 'inline-flex', overflow: 'hidden' }}
            className="items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-10"
          >
            {/* Shimmer sweep */}
            <motion.span
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(52,211,153,0.15), transparent)',
                pointerEvents: 'none' as const,
              }}
            />
            <Sparkles className="w-4 h-4" />
            <span>Reducing Food Waste, One Meal at a Time</span>
          </motion.div>

          {/* ── Kinetic Typography Headline ── */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-outfit)] leading-[1.1] tracking-tight mb-6"
            style={{ overflow: 'hidden' }}
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.3 + i * 0.12,
                  type: 'spring',
                  stiffness: 100,
                  damping: 14,
                }}
                style={{
                  display: 'inline-block',
                  marginRight: '0.3em',
                  ...(word.gradient
                    ? {
                        background: 'linear-gradient(135deg, #34d399, #6ee7b7, #a7f3d0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }
                    : {}),
                }}
              >
                {word.text}
                {/* Line breaks after specific words */}
                {(i === 1) && <br className="hidden sm:block" />}
                {(i === 3) && <br />}
              </motion.span>
            ))}
          </h1>

          {/* ── Subtitle ── */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed mb-8"
          >
            Connecting surplus food from restaurants, bakeries, and stores with
            charities, students, and families who need it - before it becomes waste.
          </motion.p>

          {/* ── Animated Stats Bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '16px 8px',
              backdropFilter: 'blur(12px)',
              gap: '0',
              marginBottom: '32px',
            }}
          >
            <CountingStat end={42500} label="Meals Rescued" suffix="" />
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.08)' }} />
            <CountingStat end={12400} label="kg CO₂ Saved" suffix="" />
            <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.08)' }} />
            <CountingStat end={890} label="Partners" suffix="+" />
          </motion.div>

          {/* ── CTA Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticCTA href="/marketplace">
              Find Food Near You
            </MagneticCTA>
            <Link
              href="/register"
              className="btn-secondary text-base !px-8 !py-3.5 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Store className="w-5 h-5" />
              List Surplus Food
            </Link>
          </motion.div>

          {/* ── Trust Indicators ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500"
          >
            {[
              { icon: ShieldCheck, text: '100% Free Platform' },
              { icon: Users, text: '2,500+ Active Users' },
              { icon: Store, text: '180+ Partner Businesses' },
            ].map((item, idx) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.3 + idx * 0.15 }}
                className="flex items-center gap-2"
              >
                <item.icon className="w-4 h-4 text-emerald-500/60" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Scroll Indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-1.5"
          >
            <motion.div
              animate={{ height: ['12px', '6px', '12px'], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 bg-emerald-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 1, y: 0 }}
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
                desc: 'Track your environmental impact - food rescued, CO₂ saved, and meals provided with beautiful charts.',
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
                desc: 'Can\'t pick up? Volunteers can deliver food to you - like Uber for Good.',
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
              initial={{ opacity: 1, y: 0 }}
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
                ready to help - there&apos;s a place for you on RePlate.
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
