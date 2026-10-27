import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { products, timeSlots } from '../../data/mockData';
import { Product, TimeSlot } from '../../types';
import { ShoppingBag, Clock3, Users, CreditCard, CheckCircle2, ArrowRight, ShieldCheck, X, PackageCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

function ProductImage({ product }: { product: Product }) {
  return <span className="product-image" aria-hidden="true">{product.imageUrl ? <img src={product.imageUrl} alt="" loading="lazy" /> : <span className="product-image-placeholder">{product.icon}</span>}</span>;
}

export default function CustomerView() {
  const { addOrder, loyaltyState, setActiveTab, showConfirmationModal, setShowConfirmationModal } = useApp();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([products[0].id]);
  const [selectedConsumableIds, setSelectedConsumableIds] = useState<Record<string, string[]>>({});
  const [installationEnabled, setInstallationEnabled] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>(timeSlots[0]);
  const [useBonus, setUseBonus] = useState(false);

  const selectedProducts = products.filter(product => selectedProductIds.includes(product.id));
  const productPrice = products.reduce((sum, product) => sum + product.price, 0);
  const installationForSlot = (slot: TimeSlot) => Math.round(selectedProducts.reduce((sum, product) => sum + Math.round(product.installationPrice * (slot.price / timeSlots[0].price) * 100) / 100, 0) * 100) / 100;
  const installPrice = installationForSlot(selectedSlot);
  const selectedConsumables = selectedProducts.flatMap(product => product.consumablesOptions.filter(item => selectedConsumableIds[product.id]?.includes(item.id)));
  const consumablesPrice = selectedConsumables.reduce((sum, item) => sum + item.price, 0);
  const availableBonusDiscount = Math.min(7, installPrice * (loyaltyState.maxDiscountPercent / 100));
  const bonusDiscount = installationEnabled && useBonus ? availableBonusDiscount : 0;
  const totalPrice = Math.round((productPrice + (installationEnabled ? installPrice + consumablesPrice - bonusDiscount : 0)) * 100) / 100;
  const marketPrice = selectedProducts.reduce((sum, product) => sum + product.marketPrice, 0);
  const savingsPercent = marketPrice ? Math.round(((marketPrice - installPrice) / marketPrice) * 100) : 0;

  const toggleProduct = (id: string) => {
    setSelectedProductIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    if (!installationEnabled) setInstallationEnabled(true);
  };

  const toggleInstallation = () => {
    if (installationEnabled) {
      setSelectedProductIds([]);
      setUseBonus(false);
    }
    setInstallationEnabled(!installationEnabled);
  };

  const toggleConsumable = (productId: string, consumableId: string) => {
    setSelectedConsumableIds(current => {
      const selected = current[productId] ?? [];
      return { ...current, [productId]: selected.includes(consumableId) ? selected.filter(id => id !== consumableId) : [...selected, consumableId] };
    });
  };

  const handleCheckout = () => {
    addOrder({
      id: `order-${Date.now()}`,
      product: products[0],
      purchasedProducts: products,
      items: installationEnabled ? selectedProducts.map(product => ({
        product,
        installationPrice: Math.round(product.installationPrice * (selectedSlot.price / timeSlots[0].price) * 100) / 100,
        consumables: product.consumablesOptions.filter(item => selectedConsumableIds[product.id]?.includes(item.id)),
      })) : [],
      slot: selectedSlot,
      address: 'ЖК «Новая Боровая», ул. Авиационная, 22, кв. 74',
      district: 'Новая Боровая',
      coordinates: [53.9540, 27.6700],
      status: installationEnabled && selectedProducts.length > 0 ? 'assigned' : 'pending',
      assignedMasterId: installationEnabled && selectedProducts.length > 0 ? 'master-1' : undefined,
      useBonus: installationEnabled && selectedProducts.length > 0 && useBonus,
      bonusDiscount,
      totalPrice,
      createdAt: new Date(),
    });
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setShowConfirmationModal(true);
  };

  return (
    <div className="view-content customer-content">
      <div className="customer-layout">
        <section className="customer-panel cart-panel" aria-labelledby="cart-title">
          <div className="customer-section-heading"><div className="section-icon"><ShoppingBag size={22} /></div><h2 id="cart-title">Корзина</h2><span className="cart-count">{products.length} товара</span></div>
          <p className="cart-explanation">Все товары входят в покупку. Отметьте те, которые установит мастер.</p>
          <div className="product-list">
            {products.map(product => {
              const selected = selectedProductIds.includes(product.id);
              const productConsumables = selectedConsumableIds[product.id] ?? [];
              return <div key={product.id} className={`product-entry ${selected ? 'selected' : ''}`}>
                <button type="button" role="checkbox" aria-checked={selected} aria-label={`${selected ? 'Убрать установку' : 'Добавить установку'}: ${product.name}`} onClick={() => toggleProduct(product.id)} className={`product-row ${selected ? 'selected' : ''}`}>
                  <ProductImage product={product} />
                  <span className="product-info"><span className="product-category">{product.category}</span><strong>{product.name}</strong></span>
                  <span className="product-price"><strong>{product.price.toFixed(2)}</strong><small>BYN</small></span>
                  <span className="product-install-choice" aria-hidden="true"><CheckCircle2 size={20} />{selected ? 'Установит мастер' : 'Добавить установку'}</span>
                </button>
                {selected && <div className="product-consumables">
                  <div className="product-consumables-title"><PackageCheck size={18} /><strong>Расходники для установки</strong><span>Выберите нужные</span></div>
                  <div className="product-consumables-list">{product.consumablesOptions.map(item => <label key={item.id} className="consumable-choice"><input type="checkbox" checked={productConsumables.includes(item.id)} onChange={() => toggleConsumable(product.id, item.id)} /><span>{item.name}</span><b>+{item.price.toFixed(2)} BYN</b></label>)}</div>
                </div>}
              </div>;
            })}
          </div>
        </section>

        <aside className="customer-service-column" aria-label="Установка мастером">
          <section className="customer-panel service-panel" aria-labelledby="service-title">
            <div className="customer-section-heading"><div className="section-icon orange"><PackageCheck size={22} /></div><h2 id="service-title">Вызвать мастера</h2><button type="button" className={`service-switch ${installationEnabled ? 'on' : ''}`} role="switch" aria-checked={installationEnabled} aria-label="Добавить установку мастером" onClick={toggleInstallation}><span /></button></div>
            {installationEnabled && selectedProducts.length > 0 ? <div className="service-options">
              <div className="service-price-banner"><div><span>Установка выбранных товаров</span><strong>{installPrice.toFixed(2)} <small>BYN</small></strong></div><span className="saving-badge">на {savingsPercent}% дешевле</span></div>
              <p className="service-note">Проверенный мастер заедет к вам по своему маршруту.</p>
              <div className="service-subheading">Выберите время</div>
              <div className="slot-list" role="radiogroup" aria-label="Выберите время установки">{timeSlots.map(slot => <button type="button" key={slot.id} role="radio" aria-checked={selectedSlot.id === slot.id} onClick={() => setSelectedSlot(slot)} className={`slot-option ${selectedSlot.id === slot.id ? 'selected' : ''}`}><span className="slot-icon">{slot.id === 'commute' ? <Clock3 size={19} /> : <Users size={19} />}</span><span className="slot-copy"><strong>{slot.id === 'commute' ? 'Сегодня, 18:00–20:00' : 'Завтра, 19:00'}</strong><span>{slot.id === 'commute' ? 'Попутный мастер' : 'Вместе с соседями'}</span>{slot.clusterProgress && selectedSlot.id === 'cluster' && <em>Уже {slot.clusterProgress.current} из {slot.clusterProgress.total} соседей</em>}</span><span className="slot-price">{installationForSlot(slot).toFixed(2)} BYN</span></button>)}</div>
            </div> : <p className="service-off-message">{installationEnabled ? 'Отметьте товары, которые нужно установить. Остальные останутся в покупке.' : 'Товары можно оформить без установки.'}</p>}
          </section>
        </aside>
      </div>

      <section className="checkout-panel" aria-labelledby="checkout-title">
        <div className="checkout-main">
          <div className="checkout-summary"><h2 id="checkout-title">Итого к оплате</h2><div className="checkout-lines"><span>Товары ({products.length}) <b>{productPrice.toFixed(2)} BYN</b></span>{installationEnabled && selectedProducts.length > 0 && <><span>Установка ({selectedProducts.length}) <b>{installPrice.toFixed(2)} BYN</b></span>{consumablesPrice > 0 && <span>Расходники ({selectedConsumables.length}) <b>{consumablesPrice.toFixed(2)} BYN</b></span>}{useBonus && <span className="discount-line">Бонусы <b>−{bonusDiscount.toFixed(2)} BYN</b></span>}</>}</div></div>
          <div className="checkout-action"><div className="checkout-total"><span>К оплате</span><strong>{totalPrice.toFixed(2)} <small>BYN</small></strong></div><button type="button" onClick={handleCheckout} className="checkout-button">Оформить заказ <ArrowRight size={20} /></button></div>
        </div>
        <div className="checkout-bonus"><div className="checkout-bonus-info"><CreditCard size={22} /><div><strong>ОМА БАЛАНС · {loyaltyState.totalPoints} бонуса</strong><span>{loyaltyState.expiringPoints} бонусов сгорят через {loyaltyState.expiryDays} дней</span></div></div><label className="customer-checkbox bonus-option"><input type="checkbox" checked={useBonus} disabled={!installationEnabled || selectedProducts.length === 0} onChange={e => setUseBonus(e.target.checked)} /><span><strong>Списать бонусы</strong><small>До {loyaltyState.maxDiscountPercent}% стоимости установки</small></span><b>{!installationEnabled || selectedProducts.length === 0 ? '—' : `−${availableBonusDiscount.toFixed(2)} BYN`}</b></label></div>
      </section>

      {showConfirmationModal && <div className="confirmation-overlay" role="presentation"><div className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><button type="button" className="modal-close" aria-label="Закрыть" onClick={() => setShowConfirmationModal(false)}><X size={20} /></button><div className="confirmation-icon"><CheckCircle2 size={34} /></div><h3 id="confirmation-title">Заказ оформлен!</h3><p>В покупке {products.length} товара. {installationEnabled && selectedProducts.length > 0 ? `Мастер установит ${selectedProducts.length}.` : 'Без установки мастером.'}</p>{installationEnabled && selectedProducts.length > 0 && <><div className="confirmation-master"><span>👷</span><div><strong>ИП Ковалёв А.В.</strong><small><ShieldCheck size={15} /> Проверен ОМА PRO · рейтинг 4.95</small></div></div><button type="button" className="confirmation-map-button" onClick={() => { setShowConfirmationModal(false); setActiveTab('dispatcher'); }}>Посмотреть маршрут на карте <ArrowRight size={18} /></button></>}</div></div>}
    </div>
  );
}
