'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MapPin,
  Navigation,
  Leaf,
  Globe,
  Loader2,
} from 'lucide-react';
import { mockFoodListings } from '@/lib/mock-data';
import { FOOD_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { FoodListing } from '@/lib/types';
import { CountdownTimer } from '@/components/ui/CountdownTimer';

// ─── Dynamically load the map (SSR disabled for Leaflet) ──────────────────────
const MapView = dynamic(() => import('./MapView').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-[#1E293B] rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#94A3B8]">Loading map…</span>
      </div>
    </div>
  ),
});

// ─── Page Component ───────────────────────────────────────────────────────────
export default function MapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeListing, setActiveListing] = useState<string | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Start with a world view, auto-detect later
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(3);

  // Location search state
  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showLocationResults, setShowLocationResults] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  // Auto-detect user location on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setMapCenter([loc.lat, loc.lng]);
          setMapZoom(13);

          // Reverse geocode to get country name
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}&zoom=5&accept-language=en`
          )
            .then((r) => r.json())
            .then((data) => {
              if (data.address?.country) {
                setDetectedCountry(data.address.country);
              }
            })
            .catch(() => {});
        },
        () => {
          // Geolocation denied or unavailable — stay at world view
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  // Search for locations globally using Nominatim (OpenStreetMap geocoding — free, no API key)
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setLocationResults([]);
      setShowLocationResults(false);
      return;
    }
    setIsSearchingLocation(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=en`
      );
      const data = await res.json();
      setLocationResults(data);
      setShowLocationResults(data.length > 0);
    } catch {
      setLocationResults([]);
    } finally {
      setIsSearchingLocation(false);
    }
  }, []);

  // Debounced location search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearch.length >= 2) {
        searchLocation(locationSearch);
      } else {
        setLocationResults([]);
        setShowLocationResults(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [locationSearch, searchLocation]);

  const handleLocationSelect = (result: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setMapCenter([lat, lng]);
    setMapZoom(13);
    setLocationSearch(result.display_name.split(',')[0]);
    setShowLocationResults(false);
  };

  const filteredListings = useMemo(() => {
    return mockFoodListings.filter((listing) => {
      const matchesSearch =
        !searchQuery ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.donor_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || listing.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setMapCenter([loc.lat, loc.lng]);
        setMapZoom(15);
      },
      () => alert('Unable to retrieve your location. Please allow location access.'),
    );
  }, []);

  const handleListingClick = useCallback((id: string) => {
    setActiveListing(id);
    const listing = mockFoodListings.find((l) => l.id === id);
    if (listing) {
      setMapCenter([listing.pickup_lat, listing.pickup_lng]);
      setMapZoom(16);
    }
  }, []);

  const priorityBorder: Record<string, string> = {
    urgent: 'border-l-red-500',
    high: 'border-l-amber-500',
    normal: 'border-l-emerald-500',
  };

  return (
    <div className="pt-20 h-screen flex flex-col overflow-hidden">
      {/* ── Desktop layout ───────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar — hidden on mobile */}
        <aside className="hidden lg:flex flex-col w-[350px] shrink-0 border-r border-white/[0.06] bg-[#0F172A]/80 backdrop-blur-xl z-10">
          {/* Header */}
          <div className="p-4 border-b border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold">Nearby Food</h2>
              <span className="ml-auto text-xs text-[#94A3B8] bg-white/5 px-2 py-0.5 rounded-full">
                {filteredListings.length}
              </span>
            </div>

            {/* Global Location Search */}
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                placeholder="Search any city or country…"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                onFocus={() => locationResults.length > 0 && setShowLocationResults(true)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-sm text-[#F8FAFC] placeholder:text-emerald-500/40 focus:outline-none focus:border-emerald-500/40 transition-colors"
              />
              {isSearchingLocation && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-spin" />
              )}
              {/* Location results dropdown */}
              {showLocationResults && (
                <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-[#1E293B] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {locationResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => handleLocationSelect(result)}
                      className="w-full text-left px-4 py-3 text-sm text-[#F8FAFC] hover:bg-emerald-500/10 transition-colors flex items-start gap-2.5 border-b border-white/[0.04] last:border-0"
                    >
                      <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-2 text-xs leading-relaxed">{result.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {detectedCountry && (
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/60">
                <Navigation className="w-3 h-3" />
                <span>Detected: {detectedCountry}</span>
              </div>
            )}

            {/* Food Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search food, donor…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-emerald-500/40 transition-colors"
              />
            </div>
            {/* Category filters */}
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  !selectedCategory
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-[#94A3B8] border border-white/[0.06] hover:bg-white/10',
                )}
              >
                All
              </button>
              {FOOD_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value === selectedCategory ? null : cat.value)}
                  className={cn(
                    'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    selectedCategory === cat.value
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-[#94A3B8] border border-white/[0.06] hover:bg-white/10',
                  )}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Listing list */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filteredListings.map((listing, i) => (
                <motion.button
                  key={listing.id}
                  layout
                  initial={{ opacity: 1, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handleListingClick(listing.id)}
                  className={cn(
                    'w-full text-left p-4 border-b border-white/[0.04] border-l-2 transition-all',
                    priorityBorder[listing.priority_level],
                    activeListing === listing.id
                      ? 'bg-emerald-500/10'
                      : 'hover:bg-white/[0.03]',
                  )}
                >
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold text-[#F8FAFC] line-clamp-1">
                      {listing.title}
                    </h3>
                    <CountdownTimer expiryTime={listing.expiry_time} className="shrink-0 text-[10px] px-2 py-0.5" showIcon={false} />
                  </div>
                  <p className="text-xs text-[#94A3B8] mb-2 line-clamp-1">
                    {listing.quantity} {listing.unit}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{listing.pickup_location}</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
            {filteredListings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-[#94A3B8]">
                <Search className="w-8 h-8 mb-3 opacity-40" />
                <p className="text-sm">No listings found</p>
              </div>
            )}
          </div>

          {/* Near Me button */}
          <div className="p-4 border-t border-white/[0.06]">
            <button
              onClick={handleNearMe}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4" />
              Near Me
            </button>
          </div>
        </aside>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            listings={filteredListings}
            center={mapCenter}
            zoom={mapZoom}
            activeListing={activeListing}
            userLocation={userLocation}
            onListingClick={setActiveListing}
          />

          {/* Mobile: Floating controls */}
          <div className="lg:hidden absolute top-4 left-4 right-4 z-[500]">
            {/* Mobile Location Search */}
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                placeholder="Search any city or country…"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                onFocus={() => locationResults.length > 0 && setShowLocationResults(true)}
                className="w-full pl-10 pr-9 py-3 rounded-xl bg-[#0F172A]/90 backdrop-blur-xl border border-emerald-500/20 text-sm text-[#F8FAFC] placeholder:text-emerald-500/40 focus:outline-none focus:border-emerald-500/40 transition-colors shadow-lg"
              />
              {isSearchingLocation && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 animate-spin" />
              )}
              {showLocationResults && (
                <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-[#1E293B]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {locationResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => handleLocationSelect(result)}
                      className="w-full text-left px-4 py-3 text-sm text-[#F8FAFC] hover:bg-emerald-500/10 transition-colors flex items-start gap-2.5 border-b border-white/[0.04] last:border-0"
                    >
                      <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-2 text-xs leading-relaxed">{result.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Near Me floating button */}
          <button
            onClick={handleNearMe}
            className="lg:hidden absolute bottom-24 right-4 z-[500] w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </div>

        {/* ── Mobile bottom sheet ───────────────────── */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 z-[500]">
          {/* Toggle handle */}
          <button
            onClick={() => setMobileSheetOpen((o) => !o)}
            className="w-full flex items-center justify-center py-2 bg-[#0F172A]/90 backdrop-blur-xl border-t border-white/[0.08] rounded-t-2xl"
          >
            <div className="w-10 h-1 rounded-full bg-white/20 mb-1" />
          </button>

          <AnimatePresence>
            {mobileSheetOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: '50vh' }}
                exit={{ height: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-[#0F172A]/95 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden"
              >
                <div className="p-4 space-y-3 h-full flex flex-col">
                  {/* Search */}
                  <div className="relative shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="text"
                      placeholder="Search food, location…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-emerald-500/40 transition-colors"
                    />
                  </div>
                  {/* List */}
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {filteredListings.map((listing) => (
                      <button
                        key={listing.id}
                        onClick={() => {
                          handleListingClick(listing.id);
                          setMobileSheetOpen(false);
                        }}
                        className={cn(
                          'w-full text-left p-3 rounded-xl border transition-all',
                          activeListing === listing.id
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-white/[0.03] border-white/[0.06]',
                        )}
                      >
                        <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1 line-clamp-1">{listing.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                          <span>{listing.quantity} {listing.unit}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.pickup_location}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
