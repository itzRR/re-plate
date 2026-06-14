'use client';

import { motion } from 'motion/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import {
  Leaf,
  Utensils,
  CloudOff,
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Users,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GlassCard } from '@/components/ui/GlassCard';
import { mockImpactMetrics } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// ─── Mock Data for Charts ──────────────────────────────────────────────────────
const monthlyTrendData = [
  { month: 'Jan', food_saved: 720, meals: 1800 },
  { month: 'Feb', food_saved: 840, meals: 2100 },
  { month: 'Mar', food_saved: 980, meals: 2450 },
  { month: 'Apr', food_saved: 870, meals: 2175 },
  { month: 'May', food_saved: 1050, meals: 2625 },
  { month: 'Jun', food_saved: 1120, meals: 2800 },
  { month: 'Jul', food_saved: 1240, meals: 3100 },
  { month: 'Aug', food_saved: 1080, meals: 2700 },
  { month: 'Sep', food_saved: 1350, meals: 3375 },
  { month: 'Oct', food_saved: 1480, meals: 3700 },
  { month: 'Nov', food_saved: 1590, meals: 3975 },
  { month: 'Dec', food_saved: 1520, meals: 3800 },
];

const categoryPieData = [
  { name: 'Bakery', value: 2450, color: '#10B981' },
  { name: 'Prepared Meals', value: 4200, color: '#059669' },
  { name: 'Fruits & Veg', value: 2100, color: '#14B8A6' },
  { name: 'Dairy', value: 1350, color: '#0D9488' },
  { name: 'Beverages', value: 980, color: '#2DD4BF' },
  { name: 'Snacks', value: 1767, color: '#34D399' },
];

const topBusinessesData = [
  { name: 'Hilton Colombo', kg: 342 },
  { name: 'Cargills FoodCity', kg: 298 },
  { name: 'Keells Super', kg: 263 },
  { name: 'Ministry of Crab', kg: 195 },
  { name: 'Flour Bakery', kg: 167 },
  { name: 'Gallery Cafe', kg: 132 },
];

// ─── Custom Tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      className={cn(
        'rounded-xl px-4 py-3',
        'bg-slate-800/95 backdrop-blur-xl',
        'border border-emerald-500/20',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
      )}
    >
      <p className="text-sm font-medium text-white mb-1.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs text-slate-300">
          <span
            className="inline-block w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: entry.color ?? '#10B981' }}
          />
          {entry.name}: <span className="font-semibold text-white">{entry.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0];
  return (
    <div
      className={cn(
        'rounded-xl px-4 py-3',
        'bg-slate-800/95 backdrop-blur-xl',
        'border border-emerald-500/20',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
      )}
    >
      <p className="text-sm font-medium text-white">{data.name}</p>
      <p className="text-xs text-slate-300">
        <span className="font-semibold text-white">{data.value?.toLocaleString()}</span> kg
      </p>
    </div>
  );
}

// ─── Stat Card Config ────────────────────────────────────────────────────────────
const statCards = [
  {
    label: 'Food Rescued',
    value: mockImpactMetrics.food_saved_kg,
    suffix: ' kg',
    icon: Leaf,
    gradient: 'from-emerald-500/20 to-green-500/10',
    iconBg: 'bg-emerald-500/15 border-emerald-500/25',
    iconColor: 'text-emerald-400',
  },
  {
    label: 'Meals Provided',
    value: mockImpactMetrics.meals_provided,
    suffix: '',
    icon: Utensils,
    gradient: 'from-green-500/20 to-teal-500/10',
    iconBg: 'bg-green-500/15 border-green-500/25',
    iconColor: 'text-green-400',
  },
  {
    label: 'CO₂ Saved',
    value: mockImpactMetrics.co2_saved_kg / 1000,
    suffix: ' t',
    decimals: 1,
    icon: CloudOff,
    gradient: 'from-teal-500/20 to-cyan-500/10',
    iconBg: 'bg-teal-500/15 border-teal-500/25',
    iconColor: 'text-teal-400',
  },
  {
    label: 'Money Saved',
    value: mockImpactMetrics.money_saved,
    prefix: '$',
    suffix: '',
    icon: DollarSign,
    gradient: 'from-cyan-500/20 to-emerald-500/10',
    iconBg: 'bg-cyan-500/15 border-cyan-500/25',
    iconColor: 'text-cyan-400',
  },
];

