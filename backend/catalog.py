from .schemas import Consumable, Product, TimeSlot


PRODUCTS = (
    Product(
        id="faucet",
        name="Смеситель для кухни с выдвижным изливом + Фильтр под мойку",
        price=185,
        installation_price=35,
        market_price=95,
        category="Сантехника",
        icon="🚰",
        consumables=[
            Consumable(id="faucet-fasteners", name="Крепёж Fix Haus", price=2.40),
            Consumable(id="faucet-tape", name="ФУМ-лента", price=1.60),
            Consumable(id="faucet-sealant", name="Герметик Wunder", price=2.50),
        ],
    ),
    Product(
        id="chandelier",
        name="Люстра потолочная ILLU с LED-модулем",
        price=140,
        installation_price=30,
        market_price=80,
        category="Электрика (ILLU)",
        icon="💡",
        consumables=[
            Consumable(id="chandelier-dowels", name="Потолочные дюбели и крюк Fix Haus", price=1.80),
            Consumable(id="chandelier-terminals", name="Клеммы ILLU", price=2.40),
        ],
    ),
    Product(
        id="curtainrod",
        name="Карниз металлический 240 см Penta Style",
        price=65,
        installation_price=25,
        market_price=60,
        category="Сборка и крепёж (Fix Haus)",
        icon="🪟",
        consumables=[
            Consumable(id="curtain-brackets", name="Кронштейны Fix Haus", price=3.20),
            Consumable(id="curtain-anchors", name="Анкеры Fix Haus", price=2.60),
        ],
    ),
    Product(
        id="greenhouse",
        name="Теплица из поликарбоната Sato Garden 3×6 м",
        price=890,
        installation_price=120,
        market_price=350,
        category="Сад и Дача (Sato Garden)",
        icon="🌿",
        consumables=[
            Consumable(id="greenhouse-pins", name="Фундаментные колышки Werker", price=8.90),
            Consumable(id="greenhouse-screws", name="Саморезы Fix Haus", price=4.50),
            Consumable(id="greenhouse-seal", name="Уплотнитель Wunder", price=5.50),
        ],
    ),
)

SLOTS = (
    TimeSlot(id="commute", label="Сегодня, 18:00–20:00 · Попутный мастер", installation_multiplier=1),
    TimeSlot(id="cluster", label="Завтра, 19:00 · Вместе с соседями", installation_multiplier=24 / 35),
)

PRODUCT_BY_ID = {product.id: product for product in PRODUCTS}
SLOT_BY_ID = {slot.id: slot for slot in SLOTS}
