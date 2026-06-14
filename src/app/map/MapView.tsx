'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FoodListing } from '@/lib/types';
import { formatTimeRemaining, getUrgencyColor } from '@/lib/utils';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import Link from 'next/link';
import { MapPin, Clock, ExternalLink } from 'lucide-react';

// ─── Custom green marker icon ─────────────────────────────────────────────────
function createMarkerIcon(active: boolean) {
  const size = active ? 18 : 12;
  const outerSize = active ? 30 : 22;
  return L.divIcon({
    className: '',
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    popupAnchor: [0, -(outerSize / 2 + 4)],
    html: `<div style="
      width:${outerSize}px;height:${outerSize}px;
      display:flex;align-items:center;justify-content:center;
      border-radius:50%;
      background:rgba(34,197,94,${active ? 0.25 : 0.15});
      border:2px solid ${active ? '#22C55E' : 'rgba(34,197,94,0.5)'};
      transition:all 0.3s ease;
      ${active ? 'box-shadow:0 0 18px rgba(34,197,94,0.5);' : ''}
    ">
      <div style="
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:#22C55E;
        ${active ? 'box-shadow:0 0 8px rgba(34,197,94,0.8);' : ''}
      "></div>
    </div>`,
  });
}

function createUserIcon() {
  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<div style="
      width:24px;height:24px;
      border-radius:50%;
      background:rgba(59,130,246,0.3);
      border:2px solid #3B82F6;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 12px rgba(59,130,246,0.5);
    ">
      <div style="width:10px;height:10px;border-radius:50%;background:#3B82F6;"></div>
    </div>`,
  });
}

// ─── Map controller for re-centering ──────────────────────────────────────────
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface MapViewProps {
  listings: FoodListing[];
  center: [number, number];
  zoom: number;
  activeListing: string | null;
  userLocation: { lat: number; lng: number } | null;
  onListingClick: (id: string) => void;
}

export default function MapView({
  listings,
  center,
  zoom,
  activeListing,
  userLocation,
  onListingClick,
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full z-0"
      style={{ height: 'calc(100vh - 4rem)', background: '#1E293B' }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        maxZoom={19}
      />
      <MapController center={center} zoom={zoom} />

      {/* Food markers */}
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.pickup_lat, listing.pickup_lng]}
          icon={createMarkerIcon(activeListing === listing.id)}
          eventHandlers={{
            click: () => onListingClick(listing.id),
          }}
        >
          <Popup maxWidth={280} minWidth={240}>
            <div className="space-y-2.5 p-1">
              <h3 className="text-sm font-semibold text-[#F8FAFC] leading-tight pr-4">
                {listing.title}
              </h3>
              <div className="flex flex-wrap gap-2 text-xs text-[#94A3B8]">
                <span className="bg-white/5 px-2 py-0.5 rounded-md">
                  {listing.quantity} {listing.unit}
                </span>
                <span className={`px-2 py-0.5 rounded-md ${getUrgencyColor(listing.expiry_time)} bg-white/5`}>
                  ⏱ {formatTimeRemaining(listing.expiry_time)}
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-[#94A3B8]">
                <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-emerald-400" />
                <span>{listing.pickup_location}</span>
              </div>
              <Link
                href={`/marketplace`}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                View Details <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* User location */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={createUserIcon()}
        >
          <Popup>
            <p className="text-xs text-[#F8FAFC] font-medium">📍 Your Location</p>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
