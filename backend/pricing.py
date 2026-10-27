from decimal import Decimal, ROUND_HALF_UP

from .catalog import PRODUCT_BY_ID, SLOT_BY_ID
from .schemas import InstallationItem, QuoteRequest, QuoteResponse


class InvalidSelection(ValueError):
    pass


def cents(value: float | Decimal) -> int:
    return int((Decimal(str(value)) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def money(value_in_cents: int) -> float:
    return value_in_cents / 100


def quote(request: QuoteRequest) -> QuoteResponse:
    purchased = request.product_ids
    installed = request.installation_product_ids

    if len(purchased) != len(set(purchased)) or len(installed) != len(set(installed)):
        raise InvalidSelection("Товары не должны повторяться")
    if any(product_id not in PRODUCT_BY_ID for product_id in purchased):
        raise InvalidSelection("В корзине есть неизвестный товар")
    if not set(installed).issubset(purchased):
        raise InvalidSelection("Для установки можно выбрать только товары из корзины")
    if installed and not request.slot_id:
        raise InvalidSelection("Для установки нужно выбрать время")
    if not installed and (request.slot_id or request.use_bonus):
        raise InvalidSelection("Без установки слот и бонусы не применяются")

    products_price = sum(cents(PRODUCT_BY_ID[product_id].price) for product_id in purchased)
    installation_price = 0
    items: list[InstallationItem] = []
    multiplier = Decimal(str(SLOT_BY_ID[request.slot_id].installation_multiplier)) if request.slot_id else Decimal(0)

    for product_id in installed:
        product = PRODUCT_BY_ID[product_id]
        item_installation = int((Decimal(cents(product.installation_price)) * multiplier).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
        installation_price += item_installation
        items.append(InstallationItem(product_id=product_id, installation_price=money(item_installation)))

    bonus_discount = min(700, installation_price * 20 // 100) if request.use_bonus else 0
    return QuoteResponse(
        product_ids=purchased,
        items=items,
        slot_id=request.slot_id,
        products_price=money(products_price),
        installation_price=money(installation_price),
        bonus_discount=money(bonus_discount),
        total_price=money(products_price + installation_price - bonus_discount),
    )
