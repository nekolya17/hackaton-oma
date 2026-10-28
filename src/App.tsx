import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import ToastContainer from './components/Toast';
import CustomerView from './components/views/CustomerView';
import ServiceView from './components/views/ServiceView';
import MasterCabinetView from './components/views/MasterCabinetView';

function AppContent() {
  const { activeTab } = useApp();

  const pages: Record<string, { eyebrow: string; title: string; description: string; number: string; detail: string }> = {
    customer: { eyebrow: 'КОРЗИНА ОМА', title: 'Товары и установка в одном заказе.', description: 'Отметьте товары для установки. Визит мастера подстроится под время доставки, а его карточка появится после принятия заявки.', number: '01', detail: 'Покупка + заявка' },
    service: { eyebrow: 'ВЫЗОВ МАСТЕРА', title: 'Опишите задачу. Мастер откликнется.', description: 'Выберите работу из списка или расскажите, что нужно сделать. Подходящий мастер примет заявку и появится в её карточке.', number: '02', detail: 'Прямой вызов' },
    master: { eyebrow: 'ОМА PRO', title: 'Заказы, которые по дороге.', description: 'Личный кабинет мастера: ближайшие заявки, доход за заказ и взаимозачёт внутри экосистемы.', number: '03', detail: 'Рабочее пространство' },
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
            <p className="intro-description">{page.description}</p>
          </div>
          <div className="intro-side" aria-hidden="true"><span className="intro-orbit orbit-one" /><span className="intro-orbit orbit-two" /><span className="intro-number">{page.number}</span><span className="intro-detail">{page.detail}</span></div>
        </section>
        {activeTab === 'customer' && <CustomerView />}
        {activeTab === 'service' && <ServiceView />}
        {activeTab === 'master' && <MasterCabinetView />}
      </main>
      <footer className="site-footer"><div><strong>ОМА <span>ПО ПУТИ</span></strong><p>Всё для дома. Сервис рядом.</p></div><span>Пилотный проект • Минск • 2026</span></footer>
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
