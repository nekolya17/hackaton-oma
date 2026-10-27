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
            "consumable_ids_by_product": {"faucet": ["faucet-fasteners", "faucet-sealant"]},
            "slot_id": "cluster",
            "use_bonus": True,
        })
    assert response.status_code == 200
    quote = response.json()
    assert quote["products_price"] == 1280
    assert [item["product_id"] for item in quote["items"]] == ["faucet", "chandelier"]
    assert quote["installation_price"] == 44.57
    assert quote["consumables_price"] == 4.90
    assert quote["bonus_discount"] == 7
    assert quote["total_price"] == 1322.47


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


def test_rejects_installation_outside_cart_and_unknown_consumables(tmp_path: Path) -> None:
    with client_for(tmp_path) as client:
        outside_cart = client.post("/api/v1/quotes", json={
            "product_ids": ["faucet"],
            "installation_product_ids": ["chandelier"],
            "slot_id": "commute",
        })
        unknown_consumable = client.post("/api/v1/quotes", json={
            "product_ids": ["faucet"],
            "installation_product_ids": ["faucet"],
            "consumable_ids_by_product": {"faucet": ["chandelier-terminals"]},
            "slot_id": "commute",
        })
    assert outside_cart.status_code == 422
    assert unknown_consumable.status_code == 422
