export type DrinkCategory = 
  | 'all'
  | 'signature'
  | 'pourover'
  | 'espresso'
  | 'matcha_tea'
  | 'iced_coldbrew'
  | 'bakery';

export interface CustomizationOptions {
  size: 'regular' | 'large';
  temperature: 'iced' | 'hot';
  milk: 'oat' | 'whole' | 'almond' | 'pistachio' | 'none';
  shots: 'single' | 'double' | 'triple' | 'decaf';
  sweetness: 0 | 25 | 50 | 100;
  syrup: 'none' | 'vanilla' | 'lavender_cardamom' | 'salted_brown_sugar' | 'toasted_maple';
  iceLevel: 'standard' | 'light' | 'sphere_cube';
  bringOwnCup: boolean;
  specialInstructions: string;
}

export interface MenuItem {
  id: string;
  roasteryId: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: DrinkCategory;
  image: string;
  roastNotes?: string[];
  popular?: boolean;
  calories?: number;
  isFood?: boolean;
}

export interface Roastery {
  id: string;
  name: string;
  neighborhood: string;
  distance: string;
  walkTime: string;
  rating: number;
  reviewsCount: number;
  tagline: string;
  description: string;
  heroImage: string;
  accentPastel: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  roastPhilosophy: string;
  specialtyOrigins: string[];
  roastSchedule: string;
  openingHours: string;
  address: string;
  baristasOnShift: { name: string; specialty: string }[];
}

export interface CartItem {
  id: string; // unique cart item id
  menuItem: MenuItem;
  roastery: Roastery;
  customization: CustomizationOptions;
  unitPrice: number;
  quantity: number;
}

export type OrderStatus = 
  | 'received'       // Order placed & queued
  | 'grinding'       // Grinding & extracting espresso
  | 'crafting'       // Steaming milk & assembling
  | 'ready'          // Waiting at counter
  | 'picked_up';     // Customer collected

export interface OrderTrackingStep {
  status: OrderStatus;
  label: string;
  subtitle: string;
  iconName: string;
  timestamp?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "PB-204"
  roasteryId: string;
  roasteryName: string;
  roasteryAddress: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  pointsEarned: number;
  stampsEarned: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  estimatedReadyTime: string;
  pickupCounter: string;
  pickupPin: string;
  qrCodeUrl?: string;
  bringOwnCup: boolean;
  activeStepIndex: number;
  baristaNote?: string;
}

export interface LoyaltyTier {
  id: 'seedling' | 'friend' | 'circle';
  name: string;
  minPoints: number;
  perks: string[];
  color: string;
  badgeBg: string;
}

export interface RewardVoucher {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  code: string;
  category: 'drink' | 'discount' | 'upgrade' | 'merch';
  icon: string;
  discountAmount?: number;
}
