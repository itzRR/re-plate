export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Map', href: '/map' },
  { label: 'Impact', href: '/impact' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'About', href: '/about' },
];

export const FOOD_CATEGORIES = [
  { value: 'bakery', label: 'Bakery & Bread', icon: '🍞' },
  { value: 'prepared-meals', label: 'Prepared Meals', icon: '🍽️' },
  { value: 'fruits-vegetables', label: 'Fruits & Vegetables', icon: '🥗' },
  { value: 'dairy', label: 'Dairy Products', icon: '🧀' },
  { value: 'beverages', label: 'Beverages', icon: '🥤' },
  { value: 'snacks', label: 'Snacks & Treats', icon: '🍪' },
  { value: 'other', label: 'Other', icon: '📦' },
];

export const DIETARY_TAGS = [
  { value: 'vegan', label: 'Vegan', color: '#22C55E' },
  { value: 'vegetarian', label: 'Vegetarian', color: '#16A34A' },
  { value: 'halal', label: 'Halal', color: '#3B82F6' },
  { value: 'kosher', label: 'Kosher', color: '#8B5CF6' },
  { value: 'gluten-free', label: 'Gluten-Free', color: '#F59E0B' },
  { value: 'nut-free', label: 'Nut-Free', color: '#EF4444' },
  { value: 'dairy-free', label: 'Dairy-Free', color: '#06B6D4' },
];

export const BADGE_CONFIG: Record<
  string,
  { label: string; icon: string; description: string }
> = {
  'eco-hero': {
    label: 'Eco Hero',
    icon: '🌍',
    description: 'Saved 100+ kg of food',
  },
  'food-saver': {
    label: 'Food Saver',
    icon: '🍽️',
    description: 'Rescued 50+ meals',
  },
  'community-champion': {
    label: 'Community Champion',
    icon: '🏆',
    description: 'Top contributor this month',
  },
  'first-donation': {
    label: 'First Steps',
    icon: '🌱',
    description: 'Made first donation',
  },
  'weekly-warrior': {
    label: 'Weekly Warrior',
    icon: '⚡',
    description: 'Active 7 days in a row',
  },
  'monthly-master': {
    label: 'Monthly Master',
    icon: '👑',
    description: 'Top donor of the month',
  },
};

export const DEFAULT_MAP_CENTER = { lat: 6.9271, lng: 79.8612 }; // Colombo, Sri Lanka
export const DEFAULT_MAP_ZOOM = 13;

// Impact calculation constants
export const CO2_PER_KG_FOOD = 3.58; // kg CO2 saved per kg food rescued
export const MEALS_PER_KG = 2.5; // approximate meals per kg
export const MONEY_SAVED_PER_KG = 8.5; // $ saved per kg
