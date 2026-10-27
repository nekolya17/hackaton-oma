import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { storeLocations, hexCells, masters, matchingRoute, specializations } from '../../data/mockData';
import { mapTiles } from '../../config/mapTiles';
import { Brain, Filter, Activity, TrendingDown, ShoppingCart, Truck, MapPin } from 'lucide-react';

// Custom icon factories using divIcon to avoid Leaflet asset path issues
function createIcon(emoji: string, bgColor: string, size: number = 32) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${bgColor};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:${size * 0.45}px;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      border:2px solid white;
    ">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createPulsingIcon(emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:36px;height:36px;">
      <div style="
        position:absolute;inset:0;
        border-radius:50%;
        background:rgba(0,180,216,0.3);
        animation:pulse-ring 1.5s ease-out infinite;
      "></div>
      <div style="
        position:absolute;inset:4px;
        background:#F49B36;
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:14px;
        border:2px solid white;
        box-shadow:0 2px 8px rgba(0,180,216,0.4);
      ">${emoji}</div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

const hypermarketIcon = createIcon('🏬', '#2A1B48', 36);
const kstatiIcon = createIcon('🏪', '#E56E3E', 32);
const masterIcon = createIcon('🚗', '#241B38', 34);
const orderIcon = createPulsingIcon('📍');
const clientIcon = createIcon('🏠', '#F49B36', 28);
const startIcon = createIcon('🏗️', '#3E285F', 28);
const homeIcon = createIcon('🏡', '#22c55e', 28);

// Route animation component
function AnimatedRoute({ points, show }: { points: [number, number][]; show: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (show && points.length > 1) {
      const bounds = L.latLngBounds(points.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
    }
  }, [show, points, map]);

  if (!show) return null;

  return (
    <Polyline
      positions={points}
      pathOptions={{
        color: '#2A1B48',
        weight: 4,
        dashArray: '12, 8',
        opacity: 0.9,
      }}
    />
  );
}

