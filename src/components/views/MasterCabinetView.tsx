import { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { masters } from '../../data/mockData';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { mapTiles } from '../../config/mapTiles';
import {
  Shield,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  HardHat,
  MapPinned,
  Home,
  Users,
} from 'lucide-react';

export default function MasterCabinetView() {
  const { incomingOrders, acceptOrder } = useApp();
  const master = masters[0]; // ИП Ковалёв
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(incomingOrders[0]?.id ?? null);
  const [filterType, setFilterType] = useState<'all' | 'single' | 'cluster'>('all');

  const selectedOrder = incomingOrders.find(order => order.id === selectedOrderId) ?? incomingOrders[0];

  const orderIcon = (income: number, selected: boolean, accepted: boolean) => L.divIcon({
    className: 'master-order-pin-wrap',
    html: `<div class="master-order-pin ${selected ? 'selected' : ''} ${accepted ? 'accepted' : ''}"><span>${accepted ? '✓' : '+'}${income} BYN</span></div>`,
    iconSize: [106, 42],
    iconAnchor: [53, 42],
  });

  const handleAcceptOrder = (orderId: string) => {
    acceptOrder(orderId);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const weeklyEarnings = [
    { day: 'Пн', amount: 70 },
    { day: 'Вт', amount: 45 },
    { day: 'Ср', amount: 85 },
    { day: 'Чт', amount: 55 },
    { day: 'Пт', amount: 55 },
  ];
  const weeklyTotal = weeklyEarnings.reduce((s, d) => s + d.amount, 0);

  const filteredOrders = incomingOrders.filter(order => {
    if (filterType === 'single') return order.type === 'single';
    if (filterType === 'cluster') return order.type === 'cluster';
    return true;
  });

  const unacceptedCount = incomingOrders.filter(o => !o.accepted).length;

  return (
    <div className="view-content master-content">
      {/* 1. Master Profile Banner */}
      <section className="master-profile-panel" aria-label="Профиль мастера ОМА PRO">
        <div className="master-profile-user">
          <div className="master-avatar-box" aria-hidden="true">
            {master.avatar}
          </div>
          <div className="master-profile-info">
            <h2>{master.name}</h2>
            <div className="master-badges">
              <span className="badge-pill verified">
                <Shield size={13} /> Верифицирован в ОМА PRO
              </span>
              <span className="badge-pill unp">УНП {master.unp}</span>
              <span className="badge-pill rating">
                <Star size={13} fill="#f5aa45" stroke="#f5aa45" /> {master.rating} (48 отзывов)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Map and listings above the earnings summary */}
      <div className="master-layout">
        {/* Interactive Map & Available Orders */}
        <div className="master-main-column">
          {/* Map Card */}
          <section className="customer-panel" style={{ padding: '24px', overflow: 'hidden' }} aria-labelledby="master-map-title">
            <div className="customer-section-heading" style={{ marginBottom: '14px' }}>
              <div className="section-icon orange">
                <MapPinned size={22} />
              </div>
              <div>
                <p className="section-kicker">ЗАЯВКИ МАСТЕРУ</p>
                <h2 id="master-map-title">Объявления на карте</h2>
              </div>
              <span className="cart-count">{unacceptedCount} доступно к выбору</span>
            </div>
            <p className="cart-explanation">
              Нажмите на метку на карте или выберите карточку ниже, чтобы посмотреть подробности заявки.
            </p>

            <div className="master-map-canvas" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e5e2' }}>
              <MapContainer center={[53.914, 27.607]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution={mapTiles.attribution} url={mapTiles.url} />
                {incomingOrders.map(order => (
                  <Marker
                    key={order.id}
                    position={order.coordinates}
                    icon={orderIcon(order.income, selectedOrder?.id === order.id, order.accepted)}
                    eventHandlers={{ click: () => { setFilterType('all'); setSelectedOrderId(order.id); } }}
                  >
                    <Tooltip direction="top" offset={[0, -35]}>
                      <strong>{order.district}</strong>: {order.tasks} (+{order.income} BYN)
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </section>

          {/* Available Orders Card (styled exactly like the Product List in Cart) */}
          <section className="customer-panel cart-panel" aria-labelledby="master-orders-title">
            <div className="customer-section-heading">
              <div className="section-icon">
                <HardHat size={22} />
              </div>
              <div>
                <p className="section-kicker">ПОДРОБНОСТИ С КАРТЫ</p>
                <h2 id="master-orders-title">Объявления</h2>
              </div>
              <span className="cart-count">{incomingOrders.length} заявки</span>
            </div>

            {/* Filter Tabs */}
            <div className="master-order-tabs" style={{ marginBottom: '16px' }} role="tablist" aria-label="Фильтр заявок">
              <button
                type="button"
                className={filterType === 'all' ? 'active' : ''}
                onClick={() => setFilterType('all')}
              >
                Все заявки <strong>({incomingOrders.length})</strong>
              </button>
              <button
                type="button"
                className={filterType === 'single' ? 'active' : ''}
                onClick={() => setFilterType('single')}
              >
                <Home size={14} /> Одиночные <strong>({incomingOrders.filter(o => o.type === 'single').length})</strong>
              </button>
              <button
                type="button"
                className={filterType === 'cluster' ? 'active' : ''}
                onClick={() => setFilterType('cluster')}
              >
                <Users size={14} /> Кластер соседей <strong>({incomingOrders.filter(o => o.type === 'cluster').length})</strong>
              </button>
            </div>

            <div className="product-list">
              {filteredOrders.map(order => {
                const isSelected = selectedOrder?.id === order.id;
                const isAccepted = order.accepted;

                return (
                  <div
                    key={order.id}
                    className={`master-order-row ${isSelected ? 'selected' : ''} ${isAccepted ? 'accepted' : ''}`}
                    onClick={() => setSelectedOrderId(order.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Заказ: ${order.tasks}, доход +${order.income} BYN`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedOrderId(order.id); } }}
                  >
                    <div className="master-order-badge-icon" aria-hidden="true">
                      {order.type === 'single' ? '🏠' : '🏘️'}
                    </div>

                    <div className="master-order-info">
                      <div className="master-order-type">
                        <span>{order.type === 'single' ? 'Одиночный вызов' : 'Кластер соседей (2+ квартиры)'}</span>
                      </div>

                      <strong>{order.tasks}</strong>

                      <div className="master-order-meta">
                        <span>
                          <MapPin size={13} style={{ color: '#d97d28' }} /> {order.address} ({order.district})
                        </span>
                        <span>
                          <Clock size={13} style={{ color: '#79717d' }} /> {order.duration}
                        </span>
                      </div>

                      {order.clusterDetails && (
                        <div style={{ marginTop: '4px', fontSize: '11px', color: '#2a1b48', background: '#f5f0fb', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>
                          📋 {order.clusterDetails}
                        </div>
                      )}
                    </div>

                    <div className="master-order-price">
                      <strong>+{order.income}.00 <span style={{ fontSize: '13px' }}>BYN</span></strong>
                      <small>чистый доход</small>

                      <div style={{ marginTop: '8px' }}>
                        {isAccepted ? (
                          <span className="master-accepted-chip">
                            <CheckCircle2 size={15} /> Принята
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="master-accept-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptOrder(order.id);
                            }}
                          >
                            <span>Принять</span> <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Performance summary below the map and listings */}
        <aside className="customer-service-column">
          {/* Weekly Performance Panel */}
          <section className="customer-panel loyalty-panel" aria-labelledby="master-earnings-title">
            <div className="customer-section-heading" style={{ marginBottom: '10px' }}>
              <div className="section-icon">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="section-kicker">АКТИВНОСТЬ ЗА НЕДЕЛЮ</p>
                <h2 id="master-earnings-title">Доход мастера</h2>
              </div>
              <span className="cart-count" style={{ color: '#16805b' }}>+{weeklyTotal} BYN</span>
            </div>

            {/* Animated Bar Chart */}
            <div className="master-chart-wrap" aria-label="График заработка по дням недели">
              {weeklyEarnings.map((d, i) => (
                <div key={i} className="master-chart-col">
                  <span className="master-chart-val">{d.amount}</span>
                  <div
                    className="master-chart-bar"
                    style={{ height: `${(d.amount / 100) * 65}px` }}
                  />
                  <span className="master-chart-day">{d.day}</span>
                </div>
              ))}
            </div>

            {/* Performance Stats 2x2 Grid */}
            <div className="master-stats-grid">
              <div className="master-stat-card">
                <strong>47</strong>
                <small>заказов по пути</small>
              </div>
              <div className="master-stat-card">
                <strong style={{ color: '#16805b' }}>98%</strong>
                <small>клиентов довольны</small>
              </div>
              <div className="master-stat-card">
                <strong>{incomingOrders.length}</strong>
                <small>объявления на карте</small>
              </div>
              <div className="master-stat-card">
                <strong style={{ color: '#d87821' }}>15 мин</strong>
                <small>среднее время в пути</small>
              </div>
            </div>
          </section>
        </aside>
      </div>

    </div>
  );
}
