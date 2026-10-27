import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import ToastContainer from './components/Toast';
import CustomerView from './components/views/CustomerView';
import DispatcherMapView from './components/views/DispatcherMapView';
import MasterCabinetView from './components/views/MasterCabinetView';
import UnitEconomicsView from './components/views/UnitEconomicsView';

function AppContent() {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen">
      <Header />
      <ToastContainer />
      <main className="pb-8">
        {activeTab === 'customer' && <CustomerView />}
        {activeTab === 'dispatcher' && <DispatcherMapView />}
        {activeTab === 'master' && <MasterCabinetView />}
        {activeTab === 'economics' && <UnitEconomicsView />}
      </main>
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
