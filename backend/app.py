import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .catalog import PRODUCTS, SLOTS
from .pricing import InvalidSelection, quote
from .schemas import OrderCreate, OrderRecord, Product, QuoteRequest, QuoteResponse, TimeSlot
from .storage import OrderStorage


def create_app(db_path: Path | None = None) -> FastAPI:
    storage = OrderStorage(db_path or Path(os.environ.get("OMA_DB_PATH", "backend/data/orders.sqlite3")))

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        storage.initialize()
        yield

    app = FastAPI(title="ОМА ПО ПУТИ API", version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )
    router = APIRouter(prefix="/api/v1")

    @router.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @router.get("/products", response_model=list[Product])
    def list_products() -> tuple[Product, ...]:
        return PRODUCTS

    @router.get("/slots", response_model=list[TimeSlot])
    def list_slots() -> tuple[TimeSlot, ...]:
        return SLOTS

    @router.post("/quotes", response_model=QuoteResponse)
    def calculate_quote(request: QuoteRequest) -> QuoteResponse:
        try:
            return quote(request)
        except InvalidSelection as error:
            raise HTTPException(status_code=422, detail=str(error)) from error

    @router.post("/orders", response_model=OrderRecord, status_code=201)
    def create_order(request: OrderCreate) -> OrderRecord:
        try:
            calculated = quote(request)
        except InvalidSelection as error:
            raise HTTPException(status_code=422, detail=str(error)) from error
        order = OrderRecord(
            id=str(uuid4()),
            created_at=datetime.now(timezone.utc),
            status="pending",
            assigned_master_id=None,
            address=request.address,
            district=request.district,
            coordinates=request.coordinates,
            quote=calculated,
        )
        storage.add(order)
        return order

    @router.get("/orders", response_model=list[OrderRecord])
    def list_orders() -> list[OrderRecord]:
        return storage.list()

    @router.get("/orders/{order_id}", response_model=OrderRecord)
    def get_order(order_id: str) -> OrderRecord:
        order = storage.get(order_id)
        if order is None:
            raise HTTPException(status_code=404, detail="Заказ не найден")
        return order

    app.include_router(router)
    return app


app = create_app()
