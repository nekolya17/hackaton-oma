import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import ToastContainer from './components/Toast';
import CustomerView from './components/views/CustomerView';
import ServiceView from './components/views/ServiceView';
import MasterCabinetView from './components/views/MasterCabinetView';
import RoleSelect from './components/RoleSelect';

function AppContent() {
  const { activeTab, role } = useApp();

  if (!role) return <RoleSelect />;

  const pages: Record<string, { eyebrow: string; title: string }> = {
    customer: { eyebrow: 'КОРЗИНА ОМА', title: 'Товары и установка в одном заказе.' },
    service: { eyebrow: 'ВЫЗОВ МАСТЕРА', title: 'Опишите задачу. Мастер откликнется.' },
    master: { eyebrow: 'ОМА PRO', title: 'Заказы, которые по дороге.' },
  };

  const page = pages[activeTab] || pages.customer;

  return (
    <div className="app-shell">
      <Header />
      <ToastContainer />
      <main className={`workspace workspace-${activeTab}`}>
        <section className="page-intro" aria-labelledby="page-title">
          <div className="page-intro-copy">
            <p className="eyebrow"><span /> {page.eyebrow}</p>
            <h1 id="page-title">{page.title}</h1>
          </div>
        </section>
        {activeTab === 'customer' && <CustomerView />}
        {activeTab === 'service' && <ServiceView />}
        {activeTab === 'master' && <MasterCabinetView />}
      </main>
      <footer className="site-footer">
        <div>
          <div className="footer-brand">
            <img src="/oma-logo.png" alt="ОМА" className="footer-logo-img" />
            <span className="footer-brand-divider" aria-hidden="true" />
            <strong>МАСТЕРА</strong>
          </div>
          <p>Всё для дома. Сервис рядом.</p>
        </div>
        <span>Пилотный проект • Минск • 2026</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
