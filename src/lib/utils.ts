import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeRemaining(expiryTime: string): string {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getUrgencyColor(expiryTime: string): string {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft <= 1) return 'text-red-500';
  if (hoursLeft <= 3) return 'text-amber-500';
  return 'text-emerald-500';
}

export function getUrgencyBg(expiryTime: string): string {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft <= 1) return 'bg-red-500/10 border-red-500/20';
  if (hoursLeft <= 3) return 'bg-amber-500/10 border-amber-500/20';
  return 'bg-emerald-500/10 border-emerald-500/20';
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toFixed(0);
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tonnes`;
  return `${kg.toFixed(0)} kg`;
}
