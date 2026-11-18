import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_metrics():
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "accuracy" in data
    assert 0.0 <= data["accuracy"] <= 1.0
    assert "confusion_matrix" in data
    assert len(data["confusion_matrix"]) == 3
    assert "classification_report" in data
    assert "setosa" in data["classification_report"]
    assert "versicolor" in data["classification_report"]
    assert "virginica" in data["classification_report"]
    assert "feature_importances" in data
    assert len(data["feature_importances"]) == 4

def test_predict_setosa():
    # Canonical Setosa sample from notebook: 5.1, 3.5, 1.4, 0.2
    payload = {
        "sepal_length": 5.1,
        "sepal_width": 3.5,
        "petal_length": 1.4,
        "petal_width": 0.2
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_class"] == "setosa"
    assert data["class_index"] == 0
    assert data["probabilities"]["setosa"] > 0.8
    assert len(data["decision_path"]) >= 1

def test_predict_versicolor():
    # Versicolor typical sample: sepal: 5.7, 2.8, petal: 4.1, 1.3
    payload = {
        "sepal_length": 5.7,
        "sepal_width": 2.8,
        "petal_length": 4.1,
        "petal_width": 1.3
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_class"] == "versicolor"
    assert data["class_index"] == 1
    assert data["probabilities"]["versicolor"] > 0.5
    assert len(data["decision_path"]) >= 1

def test_predict_virginica():
    # Virginica typical sample: sepal: 6.7, 3.1, petal: 5.6, 2.4
    payload = {
        "sepal_length": 6.7,
        "sepal_width": 3.1,
        "petal_length": 5.6,
        "petal_width": 2.4
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_class"] == "virginica"
    assert data["class_index"] == 2
    assert data["probabilities"]["virginica"] > 0.5
    assert len(data["decision_path"]) >= 1

def test_predict_validation_errors():
    # Value below minimum
    bad_payload = {
        "sepal_length": 0.1,  # ge=0.5
        "sepal_width": 3.5,
        "petal_length": 1.4,
        "petal_width": 0.2
    }
    response = client.post("/predict", json=bad_payload)
    assert response.status_code == 422

    # Missing field
    missing_payload = {
        "sepal_length": 5.1,
        "sepal_width": 3.5
    }
    response = client.post("/predict", json=missing_payload)
    assert response.status_code == 422

def test_tree_endpoint():
    response = client.get("/tree")
    assert response.status_code == 200
    data = response.json()
    assert "root" in data
    assert data["root"]["id"] == 0
    assert "impurity" in data["root"]
    assert "classes" in data
    assert len(data["classes"]) == 3

def test_retrain_endpoint():
    payload = {
        "max_depth": 2,
        "criterion": "gini",
        "test_size": 0.25,
        "random_state": 42
    }
    response = client.post("/retrain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["params"]["max_depth"] == 2
    assert data["params"]["criterion"] == "gini"
    assert "accuracy" in data

    # Check tree updated with max_depth 2
    tree_res = client.get("/tree")
    assert tree_res.status_code == 200
    assert tree_res.json()["max_depth"] == 2

    # Test invalid criterion
    bad_criterion = {
        "max_depth": 3,
        "criterion": "unsupported_criterion",
        "test_size": 0.2
    }
    bad_res = client.post("/retrain", json=bad_criterion)
    assert bad_res.status_code == 422

def test_dataset_endpoint():
    response = client.get("/dataset")
    assert response.status_code == 200
    data = response.json()
    assert "samples" in data
    assert len(data["samples"]) == 150
    first = data["samples"][0]
    assert "sepal_length" in first
    assert "species" in first
