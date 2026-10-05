import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Roastery,
  MenuItem,
  CartItem,
  CustomizationOptions,
  Order,
  OrderStatus,
  RewardVoucher,
} from '../types';
import { ROASTERIES, MENU_ITEMS, REWARDS_CATALOG, LOYALTY_TIERS } from '../data/roasteriesData';

interface AppContextType {
  activeTab: 'explore' | 'menu' | 'activity' | 'rewards';
  setActiveTab: (tab: 'explore' | 'menu' | 'activity' | 'rewards') => void;
  
  // Device mode
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
  
  // Roastery selection
  roasteries: Roastery[];
  selectedRoastery: Roastery;
  setSelectedRoastery: (roastery: Roastery) => void;
  viewingRoasteryDetail: Roastery | null;
  setViewingRoasteryDetail: (roastery: Roastery | null) => void;

  // Menu items
  menuItems: MenuItem[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Customizer Modal
  customizingItem: MenuItem | null;
  openCustomizer: (item: MenuItem) => void;
  closeCustomizer: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, customization: CustomizationOptions, quantity: number) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Applied Reward
  appliedReward: RewardVoucher | null;
  applyReward: (reward: RewardVoucher | null) => void;

  // Loyalty & Stamps
  loyaltyPoints: number;
  stampCount: number; // 0 to 8
  maxStamps: number;
  redeemedVouchers: RewardVoucher[];
  redeemVoucher: (voucher: RewardVoucher) => boolean;

  // Orders & Real-time tracking
  activeOrder: Order | null;
  orderHistory: Order[];
  createOrder: (pickupTiming: string, notes?: string) => Order;
  cancelActiveOrder: () => void;
  fastForwardOrder: () => void;
  reorderPastOrder: (order: Order) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_CUSTOMIZATION: CustomizationOptions = {
  size: 'regular',
  temperature: 'iced',
  milk: 'oat',
  shots: 'double',
  sweetness: 25,
  syrup: 'vanilla',
  iceLevel: 'standard',
  bringOwnCup: false,
  specialInstructions: '',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'menu' | 'activity' | 'rewards'>('explore');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  const [roasteries] = useState<Roastery[]>(ROASTERIES);
  const [selectedRoastery, setSelectedRoastery] = useState<Roastery>(ROASTERIES[0]);
  const [viewingRoasteryDetail, setViewingRoasteryDetail] = useState<Roastery | null>(null);

  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedReward, setAppliedReward] = useState<RewardVoucher | null>(null);

  // Initial Loyalty Profile: 340 points & 5/8 stamps
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(340);
  const [stampCount, setStampCount] = useState<number>(5);
  const maxStamps = 8;
  const [redeemedVouchers, setRedeemedVouchers] = useState<RewardVoucher[]>([]);

  // Orders
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([
    {
      id: 'ord-hist-1',
      orderNumber: 'PB-188',
      roasteryId: 'komorebi',
      roasteryName: 'Komorebi Micro-Roast',
      roasteryAddress: '412 Komorebi Way, Suite B',
      items: [
        {
          id: 'ci-prev-1',
          menuItem: MENU_ITEMS[0],
          roastery: ROASTERIES[0],
          customization: { ...DEFAULT_CUSTOMIZATION },
          unitPrice: 6.25,
          quantity: 1,
        },
      ],
      subtotal: 6.25,
      discount: 0,
      tax: 0.50,
      total: 6.75,
      pointsEarned: 67,
      stampsEarned: 1,
      status: 'picked_up',
      createdAt: 'Yesterday at 9:15 AM',
      estimatedMinutes: 0,
      estimatedReadyTime: 'Completed',
      pickupCounter: 'Express Bar Counter 1',
      pickupPin: '4291',
      bringOwnCup: false,
      activeStepIndex: 4,
      baristaNote: 'Poured with microfoam latte art by Mika.',
    },
  ]);

  // Open customizer
  const openCustomizer = (item: MenuItem) => {
    setCustomizingItem(item);
  };

  const closeCustomizer = () => {
    setCustomizingItem(null);
  };

