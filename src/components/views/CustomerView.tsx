import { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle2, Clock3, CreditCard, PackageCheck, ShoppingBag, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { products, timeSlots } from '../../data/mockData';
import { Product } from '../../types';
import RequestStatusCard from '../RequestStatusCard';

const deliveryOptions = [
  { delivery: 'Сегодня, 16:00–18:00', master: 'Сегодня, 18:00–20:00' },
  { delivery: 'Завтра, 17:00–19:00', master: 'Завтра, 19:00–21:00' },
];

function ProductImage({ product }: { product: Product }) {
  return <span className="product-image" aria-hidden="true">{product.imageUrl ? <img src={product.imageUrl} alt="" loading="lazy" /> : <span className="product-image-placeholder">{product.icon}</span>}</span>;
}

export default function CustomerView() {
  const { addOrder, createServiceRequest, serviceRequests, loyaltyState } = useApp();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [deliveryIndex, setDeliveryIndex] = useState(0);
  const [useBonus, setUseBonus] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [lastHadService, setLastHadService] = useState(false);
  const selectedProducts = products.filter(product => selectedProductIds.includes(product.id));
  const productsPrice = products.reduce((sum, product) => sum + product.price, 0);
  const installationPrice = selectedProducts.reduce((sum, product) => sum + product.installationPrice, 0);
  const bonusDiscount = useBonus && selectedProducts.length ? Math.min(7, installationPrice * loyaltyState.maxDiscountPercent / 100) : 0;
  const totalPrice = productsPrice + installationPrice - bonusDiscount;
  const cartRequests = serviceRequests.filter(request => request.source === 'cart');
  const delivery = deliveryOptions[deliveryIndex];

  const toggleProduct = (id: string) => setSelectedProductIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const handleCheckout = () => {
    const hasService = selectedProducts.length > 0;
    const serviceRequestId = hasService ? createServiceRequest({
      source: 'cart',
      description: `Установка: ${selectedProducts.map(product => product.name).join(', ')}`,
      productIds: selectedProductIds,
      deliveryWindow: delivery.delivery,
      arrivalWindow: delivery.master,
      address: 'ЖК «Новая Боровая», ул. Авиационная, 22, кв. 74',
      district: 'Новая Боровая',
      coordinates: [53.9540, 27.6700],
      estimatedPrice: installationPrice,
    }) : undefined;
    addOrder({
      id: `order-${Date.now()}`,
      serviceRequestId,
      product: products[0],
      purchasedProducts: products,
      items: selectedProducts.map(product => ({ product, installationPrice: product.installationPrice })),
      slot: timeSlots[0],
      address: 'ЖК «Новая Боровая», ул. Авиационная, 22, кв. 74',
      district: 'Новая Боровая',
      coordinates: [53.9540, 27.6700],
      status: 'pending',
      useBonus: hasService && useBonus,
      bonusDiscount,
      totalPrice,
      createdAt: new Date(),
    });
    setLastHadService(hasService);
    setConfirmationOpen(true);
    confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
  };

  return <div className="view-content customer-content">
    <div className="customer-layout">
      <section className="customer-panel cart-panel" aria-labelledby="cart-title"><div className="customer-section-heading"><div className="section-icon"><ShoppingBag size={22} /></div><h2 id="cart-title">Корзина</h2><span className="cart-count">{products.length} товара</span></div><p className="cart-explanation">Отметьте товары, для которых нужна установка. Заявка поступит мастерам после оформления.</p><div className="product-list">{products.map(product => {
        const selected = selectedProductIds.includes(product.id);
        return <div key={product.id} className={`product-entry ${selected ? 'selected' : ''}`}><button type="button" role="checkbox" aria-checked={selected} aria-label={`${selected ? 'Убрать установку' : 'Нужен мастер для товара'}: ${product.name}`} onClick={() => toggleProduct(product.id)} className={`product-row ${selected ? 'selected' : ''}`}><ProductImage product={product} /><span className="product-info"><span className="product-category">{product.category}</span><strong>{product.name}</strong></span><span className="product-price"><strong>{product.price.toFixed(2)}</strong><small>BYN</small></span><span className="product-install-choice" aria-hidden="true"><CheckCircle2 size={20} />{selected ? 'Нужен мастер' : 'Добавить установку'}</span></button></div>;
      })}</div></section>
      <aside className="customer-service-column"><section className="customer-panel service-panel"><div className="customer-section-heading"><div className="section-icon orange"><Clock3 size={22} /></div><h2>Доставка и установка</h2></div><p className="service-note">Выберите время доставки товара. Если нужна установка, мастер приедет после неё.</p><div className="delivery-options" role="radiogroup" aria-label="Время доставки">{deliveryOptions.map((option, index) => <button type="button" key={option.delivery} role="radio" aria-checked={deliveryIndex === index} onClick={() => setDeliveryIndex(index)} className={`delivery-option ${deliveryIndex === index ? 'selected' : ''}`}><span><strong>Доставка</strong>{option.delivery}</span><span><strong>Визит мастера</strong>{selectedProducts.length ? option.master : 'Если выбрать установку'}</span></button>)}</div>{selectedProducts.length > 0 && <div className="delivery-note"><PackageCheck size={18} /><span>Заявка на установку {selectedProducts.length} {selectedProducts.length === 1 ? 'товара' : 'товаров'} отправится мастерам. Карточка специалиста появится после принятия.</span></div>}</section></aside>
    </div>
    <section className="checkout-panel" aria-labelledby="checkout-title"><div className="checkout-main"><div className="checkout-summary"><h2 id="checkout-title">Итого к оплате</h2><div className="checkout-lines"><span>Товары ({products.length}) <b>{productsPrice.toFixed(2)} BYN</b></span>{selectedProducts.length > 0 && <><span>Установка, предварительно <b>{installationPrice.toFixed(2)} BYN</b></span>{bonusDiscount > 0 && <span className="discount-line">Бонусы <b>−{bonusDiscount.toFixed(2)} BYN</b></span>}</>}</div></div><div className="checkout-action"><div className="checkout-total"><span>Предварительно</span><strong>{totalPrice.toFixed(2)} <small>BYN</small></strong></div><button type="button" className="checkout-button" onClick={handleCheckout}>Оформить заказ <ArrowRight size={20} /></button></div></div><div className="checkout-bonus"><div className="checkout-bonus-info"><CreditCard size={22} /><div><strong>ОМА БАЛАНС · {loyaltyState.totalPoints} бонуса</strong><span>{loyaltyState.expiringPoints} бонусов сгорят через {loyaltyState.expiryDays} дней</span></div></div><label className="customer-checkbox bonus-option"><input type="checkbox" checked={useBonus} disabled={!selectedProducts.length} onChange={event => setUseBonus(event.target.checked)} /><span><strong>Списать бонусы</strong><small>До {loyaltyState.maxDiscountPercent}% стоимости установки</small></span><b>{selectedProducts.length ? `−${Math.min(7, installationPrice * loyaltyState.maxDiscountPercent / 100).toFixed(2)} BYN` : '—'}</b></label></div></section>
    {cartRequests.length > 0 && <section className="request-history" aria-live="polite"><h2>Установка по вашим заказам</h2><div className="request-history-list">{cartRequests.map(request => <RequestStatusCard key={request.id} request={request} />)}</div></section>}
    {confirmationOpen && <div className="confirmation-overlay" role="presentation"><div className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><button type="button" className="modal-close" aria-label="Закрыть" onClick={() => setConfirmationOpen(false)}><X size={20} /></button><div className="confirmation-icon"><CheckCircle2 size={34} /></div><h3 id="confirmation-title">Заказ оформлен!</h3><p>{lastHadService ? `Заявка на установку отправлена. Визит мастера запланирован после доставки: ${delivery.master}. Карточка специалиста появится после принятия заказа.` : `Доставка: ${delivery.delivery}.`}</p><button type="button" className="confirmation-map-button" onClick={() => setConfirmationOpen(false)}>Понятно</button></div></div>}
  </div>;
}
