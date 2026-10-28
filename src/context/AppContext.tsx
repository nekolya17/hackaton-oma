import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { TabId, UserRole, Order, Toast, LoyaltyState, IncomingOrder, ServiceRequest } from '../types';
import { incomingOrders as defaultIncomingOrders } from '../data/mockData';

interface AppState {
  role: UserRole | null;
  selectRole: (role: UserRole | null) => void;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  serviceRequests: ServiceRequest[];
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'status' | 'assignedMasterId' | 'createdAt'>) => string;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
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
const requestStorageKey = 'oma-demo-requests-v1';

function readSavedRequests(): { serviceRequests: ServiceRequest[]; incomingOrders: IncomingOrder[] } {
  try {
    const raw = window.localStorage.getItem(requestStorageKey);
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved.serviceRequests) && Array.isArray(saved.incomingOrders)) {
        return {
          serviceRequests: saved.serviceRequests.map((request: ServiceRequest) => ({ ...request, createdAt: new Date(request.createdAt) })),
          incomingOrders: saved.incomingOrders,
        };
      }
    }
  } catch {
    // The demo remains usable when browser storage is unavailable.
  }
  return { serviceRequests: [], incomingOrders: defaultIncomingOrders };
}

const savedRequests = readSavedRequests();

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTabState] = useState<TabId>('customer');
  const selectRole = useCallback((nextRole: UserRole | null) => {
    setRole(nextRole);
    setActiveTabState(nextRole === 'master' ? 'master' : 'customer');
  }, []);
  const setActiveTab = useCallback((tab: TabId) => {
    setActiveTabState(role === 'master' ? 'master' : tab === 'master' ? 'customer' : tab);
  }, [role]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(savedRequests.serviceRequests);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loyaltyState] = useState<LoyaltyState>({
    totalPoints: 42,
    expiringPoints: 18,
    expiryDays: 12,
    maxDiscountPercent: 20,
  });
  const [algorithmRunning, setAlgorithmRunning] = useState(false);
  const [algorithmMatched, setAlgorithmMatched] = useState(false);
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>(savedRequests.incomingOrders);

  useEffect(() => {
    try {
      window.localStorage.setItem(requestStorageKey, JSON.stringify({ serviceRequests, incomingOrders }));
    } catch {
      // Keep the current in-memory state if browser storage is unavailable.
    }
  }, [serviceRequests, incomingOrders]);

  useEffect(() => {
    const syncRequests = (event: StorageEvent) => {
      if (event.key !== requestStorageKey) return;
      const saved = readSavedRequests();
      setServiceRequests(saved.serviceRequests);
      setIncomingOrders(saved.incomingOrders);
    };
    window.addEventListener('storage', syncRequests);
    return () => window.removeEventListener('storage', syncRequests);
  }, []);

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
      message: '✅ Заявка принята!',
      type: 'success',
    });
  }, [addToast, incomingOrders]);

  return (
    <AppContext.Provider value={{
      role, selectRole,
      activeTab, setActiveTab,
      orders, addOrder, serviceRequests, createServiceRequest,
      toasts, addToast, removeToast,
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
