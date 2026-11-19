from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.tp1.regression import tp1_service
from app.schemas_tp1 import (
    RegressionDatasetResponse,
    PredictDiabetesRequest,
    PredictDiabetesResponse,
    PredictIrisSepalRequest,
    PredictIrisSepalResponse
)

router = APIRouter(prefix="/tp1", tags=["TP1 Linear Regression"])

@router.get("/diabetes", response_model=RegressionDatasetResponse, summary="Get Diabetes dataset regression results")
def get_diabetes_regression():
    try:
        return tp1_service.get_diabetes_results()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch diabetes regression results: {str(e)}")

@router.get("/iris-regression", response_model=RegressionDatasetResponse, summary="Get Iris sepal length regression results")
def get_iris_regression():
    try:
        return tp1_service.get_iris_regression_results()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch iris regression results: {str(e)}")

@router.post("/predict-diabetes", response_model=PredictDiabetesResponse, summary="Predict diabetes disease progression")
def predict_diabetes(req: PredictDiabetesRequest):
    try:
        feats = [req.age, req.sex, req.bmi, req.bp, req.s1, req.s2, req.s3, req.s4, req.s5, req.s6]
        return tp1_service.predict_diabetes(feats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diabetes prediction failed: {str(e)}")

@router.post("/predict-iris-sepal", response_model=PredictIrisSepalResponse, summary="Predict iris sepal length")
def predict_iris_sepal(req: PredictIrisSepalRequest):
    try:
        return tp1_service.predict_iris_sepal(
            sepal_width=req.sepal_width,
            petal_length=req.petal_length,
            petal_width=req.petal_width
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Iris sepal length prediction failed: {str(e)}")
