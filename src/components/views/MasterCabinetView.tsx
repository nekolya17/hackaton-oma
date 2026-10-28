import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { masters } from '../../data/mockData';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { mapTiles } from '../../config/mapTiles';
import {
  Shield,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Award,
  Navigation,
  HardHat,
  MapPinned,
  Check,
  Zap,
  Home,
  Users,
  Sparkles,
  BadgePercent
} from 'lucide-react';

export default function MasterCabinetView() {
  const { barterState, settleBarter, incomingOrders, acceptOrder } = useApp();
  const master = masters[0]; // ИП Ковалёв
  const [animatingDebt, setAnimatingDebt] = useState(false);
  const [displayDebt, setDisplayDebt] = useState(barterState.debtAmount);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(incomingOrders[0]?.id ?? null);
  const [filterType, setFilterType] = useState<'all' | 'single' | 'cluster'>('all');

  const selectedOrder = incomingOrders.find(order => order.id === selectedOrderId) ?? incomingOrders[0];

  const orderIcon = (income: number, selected: boolean, accepted: boolean) => L.divIcon({
    className: 'master-order-pin-wrap',
    html: `<div class="master-order-pin ${selected ? 'selected' : ''} ${accepted ? 'accepted' : ''}"><span>${accepted ? '✓' : '+'}${income} BYN</span></div>`,
    iconSize: [106, 42],
    iconAnchor: [53, 42],
  });

  useEffect(() => {
    if (barterState.isSettled && animatingDebt) {
      const start = barterState.debtAmount;
      const end = barterState.settledDebt;
      const duration = 1500;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayDebt(start - (start - end) * eased);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [barterState.isSettled, animatingDebt, barterState.debtAmount, barterState.settledDebt]);

  const handleBarter = () => {
    setAnimatingDebt(true);
    settleBarter();
    confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
  };

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

  const acceptedCount = incomingOrders.filter(o => o.accepted).length;
  const unacceptedCount = incomingOrders.filter(o => !o.accepted).length;
  const potentialShiftIncome = incomingOrders.filter(o => o.accepted).reduce((sum, o) => sum + o.income, 0);

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

      {/* 2. Main Two-Column Layout (Matching Cart Layout) */}
      <div className="master-layout">
        {/* Left Column: Interactive Map & Available Orders */}
        <div className="master-main-column">
          {/* Map Card */}
          <section className="customer-panel" style={{ padding: '24px', overflow: 'hidden' }} aria-labelledby="master-map-title">
            <div className="customer-section-heading" style={{ marginBottom: '14px' }}>
              <div className="section-icon orange">
                <MapPinned size={22} />
              </div>
              <div>
                <p className="section-kicker">ОПТИМАЛЬНЫЙ МАРШРУТ ДОМОЙ</p>
                <h2 id="master-map-title">Заказы по дороге на карте</h2>
              </div>
              <span className="cart-count">{unacceptedCount} доступно к выбору</span>
            </div>
            <p className="cart-explanation">
              Нажмите на метку заказа на карте или выберите карточку в списке ниже для просмотра деталей и добавления в маршрут.
            </p>

            <div className="master-map-canvas" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e5e2' }}>
              <MapContainer center={[53.914, 27.607]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution={mapTiles.attribution} url={mapTiles.url} />
                <Polyline
                  positions={[master.commuteFromCoords, master.commuteToCoords]}
                  pathOptions={{ color: '#2a1b48', weight: 4, dashArray: '8, 8', opacity: 0.75 }}
                />
                {incomingOrders.map(order => (
                  <Marker
                    key={order.id}
                    position={order.coordinates}
                    icon={orderIcon(order.income, selectedOrder?.id === order.id, order.accepted)}
                    eventHandlers={{ click: () => setSelectedOrderId(order.id) }}
                  >
                    <Tooltip direction="top" offset={[0, -35]}>
                      <strong>{order.district}</strong>: {order.tasks} (+{order.income} BYN)
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
              <div className="master-map-legend">
                <span className="route-key" /> Ваш маршрут
                <span className="income-key" /> Заказ «по пути»
              </div>
            </div>
          </section>

          {/* Available Orders Card (styled exactly like the Product List in Cart) */}
          <section className="customer-panel cart-panel" aria-labelledby="master-orders-title">
            <div className="customer-section-heading">
              <div className="section-icon">
                <HardHat size={22} />
              </div>
              <div>
                <p className="section-kicker">МИНИМАЛЬНОЕ ОТКЛОНЕНИЕ ОТ ПУТИ</p>
                <h2 id="master-orders-title">Попутные заявки</h2>
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
                        <span style={{ color: '#c4bdb4' }}>•</span>
                        <span style={{ color: '#d87821', fontWeight: 700 }}>{order.deviation}</span>
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
                            <CheckCircle2 size={15} /> В маршруте
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

        {/* Right Column: Financial Barter & Performance */}
        <aside className="customer-service-column">
          {/* Barter Panel (Styled matching Loyalty & Service in Cart) */}
          <section className="customer-panel service-panel" aria-labelledby="master-barter-title">
            <div className="customer-section-heading">
              <div className="section-icon orange">
                <RefreshCw size={22} />
              </div>
              <div>
                <p className="section-kicker">ЭКОСИСТЕМА ОМА PRO</p>
                <h2 id="master-barter-title">Взаимозачёт</h2>
              </div>
            </div>

            <p className="service-note">
              Погашайте рассрочку за стройматериалы заработанными на заказах деньгами со специальным бонусом <strong>+5% от ОМА</strong>.
            </p>

            {/* Balances Display */}
            <div className="master-barter-balances">
              <div className={`barter-balance-box debt ${barterState.isSettled ? 'settled' : ''}`}>
                <span className="barter-balance-label">Долг за материалы</span>
                <span className={`barter-balance-val ${barterState.isSettled ? 'green animate-barter' : 'red'}`}>
                  {displayDebt.toFixed(2)} <small style={{ fontSize: '13px' }}>BYN</small>
                </span>
                {barterState.isSettled ? (
                  <span style={{ fontSize: '10px', color: '#16805b', fontWeight: 700 }}>
                    ✓ Погашено: {(barterState.earnedAmount * 1.05).toFixed(2)} BYN
                  </span>
                ) : (
                  <span style={{ fontSize: '10px', color: '#888' }}>
                    Отсрочка платежа ОМА
                  </span>
                )}
              </div>

              <div className="barter-balance-box earned">
                <span className="barter-balance-label">Заработано «по пути»</span>
                <span className="barter-balance-val amber">
                  {barterState.earnedAmount.toFixed(2)} <small style={{ fontSize: '13px' }}>BYN</small>
                </span>
                <span style={{ fontSize: '10px', color: '#a26226', fontWeight: 700 }}>
                  +5% бонус при зачёте
                </span>
              </div>
            </div>

            {/* Settle Action Button */}
            <button
              type="button"
              onClick={handleBarter}
              disabled={barterState.isSettled}
              className={`master-barter-action-btn ${barterState.isSettled ? 'settled' : ''}`}
            >
              {barterState.isSettled ? (
                <>
                  <Check size={18} />
                  <span>Взаимозачёт успешно выполнен</span>
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  <span>Погасить долг (+5% бонус ОМА)</span>
                </>
              )}
            </button>

            {/* Barter details breakdown */}
            {barterState.isSettled ? (
              <div className="master-barter-breakdown animate-[fadeIn_0.4s_ease-out]">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Сумма заработка:</span>
                  <strong>{barterState.earnedAmount.toFixed(2)} BYN</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16805b' }}>
                  <span>Бонус от ОМА (+5%):</span>
                  <strong>+{(barterState.earnedAmount * 0.05).toFixed(2)} BYN</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #d2edd9', paddingTop: '5px', marginTop: '3px' }}>
                  <span>Итого списано с долга:</span>
                  <strong style={{ color: '#16805b' }}>{(barterState.earnedAmount * 1.05).toFixed(2)} BYN</strong>
                </div>
                <div style={{ background: '#e4f5eb', padding: '6px 8px', borderRadius: '6px', marginTop: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#16805b' }}>
                  💰 100% средств остаются в экосистеме ОМА!
                </div>
              </div>
            ) : (
              <div className="delivery-note" style={{ marginTop: '14px' }}>
                <BadgePercent size={18} />
                <span>Мастер экономит {((barterState.earnedAmount * 0.05)).toFixed(2)} BYN благодаря программе партнёрского взаимозачёта.</span>
              </div>
            )}
          </section>

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
                <strong>0.4 км</strong>
                <small>среднее отклонение</small>
              </div>
              <div className="master-stat-card">
                <strong style={{ color: '#d87821' }}>15 мин</strong>
                <small>среднее время в пути</small>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* 3. Bottom Summary / Checkout-style Panel (Matching Cart's .checkout-panel) */}
      <section className="checkout-panel" style={{ marginTop: '20px' }} aria-labelledby="master-shift-title">
        <div className="checkout-main">
          <div className="checkout-summary">
            <h2 id="master-shift-title">Итоги вечернего маршрута</h2>
            <div className="checkout-lines">
              <span>Выезд: <b>{master.departureTime} ({master.commuteFrom} → {master.commuteTo})</b></span>
              <span>Принято заявок: <b>{acceptedCount} из {incomingOrders.length}</b></span>
              {potentialShiftIncome > 0 && (
                <span className="discount-line">
                  Доход за маршрут: <b>+{potentialShiftIncome}.00 BYN</b>
                </span>
              )}
            </div>
          </div>

          <div className="checkout-action">
            <div className="checkout-total">
              <span>Доход за сегодня</span>
              <strong>+{potentialShiftIncome > 0 ? potentialShiftIncome : 0}.00 <small>BYN</small></strong>
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={() => {
                confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
              }}
            >
              <span>{acceptedCount > 0 ? 'Маршрут готов' : 'Начать маршрут'}</span>
              <Navigation size={18} />
            </button>
          </div>
        </div>

        <div className="checkout-bonus">
          <div className="checkout-bonus-info">
            <Award size={22} />
            <div>
              <strong>ОМА PRO · ЗОЛОТОЙ ПАРТНЁР</strong>
              <span>Скидка 12% на покупку стройматериалов и инструментов во всех гипермаркетах ОМА</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8f5c22', fontSize: '12px', fontWeight: 700 }}>
            <Zap size={16} /> Приоритетный показ попутных заявок
          </div>
        </div>
      </section>
    </div>
  );
}
