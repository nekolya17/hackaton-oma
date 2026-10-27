from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class Product(BaseModel):
    id: str
    name: str
    price: float
    installation_price: float
    market_price: float
    category: str
    icon: str


class TimeSlot(BaseModel):
    id: Literal["commute", "cluster"]
    label: str
    installation_multiplier: float


class QuoteRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    product_ids: list[str] = Field(min_length=1)
    installation_product_ids: list[str] = Field(default_factory=list)
    slot_id: Literal["commute", "cluster"] | None = None
    use_bonus: bool = False


class InstallationItem(BaseModel):
    product_id: str
    installation_price: float


class QuoteResponse(BaseModel):
    product_ids: list[str]
    items: list[InstallationItem]
    slot_id: str | None
    products_price: float
    installation_price: float
    bonus_discount: float
    total_price: float


class OrderCreate(QuoteRequest):
    address: str = Field(min_length=3)
    district: str = Field(min_length=2)
    coordinates: tuple[float, float]


class OrderRecord(BaseModel):
    id: str
    created_at: datetime
    status: Literal["pending", "assigned", "in-progress", "completed"]
    assigned_master_id: str | None
    address: str
    district: str
    coordinates: tuple[float, float]
    quote: QuoteResponse
