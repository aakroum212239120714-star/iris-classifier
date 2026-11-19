import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_tp2_binary_perceptron():
    response = client.get("/tp2/binary")
    assert response.status_code == 200
    data = response.json()

    # Binary Setosa vs Versicolor must achieve 100% test accuracy
    assert data["metrics"]["accuracy"] == 1.0
    # Training errors must drop to 0 within first 2-3 epochs
    assert data["training_errors_curve"][1] == 0 or data["training_errors_curve"][2] == 0
    assert data["linearly_separable"] is True
    assert len(data["decision_boundaries"]) == 1

def test_tp2_multiclass_ovr_4_features():
    response = client.get("/tp2/multiclass?use_all_features=true")
    assert response.status_code == 200
    data = response.json()

    # OvR accuracy with 4 features >= 0.90 (reference ~93% to 96.7%)
    assert data["metrics"]["accuracy"] >= 0.90
    assert len(data["metrics"]["classes"]) == 3
    assert len(data["weights"]) == 3

def test_tp2_multiclass_ovr_2_features():
    response = client.get("/tp2/multiclass?use_all_features=false")
    assert response.status_code == 200
    data = response.json()

    # OvR accuracy with 2 features ~83%
    assert 0.78 <= data["metrics"]["accuracy"] <= 0.90
    assert data["linearly_separable"] is False
    assert len(data["decision_boundaries"]) == 3

def test_tp2_retrain_and_predict():
    # Retrain
    retrain_res = client.post("/tp2/retrain", json={
        "lr": 0.05,
        "epochs": 15,
        "mode": "binary",
        "use_all_features": False
    })
    assert retrain_res.status_code == 200
    assert retrain_res.json()["lr"] == 0.05
    assert retrain_res.json()["epochs"] == 15

    # Predict Setosa-like sample
    pred_res = client.post("/tp2/predict", json={
        "petal_length": 1.4,
        "petal_width": 0.2
    })
    assert pred_res.status_code == 200
    assert pred_res.json()["predicted_class"] == "setosa"
    assert "scores" in pred_res.json()

def test_tp2_validation_error():
    # Bad learning rate
    bad_res = client.post("/tp2/retrain", json={
        "lr": -0.1,
        "epochs": 10,
        "mode": "binary"
    })
    assert bad_res.status_code == 422
