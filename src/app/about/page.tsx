'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Leaf,
  Heart,
  Globe,
  Target,
  Sparkles,
  Users,
  Lightbulb,
  Code,
  Palette,
  BarChart3,
  Shield,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  photo: string;
  video: string;
  icon: React.ElementType;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Rehan',
    role: 'Backend Developer',
    description: 'Full-stack architect driving the technical vision of RePlate. Building sustainable tech for a better future.',
    photo: '/team/rehan.webp',
    video: '/team/Rehan.mp4',
    icon: Code,
    color: 'from-emerald-500 to-green-600',
  },
  {
    name: 'Thimira',
    role: 'Backend Engineer',
    description: 'Database wizard & API specialist. Ensures RePlate runs fast, secure, and scales to serve every community.',
    photo: '/team/thimira.webp',
    video: '/team/Thimira.mp4',
    icon: Shield,
    color: 'from-teal-500 to-cyan-600',
  },
  {
    name: 'Frank',
    role: 'Frontend Developer',
    description: 'Crafting pixel-perfect interfaces that make food rescue feel effortless and delightful for every user.',
    photo: '/team/frank.webp',
    video: '/team/Frank.mp4',
    icon: Palette,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Oshadi',
    role: 'UI/UX Designer',
    description: 'Designing experiences that connect people with surplus food through intuitive, beautiful interfaces.',
    photo: '/team/oshadi.webp',
    video: '/team/Oshadi.mp4',
    icon: Lightbulb,
    color: 'from-purple-500 to-pink-600',
  },
  {
    name: 'Madara',
    role: 'Data & Impact Analyst',
    description: 'Turning food rescue data into actionable insights. Measuring our carbon footprint reduction every day.',
    photo: '/team/madara.webp',
    video: '/team/Madara.mp4',
    icon: BarChart3,
    color: 'from-amber-500 to-orange-600',
  },
];

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_12px_48px_rgba(34,197,94,0.15)] hover:border-emerald-500/20 hover:-translate-y-2">
        {/* Media Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Static Photo */}
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className={`object-cover transition-opacity duration-700 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Video (plays on hover) */}
          <video
            ref={videoRef}
            src={member.video}
            muted
            loop
            playsInline
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

          {/* Role Icon */}
          <motion.div
            animate={isHovered ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="absolute top-4 right-4 z-10"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center shadow-lg`}>
              <member.icon className="w-5 h-5 text-white" />
            </div>
          </motion.div>



          {/* Info at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <motion.h3
              className="text-xl font-bold font-[family-name:var(--font-outfit)] text-white mb-1"
              animate={isHovered ? { y: -4 } : { y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {member.name}
            </motion.h3>
            <motion.p
              className="text-sm text-emerald-400 font-medium"
              animate={isHovered ? { y: -4 } : { y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {member.role}
            </motion.p>
            <motion.p
              className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2"
              initial={{ opacity: 1, y: 10 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {member.description}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pb-16">
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
          >
            <Heart className="w-4 h-4" />
            <span>Our Mission & Team</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 1, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-[family-name:var(--font-outfit)] leading-[1.1] tracking-tight mb-6"
          >
            We&apos;re on a Mission to{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient">End Food Waste</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed"
          >
            RePlate is a student-driven initiative connecting surplus food from businesses
            with communities who need it. Every meal rescued is a step toward a sustainable future.
          </motion.p>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Our Mission',
                desc: 'To eliminate food waste by creating a seamless bridge between businesses with surplus food and communities in need.',
                color: 'from-emerald-500 to-green-500',
              },
              {
                icon: Globe,
                title: 'Our Vision',
                desc: 'A world where no edible food goes to waste — where every meal finds its way to someone who needs it.',
                color: 'from-green-500 to-teal-500',
              },
              {
                icon: Sparkles,
                title: 'Our Values',
                desc: 'Sustainability, community impact, transparency, and innovation drive every feature we build and every decision we make.',
                color: 'from-teal-500 to-emerald-500',
              },
            ].map((item, i) => (
              <GlassCard key={item.title} delay={i * 0.15} className="px-8 pb-8 pt-10 text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-outfit)] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] via-transparent to-emerald-500/[0.03]" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Food Rescued', value: 12847, suffix: ' kg', icon: Leaf },
              { label: 'Meals Served', value: 32118, suffix: '+', icon: Users },
              { label: 'Partner Businesses', value: 180, suffix: '+', icon: Globe },
              { label: 'Active Volunteers', value: 420, suffix: '+', icon: Heart },
            ].map((stat, i) => (
              <GlassCard key={stat.label} delay={i * 0.1} className="p-6 text-center">
                <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-outfit)] text-white mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-emerald-400 text-sm font-semibold tracking-wider uppercase mb-3">
              The Humans Behind RePlate
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A passionate team of students and developers building technology to fight food waste. Hover over our cards to see us in action!
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {teamMembers.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* UN SDG Alignment */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
        <div className="max-w-4xl mx-auto relative">
          <GlassCard hover={false} className="p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5" />
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-outfit)] mb-4">
                Aligned with <span className="text-gradient">UN Sustainable Development Goals</span>
              </h3>
              <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
                RePlate directly contributes to SDG 2 (Zero Hunger), SDG 12 (Responsible Consumption & Production),
                and SDG 13 (Climate Action). According to the UN, reducing food waste is one of the most impactful
                actions we can take to combat climate change.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { goal: 'SDG 2', label: 'Zero Hunger', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                  { goal: 'SDG 12', label: 'Responsible Consumption', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                  { goal: 'SDG 13', label: 'Climate Action', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
                ].map((sdg) => (
                  <span
                    key={sdg.goal}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${sdg.color}`}
                  >
                    {sdg.goal}: {sdg.label}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
