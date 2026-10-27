from .schemas import Product, TimeSlot


PRODUCTS = (
    Product(
        id="faucet",
        name="Смеситель для кухни с выдвижным изливом + Фильтр под мойку",
        price=185,
        installation_price=35,
        market_price=95,
        category="Сантехника",
        icon="🚰",
    ),
    Product(
        id="chandelier",
        name="Люстра потолочная ILLU с LED-модулем",
        price=140,
        installation_price=30,
        market_price=80,
        category="Электрика (ILLU)",
        icon="💡",
    ),
    Product(
        id="curtainrod",
        name="Карниз металлический 240 см Penta Style",
        price=65,
        installation_price=25,
        market_price=60,
        category="Сборка и крепёж (Fix Haus)",
        icon="🪟",
    ),
    Product(
        id="greenhouse",
        name="Теплица из поликарбоната Sato Garden 3×6 м",
        price=890,
        installation_price=120,
        market_price=350,
        category="Сад и Дача (Sato Garden)",
        icon="🌿",
    ),
)

SLOTS = (
    TimeSlot(id="commute", label="Сегодня, 18:00–20:00 · Попутный мастер", installation_multiplier=1),
    TimeSlot(id="cluster", label="Завтра, 19:00 · Вместе с соседями", installation_multiplier=24 / 35),
)

PRODUCT_BY_ID = {product.id: product for product in PRODUCTS}
SLOT_BY_ID = {slot.id: slot for slot in SLOTS}
