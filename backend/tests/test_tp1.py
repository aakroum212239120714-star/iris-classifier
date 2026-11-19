import pytest
import math
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_tp1_diabetes_metrics():
    response = client.get("/tp1/diabetes")
    assert response.status_code == 200
    data = response.json()
    
    # Reference results check (tolerance 1e-2):
    # Diabetes SLR(BMI): MAE 52.26, MSE 4061.8, RMSE 63.73, R2 0.2334
    # Diabetes MLR:      MAE 42.79, MSE 2900.2, RMSE 53.85, R2 0.4526
    slr = data["slr_metrics"]
    mlr = data["mlr_metrics"]

    assert math.isclose(slr["mae"], 52.26, abs_tol=0.05)
    assert math.isclose(slr["mse"], 4061.8, abs_tol=0.5)
    assert math.isclose(slr["rmse"], 63.73, abs_tol=0.05)
    assert math.isclose(slr["r2"], 0.2334, abs_tol=0.01)

    assert math.isclose(mlr["mae"], 42.79, abs_tol=0.05)
    assert math.isclose(mlr["mse"], 2900.2, abs_tol=0.5)
    assert math.isclose(mlr["rmse"], 53.85, abs_tol=0.05)
    assert math.isclose(mlr["r2"], 0.4526, abs_tol=0.01)

    assert len(data["comparison_table"]) == 4
    assert len(data["slr_scatter_test"]) > 0

def test_tp1_iris_metrics():
    response = client.get("/tp1/iris-regression")
    assert response.status_code == 200
    data = response.json()

    # Reference results check:
    # Iris SLR: MAE 0.265, MSE 0.129, RMSE 0.359, R2 0.813
    # Iris MLR: MAE 0.234, MSE 0.102, RMSE 0.320, R2 0.852
    slr = data["slr_metrics"]
    mlr = data["mlr_metrics"]

    assert math.isclose(slr["mae"], 0.265, abs_tol=0.01)
    assert math.isclose(slr["mse"], 0.129, abs_tol=0.01)
    assert math.isclose(slr["rmse"], 0.359, abs_tol=0.01)
    assert math.isclose(slr["r2"], 0.813, abs_tol=0.01)

    assert math.isclose(mlr["mae"], 0.234, abs_tol=0.01)
    assert math.isclose(mlr["mse"], 0.102, abs_tol=0.01)
    assert math.isclose(mlr["rmse"], 0.320, abs_tol=0.01)
    assert math.isclose(mlr["r2"], 0.852, abs_tol=0.01)

    # Sepal length must NOT be in the MLR features
    assert "sepal_length" not in data["feature_names"]
    assert "sepal_length" not in mlr["coefficients"]

def test_tp1_predictions():
    # Diabetes prediction
    res_diab = client.post("/tp1/predict-diabetes", json={
        "age": 0.038, "sex": 0.050, "bmi": 0.061, "bp": 0.021,
        "s1": -0.044, "s2": -0.034, "s3": -0.043, "s4": -0.002,
        "s5": 0.019, "s6": -0.017
    })
    assert res_diab.status_code == 200
    assert "slr_predicted" in res_diab.json()
    assert "mlr_predicted" in res_diab.json()

    # Iris Sepal prediction
    res_iris = client.post("/tp1/predict-iris-sepal", json={
        "sepal_width": 3.5,
        "petal_length": 1.4,
        "petal_width": 0.2
    })
    assert res_iris.status_code == 200
    pred = res_iris.json()
    assert 4.0 <= pred["slr_predicted"] <= 6.5
    assert 4.0 <= pred["mlr_predicted"] <= 6.5