export default function DispatcherMapView() {
  const { orders, algorithmRunning, algorithmMatched, runAlgorithm } = useApp();
  const [selectedSpec, setSelectedSpec] = useState('Все');

  const filteredMasters = useMemo(() => {
    if (selectedSpec === 'Все') return masters;
    return masters.filter(m => m.specialization === selectedSpec);
  }, [selectedSpec]);

  const hexColors = {
    low: { fill: '#F49B36', opacity: 0.15, border: '#F49B36' },
    medium: { fill: '#E56E3E', opacity: 0.2, border: '#E56E3E' },
    high: { fill: '#3E285F', opacity: 0.25, border: '#3E285F' },
  };

  const routePoints: [number, number][] = matchingRoute.points.map(p => p.coords);
  const routeIcons: Record<string, L.DivIcon> = { start: startIcon, client: clientIcon, home: homeIcon };

  const metrics = {
    idleKm: 0.4,
    idleKmBefore: 14.0,
    clientSaving: 60.0,
    stmUpsell: 14.5,
  };

  return (
    <div className="view-content dispatcher-content max-w-[1600px] mx-auto p-4">
      <div className="dispatcher-layout grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Map (3 cols) */}
        <div className="dispatcher-map xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
          <MapContainer
            center={[53.9045, 27.5615]}
            zoom={11}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer attribution={mapTiles.attribution} url={mapTiles.url} />

            {/* H3 Hexagons */}
            {hexCells.map(hex => {
              const dynamicCount = hex.orderCount + orders.filter(o => o.district === hex.district).length;
              const density = dynamicCount >= 3 ? 'high' : dynamicCount >= 2 ? 'medium' : 'low';
              const color = hexColors[density];
              return (
                <Polygon
                  key={hex.id}
                  positions={hex.coordinates}
                  pathOptions={{
                    fillColor: color.fill,
                    fillOpacity: color.opacity,
                    color: color.border,
                    weight: 2,
                    opacity: 0.5,
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold text-sm">{hex.district}</p>
                      <p className="text-xs text-gray-600">{dynamicCount} активных заявок</p>
                      <p className="text-xs text-gray-400">H3 геоиндекс: res. 7</p>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

            {/* OMA Stores */}
            {storeLocations.map(store => (
              <Marker
                key={store.id}
                position={store.coordinates}
                icon={store.type === 'hypermarket' ? hypermarketIcon : kstatiIcon}
              >
                <Popup>
                  <div>
                    <p className="font-bold text-sm">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.address}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${
                      store.type === 'hypermarket' ? 'bg-[#2A1B48]' : 'bg-[#E56E3E]'
                    }`}>
                      {store.type === 'hypermarket' ? 'Гипермаркет' : 'ОМА КСТАТИ'}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Masters */}
            {filteredMasters.map(m => (
              <Marker key={m.id} position={m.currentCoords} icon={masterIcon}>
                <Popup>
                  <div>
                    <p className="font-bold text-sm">{m.avatar} {m.name}</p>
                    <p className="text-xs text-gray-500">{m.specialization} • {m.rating}⭐</p>
                    <p className="text-xs text-gray-400">{m.commuteFrom} → {m.commuteTo}</p>
                    <p className="text-[10px] text-gray-400">Выезд: {m.departureTime}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Master commute dashed lines */}
            {filteredMasters.map(m => (
              <Polyline
                key={`route-${m.id}`}
                positions={[m.commuteFromCoords, m.commuteToCoords]}
                pathOptions={{ color: '#F5AA45', weight: 2, dashArray: '8, 6', opacity: 0.6 }}
              />
            ))}

            {/* Dynamic orders */}
            {orders.filter(o => !o.purchasedProducts || (o.items?.length ?? 0) > 0).map(o => (
              <Marker key={o.id} position={o.coordinates} icon={orderIcon}>
                <Popup>
                  <div>
                    <p className="font-bold text-sm">📍 {o.address}</p>
                    <p className="text-xs text-gray-600">{o.items?.length ? o.items.map(item => item.product.name).join(', ') : o.product.name}</p>
                    <p className="text-xs font-bold text-[#F49B36]">Установка: {o.items?.length ? o.items.reduce((sum, item) => sum + item.installationPrice, 0).toFixed(2) : o.slot.price} BYN</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Algorithm route */}
            <AnimatedRoute points={routePoints} show={algorithmMatched} />
            {algorithmMatched && matchingRoute.points.map((p, i) => (
              <Marker
                key={`route-point-${i}`}
                position={p.coords}
                icon={routeIcons[p.type] || orderIcon}
              >
                <Popup>
                  <p className="text-xs font-semibold">{p.label}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map legend overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg z-[1000] text-xs space-y-1">
            <p className="font-bold text-gray-700 mb-1">Легенда</p>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2A1B48]" /> Гипермаркет ОМА</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#E56E3E]" /> ОМА КСТАТИ</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#241B38]" /> Мастер ОМА PRO</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#F49B36]" /> Заявка B2C</div>
          </div>
        </div>

        {/* Control Panel (1 col) */}
        <div className="dispatcher-panel space-y-4 overflow-y-auto">
          {/* Specialization Filter */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} className="text-[#2A1B48]" />
              <h3 className="text-sm font-bold text-[#2A1B48]">Фильтр по специализации</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {specializations.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSpec(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedSpec === s
                      ? 'bg-[#2A1B48] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Master info */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={16} className="text-[#F5AA45]" />
              <h3 className="text-sm font-bold text-gray-800">Мастер на маршруте</h3>
            </div>
            <div className="p-3 bg-[#241B38] rounded-xl text-white">
              <p className="text-sm font-bold">👷 ИП Ковалёв А.В.</p>
              <p className="text-xs text-gray-400 mt-0.5">Сантехника PRO • 4.95⭐</p>
              <p className="text-xs text-[#F5AA45] mt-1">🛣️ БЦ «Титан» → Уручье (17:30)</p>
            </div>
          </div>

          {/* Algorithm Button */}
          <button
            onClick={runAlgorithm}
            disabled={algorithmRunning}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer ${
              algorithmRunning
                ? 'bg-[#2A1B48]/60 text-white/80 animate-pulse'
                : algorithmMatched
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'bg-gradient-to-r from-[#2A1B48] to-[#3E285F] text-white hover:shadow-xl hover:shadow-[#2A1B48]/30 hover:scale-[1.01]'
            }`}
          >
            {algorithmRunning ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Анализ геоданных...
              </span>
            ) : algorithmMatched ? (
              <span className="flex items-center justify-center gap-2">
                <Brain size={16} />
                ✅ Маршрут оптимизирован!
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Brain size={16} />
                🧠 Запустить Гео-Алгоритм Попутного Матчинга
              </span>
            )}
          </button>

          {/* Telemetry */}
          {algorithmMatched && (
            <div className="space-y-3 animate-[fadeIn_0.5s_ease-out]">
              <h3 className="text-sm font-bold text-[#2A1B48] flex items-center gap-2">
                <Activity size={16} /> Телеметрия алгоритма
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                  <TrendingDown size={14} className="text-emerald-500 mb-1" />
                  <p className="text-lg font-black text-emerald-600">{metrics.idleKm} км</p>
                  <p className="text-[10px] text-gray-500">Холостой пробег</p>
                  <p className="text-[10px] text-emerald-500">вместо {metrics.idleKmBefore} км (-97%)</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                  <MapPin size={14} className="text-[#F49B36] mb-1" />
                  <p className="text-lg font-black text-[#F49B36]">{metrics.clientSaving} BYN</p>
                  <p className="text-[10px] text-gray-500">Экономия клиента</p>
                </div>
                <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#F1EEE9]">
                  <ShoppingCart size={14} className="text-[#2A1B48] mb-1" />
                  <p className="text-lg font-black text-[#2A1B48]">+{metrics.stmUpsell} BYN</p>
                  <p className="text-[10px] text-gray-500">Допродажа СТМ ОМА</p>
                </div>
              </div>

              {/* Route breakdown */}
              <div className="bg-white rounded-xl p-3 border border-gray-100">
                <p className="text-xs font-bold text-gray-700 mb-2">Оптимизированный маршрут</p>
                <div className="space-y-2">
                  {matchingRoute.points.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          p.type === 'start' ? 'bg-[#3E285F]' :
                          p.type === 'client' ? 'bg-[#F49B36]' : 'bg-emerald-500'
                        }`}>
                          {String.fromCharCode(1040 + i)}
                        </div>
                        {i < matchingRoute.points.length - 1 && (
                          <div className="w-0.5 h-4 bg-gray-200 mt-0.5" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 leading-tight">{p.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