// ─── Page Component ──────────────────────────────────────────────────────────────
export default function ImpactDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              Impact Dashboard
            </span>
          </h1>
          <p className="mt-3 text-lg text-[#94A3B8] max-w-2xl">
            Tracking our collective effort to rescue food and reduce waste
            across the community.
          </p>
        </motion.div>

        {/* ── Stat Counter Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {statCards.map((stat, i) => (
            <GlassCard key={stat.label} hover={false} delay={i * 0.1}>
              <div
                className={cn(
                  'p-6 bg-gradient-to-br',
                  stat.gradient
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl border',
                      stat.iconBg
                    )}
                  >
                    <stat.icon className={cn('w-6 h-6', stat.iconColor)} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500/40" />
                </div>
                <AnimatedCounter
                  end={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  className="text-3xl font-bold text-[#F8FAFC] block"
                />
                <p className="text-sm text-[#94A3B8] mt-1 font-medium">
                  {stat.label}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* ── Monthly Trend (Area Chart) ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div
            className={cn(
              'rounded-2xl p-6',
              'bg-white/[0.05] backdrop-blur-xl',
              'border border-white/[0.08]',
              'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#F8FAFC]">
                  Monthly Food Rescue Trend
                </h2>
                <p className="text-sm text-[#64748B]">
                  Food rescued (kg) over the past 12 months
                </p>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient
                      id="areaFillGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#10B981"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="#10B981"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="food_saved"
                    name="Food Saved (kg)"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#areaFillGradient)"
                    dot={false}
                    activeDot={{
                      r: 6,
                      fill: '#10B981',
                      stroke: '#0F172A',
                      strokeWidth: 3,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* ── Two-Column Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart: Food Categories */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className={cn(
                'rounded-2xl p-6 h-full',
                'bg-white/[0.05] backdrop-blur-xl',
                'border border-white/[0.08]',
                'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <PieChartIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#F8FAFC]">
                    Food by Category
                  </h2>
                  <p className="text-sm text-[#64748B]">
                    Distribution of rescued food types
                  </p>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryPieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-[#94A3B8] truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-[#64748B] ml-auto">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bar Chart: Top Businesses */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className={cn(
                'rounded-2xl p-6 h-full',
                'bg-white/[0.05] backdrop-blur-xl',
                'border border-white/[0.08]',
                'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#F8FAFC]">
                    Top Contributing Businesses
                  </h2>
                  <p className="text-sm text-[#64748B]">
                    Food rescued by top partners (kg)
                  </p>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topBusinessesData}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: '#94A3B8', fontSize: 12 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={110}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="kg"
                      name="Food Rescued (kg)"
                      fill="url(#barGradient)"
                      radius={[0, 8, 8, 0]}
                      barSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Community Stats Footer ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div
            className={cn(
              'rounded-2xl p-8',
              'bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-teal-500/10',
              'backdrop-blur-xl',
              'border border-emerald-500/10',
              'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
            )}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/25">
                  <Users className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F8FAFC]">
                    Join Our Growing Community
                  </h3>
                  <p className="text-[#94A3B8] text-sm">
                    {mockImpactMetrics.active_donors} active donors •{' '}
                    {mockImpactMetrics.active_volunteers} volunteers making a
                    difference
                  </p>
                </div>
              </div>
              <button
                className={cn(
                  'rounded-xl px-8 py-3.5',
                  'bg-gradient-to-r from-emerald-500 to-green-500',
                  'text-white font-semibold text-sm',
                  'shadow-[0_0_30px_rgba(34,197,94,0.3)]',
                  'hover:shadow-[0_0_50px_rgba(34,197,94,0.5)]',
                  'hover:from-emerald-400 hover:to-green-400',
                  'transition-all duration-300',
                  'active:scale-[0.98] shrink-0'
                )}
              >
                Start Contributing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
