from pathlib import Path

from fastapi.testclient import TestClient

from backend.app import create_app


def client_for(tmp_path: Path) -> TestClient:
    return TestClient(create_app(tmp_path / "orders.sqlite3"))


def test_all_products_are_purchased_but_only_selected_products_are_installed(tmp_path: Path) -> None:
    with client_for(tmp_path) as client:
        response = client.post("/api/v1/quotes", json={
            "product_ids": ["faucet", "chandelier", "curtainrod", "greenhouse"],
            "installation_product_ids": ["faucet", "chandelier"],
            "slot_id": "cluster",
            "use_bonus": True,
        })
    assert response.status_code == 200
    quote = response.json()
    assert quote["products_price"] == 1280
    assert [item["product_id"] for item in quote["items"]] == ["faucet", "chandelier"]
    assert quote["installation_price"] == 44.57
    assert "consumables_price" not in quote
    assert all("consumables" not in item for item in quote["items"])
    assert quote["bonus_discount"] == 7
    assert quote["total_price"] == 1317.57


def test_goods_only_order_is_saved_without_master(tmp_path: Path) -> None:
    db_path = tmp_path / "orders.sqlite3"
    payload = {
        "product_ids": ["faucet", "chandelier"],
        "address": "Минск, ул. Примерная, 1",
        "district": "Минск",
        "coordinates": [53.9, 27.56],
    }
    with TestClient(create_app(db_path)) as client:
        response = client.post("/api/v1/orders", json=payload)
        assert response.status_code == 201
        order = response.json()
        assert order["quote"]["total_price"] == 325
        assert order["quote"]["items"] == []
        assert order["assigned_master_id"] is None
        assert client.get(f"/api/v1/orders/{order['id']}").json() == order

    with TestClient(create_app(db_path)) as client:
        assert [item["id"] for item in client.get("/api/v1/orders").json()] == [order["id"]]


def test_installation_order_waits_for_master(tmp_path: Path) -> None:
    with client_for(tmp_path) as client:
        response = client.post("/api/v1/orders", json={
            "product_ids": ["faucet"],
            "installation_product_ids": ["faucet"],
            "slot_id": "commute",
            "address": "Минск, ул. Примерная, 1",
            "district": "Минск",
            "coordinates": [53.9, 27.56],
        })
    assert response.status_code == 201
    assert response.json()["status"] == "pending"
    assert response.json()["assigned_master_id"] is None


def test_rejects_installation_outside_cart_and_removed_consumables_field(tmp_path: Path) -> None:
    with client_for(tmp_path) as client:
        outside_cart = client.post("/api/v1/quotes", json={
            "product_ids": ["faucet"],
            "installation_product_ids": ["chandelier"],
            "slot_id": "commute",
        })
        old_consumables_field = client.post("/api/v1/quotes", json={
            "product_ids": ["faucet"],
            "installation_product_ids": ["faucet"],
            "consumable_ids_by_product": {"faucet": ["chandelier-terminals"]},
            "slot_id": "commute",
        })
    assert outside_cart.status_code == 422
    assert old_consumables_field.status_code == 422
