import { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle, TrendingUp, Target, Layers, Building2, TreePine, ShoppingBag, BarChart3, Users, Repeat } from 'lucide-react';

export default function UnitEconomicsView() {
  const [ordersPerDay, setOrdersPerDay] = useState(400);
  const [avgStmCheck, setAvgStmCheck] = useState(12.5);

  const monthlyGMV = ordersPerDay * 35 * 30;
  const omaCommission = monthlyGMV * 0.18;
  const stmRevenue = ordersPerDay * avgStmCheck * 30;
  const barterVolume = monthlyGMV * 0.45;

  const cjmSteps = [
    { step: 1, title: 'Покупка / Потребность', icon: <ShoppingBag size={20} />, color: '#2B0B73', desc: 'Покупка товара в ОМА / oma.by + выбор опции «Установить по пути»' },
    { step: 2, title: 'H3 Гео-Матчинг', icon: <Target size={20} />, color: '#00B4D8', desc: 'Алгоритм находит мастера ОМА PRO, чей маршрут проходит в пределах 500 м от клиента' },
    { step: 3, title: 'Микро-пикап ОМА КСТАТИ', icon: <Building2 size={20} />, color: '#F04E37', desc: 'Мастер за 60 сек забирает готовый пакет СТМ расходников у дома клиента' },
    { step: 4, title: 'Установка + Гарантия', icon: <CheckCircle size={20} />, color: '#22c55e', desc: '30 мин работы, электронный чек в приложении, списание бонусов БАЛАНС' },
    { step: 5, title: 'Регулярное ТО (180 дней)', icon: <Repeat size={20} />, color: '#FACC15', desc: 'Push-напоминание о замене фильтров, сгорании бонусов → повторный вызов «по пути»' },
  ];

  const [activeCjm, setActiveCjm] = useState(0);

  return (
    <div className="max-w-[1400px] mx-auto p-4 space-y-6">
      {/* Market Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full" />
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-500" />
            <h3 className="text-sm font-bold text-red-600">Сейчас на oma.by</h3>
          </div>
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm text-red-800 italic">
              «Ищите мастеров на сторонних сайтах сами, ОМА ответственности не несёт»
            </p>
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
            <li>❌ Нет гарантии качества монтажа</li>
            <li>❌ Потеря маржи: клиент уходит на сторонний сайт</li>
            <li>❌ Нулевая лояльность после покупки</li>
            <li>❌ Расходники покупаются у конкурентов</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-full" />
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={18} className="text-emerald-500" />
            <h3 className="text-sm font-bold text-emerald-600">С «ОМА ПО ПУТИ»</h3>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-emerald-800 font-semibold">
              Легальные B2B2C контракты через ОМА PRO + попутная логистика
            </p>
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
            <li>✅ Верифицированные мастера (auto-scoring по чекам)</li>
            <li>✅ 0 холостых километров = себестоимость -63%</li>
            <li>✅ 100% расходников = СТМ ОМА через ОМА КСТАТИ</li>
            <li>✅ Безналичный B2B взаимозачёт удерживает 100% кэша</li>
          </ul>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 size={20} className="text-[#2B0B73]" />
          <h3 className="text-lg font-extrabold text-[#2B0B73]" style={{ fontFamily: 'Manrope' }}>Интерактивный калькулятор ROI для ОМА</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
              <span>Количество заказов в день</span>
              <span className="text-lg font-black text-[#2B0B73]">{ordersPerDay}</span>
            </label>
            <input
              type="range"
              min={50}
              max={2000}
              step={10}
              value={ordersPerDay}
              onChange={e => setOrdersPerDay(Number(e.target.value))}
              className="w-full mt-2 accent-[#2B0B73] h-2"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>50 (запуск)</span>
              <span>2 000 (масштаб)</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
              <span>Средний чек допродажи СТМ (Wunder/Fix Haus)</span>
              <span className="text-lg font-black text-[#2B0B73]">{avgStmCheck.toFixed(1)} BYN</span>
            </label>
            <input
              type="range"
              min={5}
              max={35}
              step={0.5}
              value={avgStmCheck}
              onChange={e => setAvgStmCheck(Number(e.target.value))}
              className="w-full mt-2 accent-[#00B4D8] h-2"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>5 BYN</span>
              <span>35 BYN</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-[#2B0B73] to-[#3B108C] rounded-xl p-4 text-white">
            <TrendingUp size={16} className="text-white/60 mb-1" />
            <p className="text-2xl font-black">{(monthlyGMV / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-white/70 mt-0.5">Месячный GMV услуг (BYN)</p>
          </div>
          <div className="bg-gradient-to-br from-[#00B4D8] to-[#00A8C6] rounded-xl p-4 text-white">
            <Layers size={16} className="text-white/60 mb-1" />
            <p className="text-2xl font-black">{(omaCommission / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-white/70 mt-0.5">Комиссия ОМА 18% (BYN)</p>
          </div>
          <div className="bg-gradient-to-br from-[#F04E37] to-[#e63e27] rounded-xl p-4 text-white">
            <ShoppingBag size={16} className="text-white/60 mb-1" />
            <p className="text-2xl font-black">{(stmRevenue / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-white/70 mt-0.5">Доп. выручка СТМ (BYN)</p>
          </div>
          <div className="bg-gradient-to-br from-[#18181B] to-[#27272A] rounded-xl p-4 text-white">
            <Users size={16} className="text-[#FACC15]/60 mb-1" />
            <p className="text-2xl font-black text-[#FACC15]">{(barterVolume / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-gray-400 mt-0.5">B2B взаимозачёт (BYN)</p>
          </div>
        </div>
      </div>

      {/* CJM */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-extrabold text-[#2B0B73] mb-5" style={{ fontFamily: 'Manrope' }}>
          Customer Journey Map (CJM) — «ОМА ПО ПУТИ»
        </h3>

        {/* Timeline */}
        <div className="flex items-start justify-between mb-6 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
          {cjmSteps.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveCjm(i)}
              className="relative z-10 flex flex-col items-center cursor-pointer group flex-1"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeCjm === i
                    ? 'scale-125 shadow-lg'
                    : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'
                }`}
                style={{ background: s.color, color: 'white' }}
              >
                {s.icon}
              </div>
              <p className={`text-[10px] font-semibold mt-2 text-center leading-tight transition-colors ${
                activeCjm === i ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {s.title}
              </p>
            </button>
          ))}
        </div>

        {/* Active step details */}
        <div className="p-5 rounded-xl border-2 transition-all duration-300" style={{ borderColor: cjmSteps[activeCjm].color + '40', background: cjmSteps[activeCjm].color + '08' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: cjmSteps[activeCjm].color }}>
              {cjmSteps[activeCjm].step}
            </div>
            <h4 className="text-base font-bold text-gray-800">{cjmSteps[activeCjm].title}</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{cjmSteps[activeCjm].desc}</p>
        </div>
      </div>

      {/* Scaling Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <TreePine size={120} className="text-emerald-600" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <TreePine size={20} className="text-emerald-600" />
              <h4 className="text-sm font-bold text-emerald-700">Масштабирование: 15 Садовых центров ОМА</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Кластерное обслуживание СТ и коттеджных посёлков — <strong>1 мастер на 10 соседних дач</strong>. 
              Попутная установка заборов Werker, теплиц Sato Garden, систем полива.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Q2 2026</span>
              <ArrowRight size={14} className="text-emerald-400" />
              <span className="text-xs text-gray-500">Пилот: Заславль, Ратомка, Боровляны</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <Building2 size={120} className="text-blue-600" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={20} className="text-blue-600" />
              <h4 className="text-sm font-bold text-blue-700">B2B Micro-Retail</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Обслуживание кофеен, пунктов выдачи заказов и офисов: <strong>мелкий ремонт, замена светильников ILLU, 
              сборка мебели Fix Haus</strong>. Юрлица оплачивают по B2B через ОМА PRO.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">Q4 2026</span>
              <ArrowRight size={14} className="text-blue-400" />
              <span className="text-xs text-gray-500">Партнёры: ЕВРООПТИКА, БУСЛIК, Dana Mall</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
