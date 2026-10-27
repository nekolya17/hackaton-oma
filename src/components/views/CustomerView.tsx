import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { products, timeSlots } from '../../data/mockData';
import { Product, TimeSlot } from '../../types';
import { ShoppingBag, ToggleLeft, ToggleRight, Clock, Users, CreditCard, AlertTriangle, Sparkles, CheckCircle, ArrowRight, Star, Shield, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CustomerView() {
  const { addOrder, addToast, loyaltyState, setActiveTab, showConfirmationModal, setShowConfirmationModal } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [installationEnabled, setInstallationEnabled] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>(timeSlots[0]);
  const [useBonus, setUseBonus] = useState(false);
  const [consumablesIncluded, setConsumablesIncluded] = useState(true);

  const installPrice = selectedSlot.price;
  const consumablesPrice = consumablesIncluded ? selectedProduct.consumablesPrice : 0;
  const bonusDiscount = useBonus ? Math.min(7, installPrice * (loyaltyState.maxDiscountPercent / 100)) : 0;
  const totalPrice = selectedProduct.price + (installationEnabled ? installPrice + consumablesPrice - bonusDiscount : 0);
  const savings = selectedProduct.marketPrice - installPrice;
  const savingsPercent = Math.round((savings / selectedProduct.marketPrice) * 100);

  const handleCheckout = () => {
    const order = {
      id: `order-${Date.now()}`,
      product: selectedProduct,
      slot: selectedSlot,
      address: 'ЖК «Новая Боровая», ул. Авиационная, 22, кв. 74',
      district: 'Новая Боровая',
      coordinates: [53.9540, 27.6700] as [number, number],
      status: 'assigned' as const,
      assignedMasterId: 'master-1',
      useBonus,
      bonusDiscount,
      totalPrice,
      createdAt: new Date(),
    };
    addOrder(order);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setShowConfirmationModal(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Smart Checkout (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Product Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag size={20} className="text-[#2B0B73]" />
              <h2 className="text-lg font-bold text-[#2B0B73]" style={{ fontFamily: 'Manrope' }}>Ваш товар в корзине</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {products.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProduct(p); setConsumablesIncluded(true); }}
                  className={`p-3 rounded-xl text-left transition-all duration-200 border-2 cursor-pointer ${
                    selectedProduct.id === p.id
                      ? 'border-[#2B0B73] bg-[#2B0B73]/5 shadow-md'
                      : 'border-gray-100 hover:border-[#00B4D8]/30 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{p.icon}</span>
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{p.name.split(' ').slice(0, 3).join(' ')}</p>
                  <p className="text-sm font-bold text-[#2B0B73] mt-1">{p.price} BYN</p>
                </button>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-[#E8ECFF] to-[#F2F4FF] rounded-xl">
              <p className="text-sm font-semibold text-gray-800">{selectedProduct.icon} {selectedProduct.name}</p>
              <p className="text-xl font-extrabold text-[#2B0B73] mt-1">{selectedProduct.price.toFixed(2)} BYN</p>
            </div>
          </div>

          {/* The Killer Widget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00B4D8]/10 to-transparent rounded-bl-full" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-[#00B4D8]" />
                <h2 className="text-lg font-bold text-[#2B0B73]" style={{ fontFamily: 'Manrope' }}>Установить с ОМА ПО ПУТИ</h2>
              </div>
              <button
                onClick={() => setInstallationEnabled(!installationEnabled)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                {installationEnabled
                  ? <ToggleRight size={36} className="text-[#00B4D8]" />
                  : <ToggleLeft size={36} className="text-gray-300" />
                }
              </button>
            </div>

            {installationEnabled && (
              <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                {/* Price Comparison */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Рыночная цена вызова мастера</p>
                    <p className="text-lg text-gray-400 line-through">{selectedProduct.marketPrice} BYN</p>
                  </div>
                  <ArrowRight size={20} className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs text-emerald-600 font-semibold mb-0.5">Цена «По пути»</p>
                    <p className="text-2xl font-extrabold text-emerald-600">{installPrice} BYN</p>
                  </div>
                  <div className="ml-auto px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold">
                    -{savingsPercent}%
                  </div>
                </div>
                <p className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                  💡 Экономия {savingsPercent}%, так как мастер ОМА PRO уже едет мимо вашего дома!
                </p>

                {/* Consumables */}
                <label className="flex items-start gap-3 p-4 bg-[#F2F4FF] rounded-xl cursor-pointer border border-[#E8ECFF] hover:border-[#00B4D8]/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={consumablesIncluded}
                    onChange={e => setConsumablesIncluded(e.target.checked)}
                    className="mt-0.5 accent-[#2B0B73] w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">🧰 Авто-комплект расходников СТМ ОМА</p>
                    <p className="text-xs text-gray-600 mt-0.5">{selectedProduct.consumables}</p>
                    <p className="text-xs text-gray-500 mt-0.5">(заберёт мастер в ОМА КСТАТИ по пути)</p>
                    <p className="text-sm font-bold text-[#2B0B73] mt-1">+{selectedProduct.consumablesPrice.toFixed(2)} BYN</p>
                  </div>
                </label>

                {/* Slot Selection */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Clock size={14} /> Выберите слот
                  </p>
                  <div className="space-y-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 cursor-pointer ${
                          selectedSlot.id === slot.id
                            ? 'border-[#00B4D8] bg-[#00B4D8]/5 shadow-md'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {slot.id === 'commute' ? <Clock size={16} className="text-[#00B4D8]" /> : <Users size={16} className="text-[#F04E37]" />}
                            <span className="text-sm font-semibold text-gray-800">{slot.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-extrabold text-[#2B0B73]">{slot.price} BYN</span>
                            {slot.discount && (
                              <span className="px-2 py-0.5 bg-[#F04E37] text-white text-xs font-bold rounded-full">-{slot.discount}%</span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-6">{slot.description}</p>

                        {/* Cluster progress */}
                        {slot.clusterProgress && selectedSlot.id === 'cluster' && (
                          <div className="mt-3 ml-6">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-[#F04E37] font-semibold">
                                Уже {slot.clusterProgress.current} из {slot.clusterProgress.total} соседей
                              </span>
                              <span className="text-gray-400">{Math.round((slot.clusterProgress.current / slot.clusterProgress.total) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#F04E37] to-[#FACC15] rounded-full transition-all duration-1000"
                                style={{ width: `${(slot.clusterProgress.current / slot.clusterProgress.total) * 100}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">
                              Мелкие заявки соседей: кран, розетка, карниз. Присоединяйтесь!
                            </p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Loyalty + Checkout (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* OMA БАЛАНС Card */}
          <div className="bg-gradient-to-br from-[#00B4D8] to-[#00A8C6] rounded-2xl p-6 text-white shadow-lg shadow-[#00B4D8]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-white/80">Карта лояльности</p>
                  <h3 className="text-xl font-extrabold" style={{ fontFamily: 'Manrope' }}>ОМА БАЛАНС</h3>
                </div>
                <CreditCard size={28} className="text-white/60" />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black">{loyaltyState.totalPoints}</span>
                <span className="text-sm font-medium text-white/80">активных бонуса</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="white" className="text-white" />)}
                </div>
                <span className="text-xs text-white/70">•  **** 8472</span>
              </div>
            </div>
          </div>

          {/* Urgency Trigger */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">Внимание!</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  <strong>{loyaltyState.expiringPoints} бонусов</strong> сгорят через <strong>{loyaltyState.expiryDays} дней</strong> (правило 180 дней).
                  Спишите <strong>7 BYN</strong> бонусами на установку прямо сейчас!
                </p>
              </div>
            </div>
          </div>

          {/* Bonus Checkbox */}
          {installationEnabled && (
            <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 cursor-pointer hover:border-[#00B4D8]/30 transition-colors shadow-sm">
              <input
                type="checkbox"
                checked={useBonus}
                onChange={e => setUseBonus(e.target.checked)}
                className="accent-[#00B4D8] w-4 h-4"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">Оплатить 20% бонусами БАЛАНС</p>
                <p className="text-xs text-[#00B4D8] font-bold">-7.00 BYN со счёта бонусов</p>
              </div>
            </label>
          )}

          {/* Price Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Итого к оплате</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Товар</span>
                <span className="font-semibold">{selectedProduct.price.toFixed(2)} BYN</span>
              </div>
              {installationEnabled && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Установка «По пути»</span>
                    <span className="font-semibold text-emerald-600">{installPrice.toFixed(2)} BYN</span>
                  </div>
                  {consumablesIncluded && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Расходники СТМ</span>
                      <span className="font-semibold">{selectedProduct.consumablesPrice.toFixed(2)} BYN</span>
                    </div>
                  )}
                  {useBonus && (
                    <div className="flex justify-between text-[#00B4D8]">
                      <span>Бонусы БАЛАНС</span>
                      <span className="font-bold">-{bonusDiscount.toFixed(2)} BYN</span>
                    </div>
                  )}
                </>
              )}
              <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-800">Итого</span>
                <span className="text-2xl font-black text-[#2B0B73]">{totalPrice.toFixed(2)} BYN</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCheckout}
            disabled={!installationEnabled}
            className={`w-full py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 shadow-lg cursor-pointer ${
              installationEnabled
                ? 'bg-gradient-to-r from-[#2B0B73] to-[#3B108C] hover:shadow-xl hover:shadow-[#2B0B73]/30 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {installationEnabled
              ? '🚀 Оформить заказ и вызвать попутного мастера'
              : '🛒 Добавить товар в корзину'
            }
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative animate-[fadeIn_0.3s_ease-out]">
            <button onClick={() => setShowConfirmationModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-extrabold text-[#2B0B73]" style={{ fontFamily: 'Manrope' }}>Заказ оформлен!</h3>
              <p className="text-sm text-gray-500 mt-1">Попутный мастер назначен автоматически</p>
            </div>
            <div className="bg-[#F2F4FF] rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FACC15] to-[#F59E0B] rounded-xl flex items-center justify-center text-2xl">
                  👷
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">ИП Ковалёв А.В.</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield size={12} className="text-emerald-500" />
                    <span className="text-xs text-emerald-600 font-semibold">Верифицирован в ОМА PRO</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">УНП 193482910 • Рейтинг 4.95⭐ • Сантехника PRO</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-xs text-gray-600 mb-6">
              <p>📍 Маршрут мастера проходит мимо вашего дома</p>
              <p>🧰 Расходники будут забраны в ОМА КСТАТИ по пути</p>
              <p>📱 SMS-уведомление за 30 минут до приезда</p>
            </div>
            <button
              onClick={() => {
                setShowConfirmationModal(false);
                setActiveTab('dispatcher');
              }}
              className="w-full py-3 bg-gradient-to-r from-[#00B4D8] to-[#00A8C6] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all cursor-pointer"
            >
              🗺️ Перейти на карту и посмотреть маршрут мастера
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
