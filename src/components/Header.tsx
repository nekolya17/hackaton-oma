import { useApp } from '../context/AppContext';
import { TabId } from '../types';
import { ShoppingCart, Map, Wrench, BarChart3, Zap } from 'lucide-react';

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'customer', label: '🛒 1. Глазами Покупателя (B2C)', icon: <ShoppingCart size={16} /> },
  { id: 'dispatcher', label: '🗺️ 2. Гео-Диспетчер H3 (Live Карта)', icon: <Map size={16} /> },
  { id: 'master', label: '👷 3. Кабинет Мастера (ОМА PRO)', icon: <Wrench size={16} /> },
  { id: 'economics', label: '📊 4. Юнит-экономика и CJM', icon: <BarChart3 size={16} /> },
];

export default function Header() {
  const { activeTab, setActiveTab, simulateNewOrder, orders } = useApp();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[#E8ECFF] shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 py-3">
        {/* Top row: Logo + Simulate button */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2B0B73] to-[#3B108C] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#2B0B73]/20">
              О
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                <span className="text-[#2B0B73]">ОМА</span>{' '}
                <span className="text-[#00B4D8]">ПО ПУТИ</span>
              </h1>
              <p className="text-[10px] text-gray-500 leading-tight -mt-0.5">
                Экосистема попутного бытового сервиса (ОМА + ОМА КСТАТИ + ОМА PRO)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {orders.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#00B4D8]/10 text-[#00A8C6] rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#00B4D8] animate-pulse" />
                {orders.length} {orders.length === 1 ? 'заявка' : orders.length < 5 ? 'заявки' : 'заявок'} Live
              </div>
            )}
            <button
              onClick={simulateNewOrder}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2B0B73] to-[#3B108C] text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2B0B73]/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Zap size={14} className="text-[#FACC15]" />
              <span className="hidden sm:inline">⚡ Симулировать новую заявку в Минск-Мире</span>
              <span className="sm:hidden">⚡ Симуляция</span>
            </button>
          </div>
        </div>

        {/* Tab row */}
        <nav className="flex gap-1 overflow-x-auto pb-0.5 -mx-1 px-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#2B0B73] to-[#3B108C] text-white shadow-lg shadow-[#2B0B73]/20'
                  : 'text-gray-600 hover:bg-[#E8ECFF] hover:text-[#2B0B73]'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
