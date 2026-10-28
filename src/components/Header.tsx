import { useApp } from '../context/AppContext';
import { Wrench, MapPin, Phone, ArrowUpRight, UsersRound } from 'lucide-react';

export default function Header() {
  const { role, selectRole, setActiveTab, serviceRequests } = useApp();

  return (
    <header className="site-header">
      <div className="header-promo">ОМА МАСТЕРА <span>—</span> сервис, который всегда рядом <ArrowUpRight size={17} /></div>
      <div className="header-utility">
        <div className="header-container utility-inner">
          <span><MapPin size={14} /> Ваш регион: <strong>Минск</strong></span>
          <div className="utility-right"><span><Phone size={14} /> 536-45-00</span><span>Экосистема ОМА</span><span>Помощь и сервис</span></div>
        </div>
      </div>
      <div className="header-main">
        <div className="header-container header-main-inner">
          <button className="oma-brand" onClick={() => setActiveTab(role === 'master' ? 'master' : 'customer')} aria-label="ОМА Мастера — главная">
            <img src="/oma-logo.png" alt="ОМА" className="oma-logo-img" />
            <span className="brand-divider" aria-hidden="true" />
            <span className="brand-copy"><strong>МАСТЕРА</strong><small>СЕРВИС ДЛЯ ДОМА</small></span>
          </button>
          <div className="header-actions">
            {role === 'customer' && serviceRequests.length > 0 && <span className="live-orders"><span /> {serviceRequests.length} {serviceRequests.length === 1 ? 'заявка' : serviceRequests.length < 5 ? 'заявки' : 'заявок'}</span>}
            {role === 'customer' && <button className="simulate-button" onClick={() => setActiveTab('service')}><Wrench size={17} /><span>Вызвать мастера</span></button>}
            <button className="role-switch-button" type="button" onClick={() => selectRole(null)} aria-label="Сменить роль"><UsersRound size={17} /><span>Сменить роль</span></button>
          </div>
        </div>
      </div>
    </header>
  );
}
