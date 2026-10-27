import { Product, TimeSlot, Master, StoreLocation, HexCell, IncomingOrder } from '../types';

// ─── Products (OMA Private Labels) ───
export const products: Product[] = [
  {
    id: 'faucet',
    name: 'Смеситель для кухни с выдвижным изливом + Фильтр под мойку',
    price: 185,
    installationPrice: 35,
    marketPrice: 95,
    consumables: 'Комплект крепежа Fix Haus + ФУМ-лента и герметик Wunder',
    consumablesPrice: 6.50,
    category: 'Сантехника',
    icon: '🚰',
  },
  {
    id: 'chandelier',
    name: 'Люстра потолочная ILLU с LED-модулем',
    price: 140,
    installationPrice: 30,
    marketPrice: 80,
    consumables: 'Дюбели и крюк потолочный Fix Haus + клеммы Wunder',
    consumablesPrice: 4.20,
    category: 'Электрика (ILLU)',
    icon: '💡',
  },
  {
    id: 'curtainrod',
    name: 'Карниз металлический 240 см Penta Style',
    price: 65,
    installationPrice: 25,
    marketPrice: 60,
    consumables: 'Кронштейны и анкеры Fix Haus + уровень Werker',
    consumablesPrice: 5.80,
    category: 'Сборка и крепёж (Fix Haus)',
    icon: '🪟',
  },
  {
    id: 'greenhouse',
    name: 'Теплица из поликарбоната Sato Garden 3×6 м',
    price: 890,
    installationPrice: 120,
    marketPrice: 350,
    consumables: 'Фундаментные колышки Werker + саморезы Fix Haus + уплотнитель Wunder',
    consumablesPrice: 18.90,
    category: 'Сад и Дача (Sato Garden)',
    icon: '🌿',
  },
];

// ─── Time Slots ───
export const timeSlots: TimeSlot[] = [
  {
    id: 'commute',
    label: 'Попутный мастер сегодня вечером (18:00–20:00)',
    description: 'Мастер едет с объекта по вашему маршруту',
    price: 35,
  },
  {
    id: 'cluster',
    label: 'Кластер с соседями в ЖК «Новая Боровая» (завтра 19:00)',
    description: 'Скидка -30% за пакетное обслуживание подъезда',
    price: 24,
    discount: 30,
    clusterProgress: { current: 3, total: 4 },
  },
];

// ─── Masters (OMA PRO) ───
export const masters: Master[] = [
  {
    id: 'master-1',
    name: 'ИП Ковалёв А.В.',
    unp: '193482910',
    specialization: 'Сантехника',
    rating: 4.95,
    purchaseStats: 'за 6 мес. закуплено 420 м трубы и 85 фитингов',
    competenceLevel: 'Сантехника PRO',
    commuteFrom: 'Объект БЦ «Титан»',
    commuteFromCoords: [53.9180, 27.6500],
    commuteTo: 'Дом, Уручье',
    commuteToCoords: [53.9450, 27.6900],
    departureTime: '17:30',
    currentCoords: [53.9200, 27.6550],
    avatar: '👷',
  },
  {
    id: 'master-2',
    name: 'ИП Новиков Д.С.',
    unp: '192847561',
    specialization: 'Электрика (ILLU)',
    rating: 4.88,
    purchaseStats: 'за 6 мес. закуплено 180 LED-панелей ILLU и 320 м кабеля',
    competenceLevel: 'Электрика PRO',
    commuteFrom: 'ЖК «Маяк Минска»',
    commuteFromCoords: [53.8850, 27.5400],
    commuteTo: 'Дом, Каменная Горка',
    commuteToCoords: [53.9100, 27.4350],
    departureTime: '18:00',
    currentCoords: [53.8900, 27.5300],
    avatar: '⚡',
  },
  {
    id: 'master-3',
    name: 'ИП Шевченко П.Р.',
    unp: '191056783',
    specialization: 'Сборка и крепёж (Fix Haus)',
    rating: 4.92,
    purchaseStats: 'за 6 мес. собрано 95 кухонь и 240 шкафов-купе',
    competenceLevel: 'Сборка PRO',
    commuteFrom: 'Коттедж Тарасово',
    commuteFromCoords: [53.8600, 27.4100],
    commuteTo: 'Дом, Малиновка',
    commuteToCoords: [53.8550, 27.4800],
    departureTime: '17:00',
    currentCoords: [53.8620, 27.4200],
    avatar: '🔧',
  },
];

