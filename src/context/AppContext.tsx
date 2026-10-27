import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { TabId, Order, Toast, BarterState, LoyaltyState, IncomingOrder, ServiceRequest } from '../types';
import { incomingOrders as defaultIncomingOrders } from '../data/mockData';

interface AppState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  serviceRequests: ServiceRequest[];
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'status' | 'assignedMasterId' | 'createdAt'>) => string;
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
}

const AppContext = createContext<AppState | undefined>(undefined);

let orderCounter = 0;
let toastCounter = 0;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>('customer');
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
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

  const createServiceRequest = useCallback((input: Omit<ServiceRequest, 'id' | 'status' | 'assignedMasterId' | 'createdAt'>) => {
    const id = `service-${Date.now()}-${++orderCounter}`;
    const request: ServiceRequest = { ...input, id, status: 'pending', createdAt: new Date() };
    setServiceRequests(prev => [request, ...prev]);
    setIncomingOrders(prev => [{
      id: `incoming-${id}`,
      type: 'single',
      district: input.district,
      address: input.address,
      deviation: input.source === 'cart' ? 'Время визита связано с доставкой товара' : 'Прямой вызов мастера',
      tasks: input.description,
      duration: input.arrivalWindow,
      income: Math.round(input.estimatedPrice * 0.8),
      accepted: false,
      coordinates: input.coordinates,
      serviceRequestId: id,
    }, ...prev]);
    addToast({ message: 'Заявка отправлена. Покажем мастера, когда он примет заказ.', type: 'success' });
    return id;
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
    const requestId = incomingOrders.find(order => order.id === id)?.serviceRequestId;
    setIncomingOrders(prev => prev.map(o => o.id === id ? { ...o, accepted: true } : o));
    if (requestId) {
      setServiceRequests(prev => prev.map(request => request.id === requestId ? { ...request, status: 'assigned', assignedMasterId: 'master-1' } : request));
      setOrders(prev => prev.map(order => order.serviceRequestId === requestId ? { ...order, status: 'assigned', assignedMasterId: 'master-1' } : order));
    }
    addToast({
      message: '✅ Заказ принят в маршрут!',
      type: 'success',
    });
  }, [addToast, incomingOrders]);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      orders, addOrder, serviceRequests, createServiceRequest,
      toasts, addToast, removeToast,
      barterState, settleBarter,
      loyaltyState,
      algorithmRunning, algorithmMatched, runAlgorithm,
      incomingOrders, acceptOrder,
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
