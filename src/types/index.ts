export type TabId = 'customer' | 'dispatcher' | 'master' | 'economics';

export interface Consumable {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  installationPrice: number;
  marketPrice: number;
  consumables: string;
  consumablesPrice: number;
  consumablesOptions: Consumable[];
  category: string;
  icon: string;
  imageUrl?: string;
}

export interface TimeSlot {
  id: 'commute' | 'cluster';
  label: string;
  description: string;
  price: number;
  discount?: number;
  clusterProgress?: { current: number; total: number };
}

export interface Order {
  id: string;
  product: Product;
  purchasedProducts?: Product[];
  items?: { product: Product; installationPrice: number; consumables: Consumable[] }[];
  slot: TimeSlot;
  address: string;
  district: string;
  coordinates: [number, number];
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  assignedMasterId?: string;
  useBonus: boolean;
  bonusDiscount: number;
  totalPrice: number;
  createdAt: Date;
}

export interface Master {
  id: string;
  name: string;
  unp: string;
  specialization: string;
  rating: number;
  purchaseStats: string;
  competenceLevel: string;
  commuteFrom: string;
  commuteFromCoords: [number, number];
  commuteTo: string;
  commuteToCoords: [number, number];
  departureTime: string;
  currentCoords: [number, number];
  avatar: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  type: 'hypermarket' | 'kstati';
  address: string;
  coordinates: [number, number];
}

export interface HexCell {
  id: string;
  district: string;
  coordinates: [number, number][];
  orderCount: number;
  density: 'low' | 'medium' | 'high';
}

export interface AlgorithmMetrics {
  idleKm: number;
  idleKmSaved: number;
  clientSaving: number;
  stmUpsell: number;
  pitstopTime: number;
}

export interface BarterState {
  debtAmount: number;
  earnedAmount: number;
  isSettled: boolean;
  settledDebt: number;
  bonusPercent: number;
}

export interface LoyaltyState {
  totalPoints: number;
  expiringPoints: number;
  expiryDays: number;
  maxDiscountPercent: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
}

export interface IncomingOrder {
  id: string;
  type: 'single' | 'cluster';
  district: string;
  address: string;
  deviation: string;
  tasks: string;
  duration: string;
  consumablesPickup: string;
  income: number;
  clusterDetails?: string;
  accepted: boolean;
}
