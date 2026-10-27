import { useApp } from '../context/AppContext';
import { TabId } from '../types';
import { ShoppingCart, MapPinned, HardHat, ChartNoAxesCombined, Zap, MapPin, Phone, ArrowUpRight, Menu } from 'lucide-react';

const tabs: { id: TabId; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'customer', label: 'Покупателю', shortLabel: 'Покупка', icon: <ShoppingCart size={18} /> },
  { id: 'dispatcher', label: 'Гео-диспетчер', shortLabel: 'Карта', icon: <MapPinned size={18} /> },
  { id: 'master', label: 'Кабинет мастера', shortLabel: 'Мастер', icon: <HardHat size={18} /> },
  { id: 'economics', label: 'Экономика проекта', shortLabel: 'Экономика', icon: <ChartNoAxesCombined size={18} /> },
];

export default function Header() {
  const { activeTab, setActiveTab, simulateNewOrder, orders } = useApp();

  return (
    <header className="site-header">
      <div className="header-promo">ОМА ПО ПУТИ <span>—</span> сервис, который всегда рядом <ArrowUpRight size={17} /></div>
      <div className="header-utility">
        <div className="header-container utility-inner">
          <span><MapPin size={14} /> Ваш регион: <strong>Минск</strong></span>
          <div className="utility-right"><span><Phone size={14} /> 536-45-00</span><span>Экосистема ОМА</span><span>Помощь и сервис</span></div>
        </div>
      </div>
      <div className="header-main">
        <div className="header-container header-main-inner">
          <button className="oma-brand" onClick={() => setActiveTab('customer')} aria-label="ОМА ПО ПУТИ — главная">
            <span className="oma-mark" aria-hidden="true"><i /><i /><i /></span>
            <span className="brand-copy"><strong>ОМА</strong><small>ПО ПУТИ</small></span>
          </button>
          <div className="header-message"><span className="header-message-dot" /> Платформа попутного бытового сервиса <strong>для дома и ремонта</strong></div>
          <div className="header-actions">
            {orders.length > 0 && <span className="live-orders"><span /> {orders.length} {orders.length === 1 ? 'заявка' : orders.length < 5 ? 'заявки' : 'заявок'}</span>}
            <button className="simulate-button" onClick={simulateNewOrder}><Zap size={17} fill="currentColor" /><span>Новая заявка</span><span className="simulate-long"> в Минск-Мире</span></button>
          </div>
        </div>
      </div>
      <div className="nav-wrap">
        <nav className="header-container primary-nav" aria-label="Разделы приложения">
          <span className="nav-catalog"><Menu size={20} /> ВСЕ СЕРВИСЫ</span>
          <div className="nav-tabs">
            {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'nav-tab active' : 'nav-tab'} aria-current={activeTab === tab.id ? 'page' : undefined}>
              {tab.icon}<span className="tab-full">{tab.label}</span><span className="tab-short">{tab.shortLabel}</span>
            </button>)}
          </div>
        </nav>
      </div>
    </header>
  );
}
