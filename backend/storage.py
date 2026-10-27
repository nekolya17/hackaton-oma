import json
import sqlite3
from pathlib import Path

from .schemas import OrderRecord


class OrderStorage:
    def __init__(self, db_path: Path):
        self.db_path = db_path

    def initialize(self) -> None:
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with sqlite3.connect(self.db_path) as connection:
            connection.execute("CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, payload TEXT NOT NULL)")

    def add(self, order: OrderRecord) -> None:
        with sqlite3.connect(self.db_path) as connection:
            connection.execute(
                "INSERT INTO orders (id, created_at, payload) VALUES (?, ?, ?)",
                (order.id, order.created_at.isoformat(), json.dumps(order.model_dump(mode="json"), ensure_ascii=False)),
            )

    def get(self, order_id: str) -> OrderRecord | None:
        with sqlite3.connect(self.db_path) as connection:
            row = connection.execute("SELECT payload FROM orders WHERE id = ?", (order_id,)).fetchone()
        return OrderRecord.model_validate_json(row[0]) if row else None

    def list(self) -> list[OrderRecord]:
        with sqlite3.connect(self.db_path) as connection:
            rows = connection.execute("SELECT payload FROM orders ORDER BY created_at DESC").fetchall()
        return [OrderRecord.model_validate_json(row[0]) for row in rows]
