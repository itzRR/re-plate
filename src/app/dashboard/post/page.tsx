'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ShieldAlert,
  X,
  Link2,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FOOD_CATEGORIES, DIETARY_TAGS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // AI description generation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Auth state
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      setUserRole(profile?.role || null);
      setAuthChecking(false);
    };
    checkAuth();
  }, [router, supabase]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const newFiles = [...imageFiles, ...files].slice(0, 5); // Max 5 images
    setImageFiles(newFiles);
    
    // Generate previews
    newFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => {
          const updated = [...prev];
          updated[index] = reader.result as string;
          return updated.slice(0, newFiles.length);
        });
      };
      reader.readAsDataURL(file);
    });

    // Set first image as main preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(newFiles[0]);
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setImagePreview(newPreviews[0] || null);
  };

  const addImageFromUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;

    // Convert Google Drive share link to direct image URL
    let directUrl = url;
    const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      directUrl = `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w800`;
    }

    if (imagePreviews.length < 5) {
      setImagePreviews(prev => [...prev, directUrl]);
      if (!imagePreview) setImagePreview(directUrl);
    }
    setImageUrl('');
    setShowUrlInput(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const now = new Date();
      const expiryDate = new Date(now.getTime() + parseInt(expiryHours) * 60 * 60 * 1000);
      const pickupDate = new Date(now.getTime() + 30 * 60 * 1000); // 30 min from now

      // Get image URL - either from file upload or pasted URL
      let imageUrl = null;
      
      // Check if first preview is a pasted URL (not a data: URI)
      const firstPreview = imagePreviews[0] || null;
      if (firstPreview && !firstPreview.startsWith('data:')) {
        // It's a pasted URL, use it directly
        imageUrl = firstPreview;
      } else if (imageFiles.length > 0) {
        // Upload file to Supabase Storage
        const file = imageFiles[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('food-images')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });
        
        if (uploadError) {
          console.warn('Image upload failed, using placeholder:', uploadError.message);
        } else {
          const { data: urlData } = supabase.storage
            .from('food-images')
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from('food_listings').insert({
        business_id: user.id,
        title,
        description,
        category,
        quantity,
        unit,
        dietary_tags: selectedTags,
        image_url: imageUrl,
        priority_level: parseInt(expiryHours) <= 4 ? 'urgent' : parseInt(expiryHours) <= 8 ? 'high' : 'normal',
        pickup_time: pickupDate.toISOString(),
        expiry_time: expiryDate.toISOString(),
        location: pickupLocation,
        status: 'available',
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      console.error('Post error:', err);
      setSubmitError(err.message || 'Failed to post food listing');
    } finally {
      setSubmitLoading(false);
    }
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

  // Auth loading state
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Block public users
  if (userRole === 'public') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <GlassCard hover={false} className="p-12 max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-3">
            Not Authorized
          </h2>
          <p className="text-slate-400 mb-8">
            Only Business, Volunteer, and Charity accounts can post food listings. You are logged in as a Public user.
          </p>
          <Link href="/marketplace" className="btn-primary text-sm text-center inline-block">
            <span>Browse Marketplace Instead</span>
          </Link>
        </GlassCard>
      </div>
    );
  }

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
            <h2 className="text-2xl font-bold font-heading mb-3">
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
          <h1 className="text-3xl sm:text-4xl font-bold font-heading">
            Post <span className="text-gradient">Surplus Food</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Share your surplus food with the community before it goes to waste.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload - Google Drive Style */}
          <GlassCard hover={false} delay={0.1} className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold mb-4">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              Food Photos
              <span className="text-xs text-slate-500 font-normal ml-auto">{imagePreviews.length}/5 photos</span>
            </div>

            {/* Thumbnail Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                {imagePreviews.map((preview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group"
                  >
                    <img
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23334155" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2394a3b8" font-size="12">No preview</text></svg>'; }}
                    />
                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-500/90 text-[10px] font-bold text-white">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                    <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-emerald-500/40 rounded-xl transition-all" />
                  </motion.div>
                ))}

                {/* Add more button */}
                {imagePreviews.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-emerald-500/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-slate-500" />
                    <span className="text-[10px] text-slate-500">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {/* Empty upload state */}
            {imagePreviews.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {/* Upload from device */}
                <label className="block cursor-pointer">
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-white/10 hover:border-emerald-500/30 flex flex-col items-center justify-center gap-3 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Upload from device</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Paste URL */}
                <button
                  type="button"
                  onClick={() => setShowUrlInput(true)}
                  className="aspect-[4/3] rounded-xl border-2 border-dashed border-white/10 hover:border-sky-500/30 flex flex-col items-center justify-center gap-3 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-sky-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Paste image URL</p>
                    <p className="text-xs text-slate-500 mt-1">Google Drive, Imgur, etc.</p>
                  </div>
                </button>
              </div>
            )}

            {/* URL Input */}
            <AnimatePresence>
              {showUrlInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mt-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Paste image URL or Google Drive link..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/30 focus:ring-1 focus:ring-sky-500/20 transition-all text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageFromUrl())}
                        autoFocus
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addImageFromUrl}
                      disabled={!imageUrl.trim()}
                      className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors disabled:opacity-40"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowUrlInput(false); setImageUrl(''); }}
                      className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 ml-1">
                    Supports: Direct image links, Google Drive share links, Imgur, Unsplash
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add URL button when thumbnails exist */}
            {imagePreviews.length > 0 && imagePreviews.length < 5 && !showUrlInput && (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 transition-colors mt-2"
              >
                <Link2 className="w-3.5 h-3.5" />
                Or paste an image URL
              </button>
            )}
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
          {/* Submit Error */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center mb-4"
            >
              {submitError}
            </motion.div>
          )}

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
            <button
              type="submit"
              disabled={submitLoading}
              className="btn-primary flex-1 text-sm disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2">
                {submitLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {submitLoading ? 'Posting...' : 'Post Food Listing'}
              </span>
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
