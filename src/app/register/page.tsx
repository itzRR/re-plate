'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Heart,
  HandHeart,
  User,
  ArrowLeft,
  ArrowRight,
  Check,
  Leaf,
  Mail,
  Lock,
  MapPin,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DIETARY_TAGS } from '@/lib/constants';

// ─── Role options ─────────────────────────────────────────────────────────────
const ROLES = [
  {
    id: 'business',
    label: 'Business',
    icon: Building2,
    description: 'Restaurants, cafes, hotels & grocery stores with surplus food to donate.',
    gradient: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  {
    id: 'charity',
    label: 'Charity',
    icon: Heart,
    description: 'Non-profits, shelters, and food banks receiving donations for redistribution.',
    gradient: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    iconColor: 'text-pink-400',
  },
  {
    id: 'volunteer',
    label: 'Volunteer',
    icon: HandHeart,
    description: 'Heroes who collect and deliver food from donors to those in need.',
    gradient: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'public',
    label: 'Public User',
    icon: User,
    description: 'Individuals who want to find and rescue available surplus food nearby.',
    gradient: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
  },
] as const;

// ─── Step labels ──────────────────────────────────────────────────────────────
const STEPS = ['Choose Role', 'Account Details', 'Your Profile'];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [location, setLocation] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDietary = (value: string) => {
    setDietaryPreferences((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const canProceed = () => {
    if (step === 0) return !!selectedRole;
    if (step === 1) return name && email && password && confirmPassword && password === confirmPassword;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep((s) => s + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1500);
    }
  };

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4 pb-12 relative overflow-hidden">
      {/* ── Floating orbs ──────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{ background: 'rgba(22,163,74,0.07)', filter: 'blur(100px)', top: '-5%', left: '-8%' }}
          animate={{ x: [0, 30, -15, 0], y: [0, -25, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{ background: 'rgba(34,197,94,0.05)', filter: 'blur(90px)', bottom: '-8%', right: '-5%' }}
          animate={{ x: [0, -20, 25, 0], y: [0, 15, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── Card ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 1, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_60px_rgba(0,0,0,0.4)] p-8 sm:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-2xl font-bold text-[#F8FAFC]">
              Re<span className="text-gradient">Plate</span>
            </span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: step === i ? 1.1 : 1,
                    }}
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2',
                      i < step
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : i === step
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-white/5 border-white/10 text-[#64748B]',
                    )}
                  >
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </motion.div>
                  <span
                    className={cn(
                      'text-[10px] mt-1.5 font-medium transition-colors whitespace-nowrap',
                      i <= step ? 'text-emerald-400' : 'text-[#64748B]',
                    )}
                  >
                    {label}
                  </span>
                </div>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="w-12 sm:w-20 h-0.5 mx-2 mt-[-16px] rounded-full overflow-hidden bg-white/[0.06]">
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: i < step ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* ── Step 1: Role Selection ──── */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 1, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h2 className="font-heading text-xl font-bold text-[#F8FAFC] mb-1">I am a…</h2>
                    <p className="text-xs text-[#94A3B8]">Choose how you want to use RePlate</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((role) => {
                      const isSelected = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={cn(
                            'relative p-4 rounded-xl border text-left transition-all duration-300 group',
                            isSelected
                              ? `bg-gradient-to-br ${role.gradient} ${role.border} shadow-lg`
                              : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]',
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                          <role.icon
                            className={cn(
                              'w-8 h-8 mb-3 transition-colors',
                              isSelected ? role.iconColor : 'text-[#64748B] group-hover:text-[#94A3B8]',
                            )}
                          />
                          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1">{role.label}</h3>
                          <p className="text-[10px] leading-relaxed text-[#94A3B8]">{role.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Account Details ──── */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 1, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <h2 className="font-heading text-xl font-bold text-[#F8FAFC] mb-1">Create Account</h2>
                    <p className="text-xs text-[#94A3B8]">Fill in your details to get started</p>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Profile ──── */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 1, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="text-center mb-6">
                    <h2 className="font-heading text-xl font-bold text-[#F8FAFC] mb-1">Almost There!</h2>
                    <p className="text-xs text-[#94A3B8]">Help us personalise your experience</p>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Colombo, Sri Lanka"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-[#F8FAFC] placeholder:text-[#4B5563] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Dietary preferences */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                      Dietary Preferences
                    </label>
                    <p className="text-[10px] text-[#64748B]">Select all that apply to help us show relevant listings</p>
                    <div className="grid grid-cols-2 gap-2">
                      {DIETARY_TAGS.map((tag) => {
                        const isSelected = dietaryPreferences.includes(tag.value);
                        return (
                          <button
                            key={tag.value}
                            type="button"
                            onClick={() => toggleDietary(tag.value)}
                            className={cn(
                              'flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all text-sm',
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-[#F8FAFC]'
                                : 'bg-white/[0.02] border-white/[0.06] text-[#94A3B8] hover:bg-white/[0.04] hover:border-white/[0.12]',
                            )}
                          >
                            <div
                              className={cn(
                                'w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all',
                                isSelected
                                  ? 'bg-emerald-500 border-emerald-500'
                                  : 'border-white/20 bg-white/5',
                              )}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-xs font-medium">{tag.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Navigation buttons ───────────── */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-sm font-semibold text-[#94A3B8] hover:bg-white/10 hover:text-[#F8FAFC] transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={!canProceed() || isLoading}
                className={cn(
                  'flex-1 relative overflow-hidden py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
                  'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5',
                )}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : step < 2 ? (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Create Account
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
