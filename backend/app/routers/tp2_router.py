from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.tp2.service import tp2_service
from app.schemas_tp2 import (
    PerceptronResponse,
    RetrainPerceptronRequest,
    PredictPerceptronRequest,
    PredictPerceptronResponse
)

router = APIRouter(prefix="/tp2", tags=["TP2 Perceptron from Scratch"])

@router.get("/binary", response_model=PerceptronResponse, summary="Get binary Perceptron (Setosa vs Versicolor)")
def get_binary_perceptron():
    try:
        return tp2_service.binary_state
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch binary perceptron: {str(e)}")

@router.get("/multiclass", response_model=PerceptronResponse, summary="Get multiclass OvR Perceptron")
def get_multiclass_perceptron(use_all_features: bool = False):
    try:
        if use_all_features:
            return tp2_service.multiclass_state_4feat
        return tp2_service.multiclass_state_2feat
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch multiclass perceptron: {str(e)}")

@router.post("/retrain", response_model=PerceptronResponse, summary="Retrain Perceptron with custom learning rate and epochs")
def retrain_perceptron(req: RetrainPerceptronRequest):
    try:
        if req.mode == "binary":
            return tp2_service.train_binary(lr=req.lr, epochs=req.epochs)
        else:
            return tp2_service.train_multiclass(lr=req.lr, epochs=req.epochs, use_all_features=req.use_all_features)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Perceptron retraining failed: {str(e)}")

@router.post("/predict", response_model=PredictPerceptronResponse, summary="Predict flower class using Perceptron")
def predict_perceptron(req: PredictPerceptronRequest):
    try:
        return tp2_service.predict(
            petal_length=req.petal_length,
            petal_width=req.petal_width,
            sepal_length=req.sepal_length,
            sepal_width=req.sepal_width
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Perceptron prediction failed: {str(e)}")