// ─── OMA Store Locations ───
export const storeLocations: StoreLocation[] = [
  // Hypermarkets
  {
    id: 'hyper-1',
    name: 'ОМА Гипермаркет «Боровая»',
    type: 'hypermarket',
    address: 'пр. Дзержинского, 104',
    coordinates: [53.8630, 27.5170],
  },
  {
    id: 'hyper-2',
    name: 'ОМА Гипермаркет «Каменная Горка»',
    type: 'hypermarket',
    address: 'ул. Притыцкого, 156',
    coordinates: [53.9080, 27.4280],
  },
  {
    id: 'hyper-3',
    name: 'ОМА Гипермаркет «Шабаны»',
    type: 'hypermarket',
    address: 'ул. Селицкого, 17',
    coordinates: [53.8500, 27.6100],
  },
  {
    id: 'hyper-4',
    name: 'ОМА Гипермаркет «Ванеева»',
    type: 'hypermarket',
    address: 'ул. Ванеева, 30',
    coordinates: [53.8780, 27.5800],
  },
  // OMA KSTATI (small format)
  {
    id: 'kstati-1',
    name: 'ОМА КСТАТИ «Минск-Мир»',
    type: 'kstati',
    address: 'ул. Братская, 8',
    coordinates: [53.8720, 27.5500],
  },
  {
    id: 'kstati-2',
    name: 'ОМА КСТАТИ «Новая Боровая»',
    type: 'kstati',
    address: 'ул. Авиационная, 15',
    coordinates: [53.9520, 27.6650],
  },
  {
    id: 'kstati-3',
    name: 'ОМА КСТАТИ «Лебяжий»',
    type: 'kstati',
    address: 'ул. Скрипникова, 42',
    coordinates: [53.9180, 27.4800],
  },
  {
    id: 'kstati-4',
    name: 'ОМА КСТАТИ «Уручье»',
    type: 'kstati',
    address: 'ул. Руссиянова, 7',
    coordinates: [53.9400, 27.6800],
  },
  {
    id: 'kstati-5',
    name: 'ОМА КСТАТИ «Дзержинского»',
    type: 'kstati',
    address: 'пр. Дзержинского, 55',
    coordinates: [53.8750, 27.5050],
  },
];

// ─── H3-Style Hexagonal Cells ───
function generateHex(center: [number, number], radius: number): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push([
      center[0] + radius * Math.cos(angle),
      center[1] + radius * Math.sin(angle) * 1.6,
    ]);
  }
  return points;
}

const hexRadius = 0.012;

export const hexCells: HexCell[] = [
  {
    id: 'hex-minskmir',
    district: 'Минск-Мир',
    coordinates: generateHex([53.8720, 27.5500], hexRadius),
    orderCount: 4,
    density: 'high',
  },
  {
    id: 'hex-novayaborovaya',
    district: 'Новая Боровая',
    coordinates: generateHex([53.9520, 27.6650], hexRadius),
    orderCount: 3,
    density: 'high',
  },
  {
    id: 'hex-kamennayagorka',
    district: 'Каменная Горка',
    coordinates: generateHex([53.9100, 27.4350], hexRadius),
    orderCount: 2,
    density: 'medium',
  },
  {
    id: 'hex-lebyazhy',
    district: 'Лебяжий',
    coordinates: generateHex([53.9180, 27.4800], hexRadius),
    orderCount: 1,
    density: 'low',
  },
  {
    id: 'hex-uruchye',
    district: 'Уручье',
    coordinates: generateHex([53.9450, 27.6900], hexRadius),
    orderCount: 2,
    density: 'medium',
  },
  {
    id: 'hex-malinovka',
    district: 'Малиновка',
    coordinates: generateHex([53.8550, 27.4800], hexRadius),
    orderCount: 1,
    density: 'low',
  },
];

// ─── Incoming Orders for Master View ───
export const incomingOrders: IncomingOrder[] = [
  {
    id: 'inc-1',
    type: 'single',
    district: 'Новая Боровая',
    address: 'ЖК «Новая Боровая», ул. Авиационная, 12, кв. 48',
    deviation: '+4 мин от маршрута (отклонение 400 м)',
    tasks: 'Установка смесителя для кухни с подключением фильтра',
    duration: '25 мин',
    consumablesPickup: 'Забрать готовый пакет: крепёж Fix Haus + герметик Wunder на кассе ОМА КСТАТИ «Новая Боровая» (60 сек)',
    income: 35,
    accepted: false,
  },
  {
    id: 'inc-2',
    type: 'cluster',
    district: 'Минск-Мир',
    address: 'ЖК «Минск-Мир», ул. Братская, 6, подъезд 3',
    deviation: '+12 мин от маршрута (кластер 4 квартиры в 1 подъезде)',
    tasks: 'Сифон (кв. 12) + Карниз (кв. 28) + 2 розетки (кв. 35, кв. 41)',
    duration: '1.5 часа',
    consumablesPickup: 'Пакет Fix Haus / ILLU / Wunder — готов в ОМА КСТАТИ «Минск-Мир»',
    income: 125,
    clusterDetails: '4 соседские заявки подряд за 1.5 часа: сифон, карниз, 2 розетки. Один подъезд — максимум эффективности!',
    accepted: false,
  },
];

// ─── Matching Route Points ───
export const matchingRoute = {
  masterId: 'master-1',
  points: [
    { label: 'Точка А: Объект БЦ «Титан»', coords: [53.9180, 27.6500] as [number, number], type: 'start' },
    { label: 'Точка Б: Пит-стоп ОМА КСТАТИ «Новая Боровая» (забрать герметик Wunder — 60 сек)', coords: [53.9520, 27.6650] as [number, number], type: 'pitstop' },
    { label: 'Точка В: Квартира клиента, ЖК «Новая Боровая» (отклонение 400 м / 4 мин)', coords: [53.9540, 27.6700] as [number, number], type: 'client' },
    { label: 'Точка Г: Дом мастера, Уручье', coords: [53.9450, 27.6900] as [number, number], type: 'home' },
  ],
};

// ─── Specialization Filters ───
export const specializations = [
  'Все',
  'Сантехника',
  'Электрика (ILLU)',
  'Сборка и крепёж (Fix Haus)',
  'Сад и Дача (Sato Garden)',
];
