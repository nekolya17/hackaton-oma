import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { TabId, Order, Toast, BarterState, LoyaltyState, IncomingOrder } from '../types';
import { products, timeSlots, incomingOrders as defaultIncomingOrders } from '../data/mockData';

interface AppState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  simulateNewOrder: () => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  barterState: BarterState;
  settleBarter: () => void;
  loyaltyState: LoyaltyState;
  algorithmRunning: boolean;
  algorithmMatched: boolean;
  runAlgorithm: () => void;
  incomingOrders: IncomingOrder[];
  acceptOrder: (id: string) => void;
  showConfirmationModal: boolean;
  setShowConfirmationModal: (show: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

let orderCounter = 0;
let toastCounter = 0;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('customer');
  const [orders, setOrders] = useState<Order[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [barterState, setBarterState] = useState<BarterState>({
    debtAmount: 480.00,
    earnedAmount: 310.00,
    isSettled: false,
    settledDebt: 480.00,
    bonusPercent: 5,
  });
  const [loyaltyState] = useState<LoyaltyState>({
    totalPoints: 42,
    expiringPoints: 18,
    expiryDays: 12,
    maxDiscountPercent: 20,
  });
  const [algorithmRunning, setAlgorithmRunning] = useState(false);
  const [algorithmMatched, setAlgorithmMatched] = useState(false);
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>(defaultIncomingOrders);

  const toastTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    const timeout = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 4000);
    toastTimeouts.current.set(id, timeout);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const timeout = toastTimeouts.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      toastTimeouts.current.delete(id);
    }
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
  }, []);

  const simulateNewOrder = useCallback(() => {
    const product = products[Math.floor(Math.random() * products.length)];
    const slot = timeSlots[0];
    const newOrder: Order = {
      id: `order-sim-${++orderCounter}`,
      product,
      slot,
      address: 'ЖК «Минск-Мир», ул. Братская, 14, кв. ' + (Math.floor(Math.random() * 120) + 1),
      district: 'Минск-Мир',
      coordinates: [53.8720 + (Math.random() - 0.5) * 0.008, 27.5500 + (Math.random() - 0.5) * 0.01],
      status: 'pending',
      useBonus: false,
      bonusDiscount: 0,
      totalPrice: product.price + slot.price + product.consumablesPrice,
      createdAt: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
    addToast({
      message: `🆕 Новая заявка в Минск-Мире: ${product.name} — ${slot.price} BYN за установку`,
      type: 'info',
      duration: 5000,
    });
  }, [addToast]);

  const settleBarter = useCallback(() => {
    setBarterState(prev => {
      const credit = prev.earnedAmount * (1 + prev.bonusPercent / 100);
      const newDebt = Math.max(0, prev.debtAmount - credit);
      return { ...prev, isSettled: true, settledDebt: newDebt };
    });
    addToast({
      message: '✅ Взаимозачёт выполнен! 100% денег остаются внутри экосистемы ОМА!',
      type: 'success',
      duration: 6000,
    });
  }, [addToast]);

  const runAlgorithm = useCallback(() => {
    setAlgorithmRunning(true);
    setAlgorithmMatched(false);
    setTimeout(() => {
      setAlgorithmRunning(false);
      setAlgorithmMatched(true);
      addToast({
        message: '🧠 Гео-алгоритм нашёл оптимальный попутный маршрут! Холостой пробег: 0.4 км вместо 14 км',
        type: 'success',
        duration: 6000,
      });
    }, 2500);
  }, [addToast]);

  const acceptOrder = useCallback((id: string) => {
    setIncomingOrders(prev => prev.map(o => o.id === id ? { ...o, accepted: true } : o));
    addToast({
      message: '✅ Заказ принят в маршрут! Пакет расходников уже ждёт в ОМА КСТАТИ.',
      type: 'success',
    });
  }, [addToast]);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      orders, addOrder, simulateNewOrder,
      toasts, addToast, removeToast,
      barterState, settleBarter,
      loyaltyState,
      algorithmRunning, algorithmMatched, runAlgorithm,
      incomingOrders, acceptOrder,
      showConfirmationModal, setShowConfirmationModal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