  // Add to cart with calculation
  const addToCart = (item: MenuItem, customization: CustomizationOptions, quantity: number) => {
    let unitPrice = item.price;
    if (customization.size === 'large') unitPrice += 0.75;
    if (customization.milk === 'pistachio') unitPrice += 0.80;
    if (customization.shots === 'triple') unitPrice += 1.00;
    if (customization.syrup !== 'none' && !item.isFood) unitPrice += 0.50;

    const newItem: CartItem = {
      id: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItem: item,
      roastery: selectedRoastery,
      customization,
      unitPrice,
      quantity,
    };

    setCart(prev => [...prev, newItem]);
    closeCustomizer();
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedReward(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyReward = (reward: RewardVoucher | null) => {
    setAppliedReward(reward);
  };

  const redeemVoucher = (voucher: RewardVoucher): boolean => {
    if (loyaltyPoints < voucher.pointsCost) return false;
    setLoyaltyPoints(prev => prev - voucher.pointsCost);
    setRedeemedVouchers(prev => [...prev, voucher]);
    setAppliedReward(voucher);
    return true;
  };

  // Real-time automatic order status progression simulation
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'picked_up') return;

    const timer = setInterval(() => {
      setActiveOrder(current => {
        if (!current) return null;
        let nextStatus: OrderStatus = current.status;
        let nextIndex = current.activeStepIndex;
        let nextNote = current.baristaNote;

        if (current.status === 'received') {
          nextStatus = 'grinding';
          nextIndex = 1;
          nextNote = `Barista ${current.roasteryId === 'komorebi' ? 'Sora' : 'Elena'} has begun grinding fresh beans for your order.`;
        } else if (current.status === 'grinding') {
          nextStatus = 'crafting';
          nextIndex = 2;
          nextNote = 'Steaming milk to optimal microfoam and assembling drink.';
        } else if (current.status === 'crafting') {
          nextStatus = 'ready';
          nextIndex = 3;
          nextNote = 'Ready at pickup bar! Show PIN or QR code to barista.';
        }

        if (nextStatus !== current.status) {
          return {
            ...current,
            status: nextStatus,
            activeStepIndex: nextIndex,
            baristaNote: nextNote,
          };
        }
        return current;
      });
    }, 18000); // Progresses automatically every 18 seconds for demonstration

    return () => clearInterval(timer);
  }, [activeOrder]);

  // Fast forward button to instantly demo next stage
  const fastForwardOrder = () => {
    if (!activeOrder) return;
    setActiveOrder(current => {
      if (!current) return null;
      if (current.status === 'received') {
        return {
          ...current,
          status: 'grinding',
          activeStepIndex: 1,
          baristaNote: 'Barista is grinding specialty beans at 93°C water temperature.',
        };
      }
      if (current.status === 'grinding') {
        return {
          ...current,
          status: 'crafting',
          activeStepIndex: 2,
          baristaNote: 'Steaming textured microfoam and dusting cinnamon notes.',
        };
      }
      if (current.status === 'crafting') {
        return {
          ...current,
          status: 'ready',
          activeStepIndex: 3,
          baristaNote: 'Order is steaming hot & waiting at Express Counter 1!',
        };
      }
      if (current.status === 'ready') {
        const completedOrder: Order = {
          ...current,
          status: 'picked_up',
          activeStepIndex: 4,
          baristaNote: 'Enjoy your coffee! Have a beautiful rest of your day.',
        };
        // Add to history and reset active
        setOrderHistory(h => [completedOrder, ...h]);
        return null;
      }
      return current;
    });
  };

  const createOrder = (pickupTiming: string, notes?: string): Order => {
    const rawSubtotal = cartTotal;
    const discount = appliedReward?.discountAmount ? Math.min(appliedReward.discountAmount, rawSubtotal) : 0;
    const discountedSubtotal = Math.max(0, rawSubtotal - discount);
    const tax = Number((discountedSubtotal * 0.0825).toFixed(2));
    const total = Number((discountedSubtotal + tax).toFixed(2));

    const totalDrinkCount = cart.filter(c => !c.menuItem.isFood).reduce((s, c) => s + c.quantity, 0);
    const hasReusableCup = cart.some(c => c.customization.bringOwnCup);

    // Calculate points: 10 pts per dollar + 20 bonus for tumbler
    const pointsToAdd = Math.round(discountedSubtotal * 10) + (hasReusableCup ? 20 : 0);
    
    // Stamps: 1 stamp per drink
    const stampsToAdd = Math.max(1, totalDrinkCount);
    const newTotalStamps = stampCount + stampsToAdd;

    // Check stamp completion
    if (newTotalStamps >= maxStamps) {
      // Completed a 8-stamp card! Award complimentary reward
      setStampCount(newTotalStamps % maxStamps);
      setLoyaltyPoints(prev => prev + 100); // 100 bonus celebration points!
    } else {
      setStampCount(newTotalStamps);
    }

    setLoyaltyPoints(prev => prev + pointsToAdd);

    const randomNum = Math.floor(100 + Math.random() * 900);
    const orderNumber = `PB-${randomNum}`;
    const pin = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      roasteryId: selectedRoastery.id,
      roasteryName: selectedRoastery.name,
      roasteryAddress: selectedRoastery.address,
      items: [...cart],
      subtotal: rawSubtotal,
      discount,
      tax,
      total,
      pointsEarned: pointsToAdd,
      stampsEarned: stampsToAdd,
      status: 'received',
      createdAt: 'Just now',
      estimatedMinutes: pickupTiming === 'asap' ? 6 : 15,
      estimatedReadyTime: `${new Date(Date.now() + 6 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      pickupCounter: 'Express Bar Counter 1',
      pickupPin: pin,
      bringOwnCup: hasReusableCup,
      activeStepIndex: 0,
      baristaNote: 'Order received. Awaiting extraction queue.',
    };

    setActiveOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    setActiveTab('activity');
    return newOrder;
  };

  const cancelActiveOrder = () => {
    setActiveOrder(null);
  };

  const reorderPastOrder = (order: Order) => {
    setCart(order.items.map(item => ({
      ...item,
      id: `reord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    })));
    setIsCartOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isPhoneFrame,
        setIsPhoneFrame,
        roasteries,
        selectedRoastery,
        setSelectedRoastery,
        viewingRoasteryDetail,
        setViewingRoasteryDetail,
        menuItems,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        customizingItem,
        openCustomizer,
        closeCustomizer,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        appliedReward,
        applyReward,
        loyaltyPoints,
        stampCount,
        maxStamps,
        redeemedVouchers,
        redeemVoucher,
        activeOrder,
        orderHistory,
        createOrder,
        cancelActiveOrder,
        fastForwardOrder,
        reorderPastOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
