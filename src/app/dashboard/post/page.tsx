'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Upload,
  MapPin,
  Clock,
  Package,
  Tag,
  FileText,
  Check,
  Image as ImageIcon,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FOOD_CATEGORIES, DIETARY_TAGS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function PostFoodPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('portions');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expiryHours, setExpiryHours] = useState('6');
  const [pickupLocation, setPickupLocation] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // AI description generation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const generateAIDescription = async () => {
    if (!title.trim()) {
      setAiError('Please enter a food title first');
      setTimeout(() => setAiError(null), 3000);
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          quantity: quantity || '1',
          unit,
          category: category || 'other',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate description');
      }

      setDescription(data.description);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      setAiError(message);
      setTimeout(() => setAiError(null), 4000);
    } finally {
      setAiLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 1, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <GlassCard hover={false} className="p-12 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-outfit)] mb-3">
              Food Listed Successfully!
            </h2>
            <p className="text-slate-400 mb-8">
              Your surplus food has been posted. Nearby users and charities will be notified.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/marketplace" className="btn-primary text-sm text-center">
                <span>View in Marketplace</span>
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setTitle('');
                  setDescription('');
                  setQuantity('');
                  setCategory('');
                  setSelectedTags([]);
                  setImagePreview(null);
                }}
                className="btn-secondary text-sm"
              >
                Post Another
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-outfit)]">
            Post <span className="text-gradient">Surplus Food</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Share your surplus food with the community before it goes to waste.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <GlassCard hover={false} delay={0.1} className="p-6">
            <label className="flex items-center gap-2 text-sm font-semibold mb-4">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              Food Photo
            </label>
            <label className="block cursor-pointer">
              {imagePreview ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-emerald-500/30 flex flex-col items-center justify-center gap-3 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Click to upload a photo</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </GlassCard>

          {/* Basic Info */}
          <GlassCard hover={false} delay={0.15} className="p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Basic Information
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fresh Sandwiches & Wraps"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm text-slate-300">Description</label>
                <motion.button
                  type="button"
                  onClick={generateAIDescription}
                  disabled={aiLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
                    'bg-gradient-to-r from-purple-500 to-pink-500',
                    'text-white shadow-lg shadow-purple-500/25',
                    'hover:shadow-purple-500/40 hover:from-purple-400 hover:to-pink-400',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-all duration-300'
                  )}
                >
                  {aiLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  {aiLoading ? 'Generating...' : '✨ AI Magic'}
                </motion.button>
              </div>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the food, its condition, and any relevant details..."
                  rows={3}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm resize-none',
                    aiLoading
                      ? 'border-purple-500/30 ring-1 ring-purple-500/20'
                      : 'border-white/10'
                  )}
                />
                {/* Loading overlay on textarea */}
                <AnimatePresence>
                  {aiLoading && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-xl bg-purple-500/5 backdrop-blur-[1px] flex items-center justify-center"
                    >
                      <div className="flex items-center gap-2 text-purple-300 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI is crafting your description...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* AI Error message */}
              <AnimatePresence>
                {aiError && (
                  <motion.p
                    initial={{ opacity: 1, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-red-400 mt-1.5"
                  >
                    {aiError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Quantity *</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g., 25"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm appearance-none"
                >
                  <option value="portions">Portions</option>
                  <option value="kg">Kilograms</option>
                  <option value="pieces">Pieces</option>
                  <option value="boxes">Boxes</option>
                  <option value="trays">Trays</option>
                  <option value="liters">Liters</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Category */}
          <GlassCard hover={false} delay={0.2} className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold mb-4">
              <Package className="w-4 h-4 text-emerald-400" />
              Category *
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FOOD_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center',
                    category === cat.value
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10 hover:text-white'
                  )}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Dietary Tags */}
          <GlassCard hover={false} delay={0.25} className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold mb-4">
              <Tag className="w-4 h-4 text-emerald-400" />
              Dietary Information
            </div>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map((tag) => (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => toggleTag(tag.value)}
                  className={cn(
                    'px-4 py-2 rounded-full border text-sm font-medium transition-all',
                    selectedTags.includes(tag.value)
                      ? 'border-emerald-500/30 text-emerald-400'
                      : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                  )}
                  style={
                    selectedTags.includes(tag.value)
                      ? { backgroundColor: `${tag.color}15`, borderColor: `${tag.color}40` }
                      : undefined
                  }
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Pickup Details */}
          <GlassCard hover={false} delay={0.3} className="p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Pickup Details
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Pickup Location *</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g., 123 Main Street, Colombo 03"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                Available for (hours) *
              </label>
              <div className="flex gap-3">
                {['2', '4', '6', '8', '12', '24'].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setExpiryHours(h)}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all',
                      expiryHours === h
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:border-white/10'
                    )}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-4"
          >
            <Link
              href="/dashboard"
              className="btn-secondary flex-1 text-center text-sm"
            >
              Cancel
            </Link>
            <button type="submit" className="btn-primary flex-1 text-sm">
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Post Food Listing
              </span>
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
