import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { masters } from '../../data/mockData';
import { Shield, Star, MapPin, Clock, ArrowRight, CheckCircle, RefreshCw, TrendingUp, Zap, Award, Navigation } from 'lucide-react';

export default function MasterCabinetView() {
  const { barterState, settleBarter, incomingOrders, acceptOrder } = useApp();
  const master = masters[0]; // ИП Ковалёв
  const [animatingDebt, setAnimatingDebt] = useState(false);
  const [displayDebt, setDisplayDebt] = useState(barterState.debtAmount);

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
  };

  const weeklyEarnings = [
    { day: 'Пн', amount: 70 },
    { day: 'Вт', amount: 45 },
    { day: 'Ср', amount: 85 },
    { day: 'Чт', amount: 55 },
    { day: 'Пт', amount: 55 },
  ];

  return (
    <div className="view-content master-content max-w-[1400px] mx-auto p-4 space-y-5">
      {/* Master Profile Header */}
      <div className="bg-gradient-to-r from-[#241B38] to-[#352747] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5AA45]/5 rounded-bl-full" />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#F5AA45] to-[#F59E0B] rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-[#F5AA45]/20">
              {master.avatar}
            </div>
            <div>
              <h2 className="text-xl font-extrabold" style={{ fontFamily: 'Manrope' }}>{master.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Shield size={14} className="text-emerald-400" />
                <span className="text-xs text-emerald-400 font-semibold">Верифицирован в ОМА PRO</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">УНП {master.unp}</span>
              </div>
            </div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#F5AA45" className="text-[#F5AA45]" />
              ))}
            </div>
            <span className="text-lg font-bold text-[#F5AA45]">{master.rating}</span>
          </div>
        </div>

        {/* Auto-Scoring Badge */}
        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Award size={20} className="text-[#F5AA45] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#F5AA45]">Авто-скоринг компетенций по чекам ОМА PRO</p>
              <p className="text-xs text-gray-400 mt-1">
                {master.purchaseStats} → <span className="text-white font-semibold">Допуск: {master.competenceLevel}</span>
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                💡 Компетенции подтверждены реальными закупками в ОМА PRO — не просто анкета, а data-driven верификация
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commute Route Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <Navigation size={18} className="text-[#2A1B48]" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Ваш маршрут домой</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-gray-800">{master.commuteFrom}</span>
              <ArrowRight size={14} className="text-[#F49B36]" />
              <span className="text-sm font-bold text-gray-800">{master.commuteTo}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 rounded-full">
            <Clock size={12} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600">Выезд в {master.departureTime}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Incoming Orders (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-bold text-[#2A1B48] flex items-center gap-2">
            <MapPin size={16} /> Входящие попутные заказы
          </h3>

          {incomingOrders.map(order => (
            <div
              key={order.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 ${
                order.accepted ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white ${
                    order.type === 'single' ? 'bg-[#F49B36]' : 'bg-[#E56E3E]'
                  }`}>
                    {order.type === 'single' ? '🏠 Одиночный' : '🏘️ Кластер соседей'}
                  </span>
                  <span className="text-xs text-gray-400">{order.district}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-emerald-600">+{order.income} BYN</p>
                  <p className="text-[10px] text-gray-400">чистый доход</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-gray-700">{order.address}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Navigation size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-amber-600 font-medium">{order.deviation}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Zap size={14} className="text-[#2A1B48] shrink-0 mt-0.5" />
                  <p className="text-gray-700"><strong>Задачи:</strong> {order.tasks}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-gray-600">{order.duration}</p>
                </div>
              </div>

              {/* Consumables pickup */}
              <div className="mt-3 p-3 bg-[#E56E3E]/5 rounded-xl border border-[#E56E3E]/10">
                <p className="text-xs text-gray-700">
                  🏪 <strong className="text-[#E56E3E]">Пикап ОМА КСТАТИ:</strong> {order.consumablesPickup}
                </p>
              </div>

              {order.clusterDetails && (
                <div className="mt-2 p-3 bg-[#2A1B48]/5 rounded-xl border border-[#2A1B48]/10">
                  <p className="text-xs text-[#2A1B48]">📋 {order.clusterDetails}</p>
                </div>
              )}

              <button
                onClick={() => acceptOrder(order.id)}
                disabled={order.accepted}
                className={`mt-4 w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                  order.accepted
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-gradient-to-r from-[#2A1B48] to-[#3E285F] text-white hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {order.accepted ? (
                  <span className="flex items-center justify-center gap-2"><CheckCircle size={16} /> Принято в маршрут</span>
                ) : order.type === 'single' ? (
                  '✅ Принять в маршрут'
                ) : (
                  '🏘️ Взять кластер целиком'
                )}
              </button>
            </div>
          ))}

          {/* Weekly Earnings Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-emerald-500" /> Заработок на этой неделе
            </h4>
            <div className="flex items-end gap-3 h-24">
              {weeklyEarnings.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-emerald-600">{d.amount}</span>
                  <div
                    className="w-full bg-gradient-to-t from-[#2A1B48] to-[#F49B36] rounded-t-md transition-all duration-500"
                    style={{ height: `${(d.amount / 100) * 80}px` }}
                  />
                  <span className="text-[10px] text-gray-400">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">Итого за неделю:</span>
              <span className="text-lg font-black text-emerald-600">+{weeklyEarnings.reduce((s, d) => s + d.amount, 0)} BYN</span>
            </div>
          </div>
        </div>

        {/* Barter Widget (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-[#241B38] to-[#352747] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#F5AA45]/5 rounded-bl-full" />
            <div className="relative">
              <h3 className="text-base font-extrabold mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope' }}>
                <RefreshCw size={18} className="text-[#F5AA45]" />
                Финансовый взаимозачёт ОМА PRO
              </h3>

              <div className="space-y-4">
                {/* Debt display */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400">Задолженность по отсрочке платежа за стройматериалы</p>
                  <p className={`text-3xl font-black mt-1 transition-all duration-300 ${
                    barterState.isSettled ? 'text-emerald-400 animate-barter' : 'text-red-400'
                  }`}>
                    {displayDebt.toFixed(2)} BYN
                  </p>
                  {barterState.isSettled && (
                    <p className="text-xs text-gray-500 mt-1 line-through">{barterState.debtAmount.toFixed(2)} BYN</p>
                  )}
                </div>

                {/* Earned display */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-gray-400">Заработано «по пути» на этой неделе</p>
                  <p className="text-2xl font-black text-[#F5AA45] mt-1">{barterState.earnedAmount.toFixed(2)} BYN</p>
                </div>

                {/* Barter button */}
                <button
                  onClick={handleBarter}
                  disabled={barterState.isSettled}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                    barterState.isSettled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-[#F5AA45] to-[#F59E0B] text-[#241B38] hover:shadow-xl hover:shadow-[#F5AA45]/30 hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  {barterState.isSettled ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Взаимозачёт выполнен!
                    </span>
                  ) : (
                    '🔄 Погасить долг заработанными деньгами (+бонус 5% от ОМА!)'
                  )}
                </button>

                {/* Barter explanation */}
                {barterState.isSettled && (
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 animate-[fadeIn_0.5s_ease-out]">
                    <p className="text-sm font-bold text-emerald-400 mb-2">Детали взаимозачёта:</p>
                    <div className="space-y-1.5 text-xs text-gray-300">
                      <p>• Заработано: {barterState.earnedAmount.toFixed(2)} BYN</p>
                      <p>• Бонус ОМА (5%): +{(barterState.earnedAmount * 0.05).toFixed(2)} BYN</p>
                      <p>• Итого зачтено: {(barterState.earnedAmount * 1.05).toFixed(2)} BYN</p>
                      <p className="font-bold text-emerald-400">• Новый долг: {barterState.settledDebt.toFixed(2)} BYN</p>
                    </div>
                    <div className="mt-3 p-2 bg-[#F5AA45]/10 rounded-lg">
                      <p className="text-[10px] text-[#F5AA45] font-semibold text-center">
                        💰 100% денег остаются внутри экосистемы ОМА!
                      </p>
                      <p className="text-[10px] text-gray-400 text-center mt-0.5">
                        Выгода мастера: +{(barterState.earnedAmount * 0.05).toFixed(2)} BYN бонусного списания
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-black text-[#2A1B48]">47</p>
              <p className="text-[10px] text-gray-500 mt-0.5">заказов «по пути» выполнено</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-black text-emerald-600">98%</p>
              <p className="text-[10px] text-gray-500 mt-0.5">клиентов довольны</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
