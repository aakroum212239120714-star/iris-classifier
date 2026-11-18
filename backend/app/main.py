from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import os

from app.model import model_service
from app.schemas import (
    PredictRequest,
    PredictResponse,
    RetrainRequest,
    MetricsResponse,
    TreeResponse,
    DatasetResponse
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("iris-api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Iris Decision Tree model service...")
    logger.info(f"Model initialized. Base accuracy: {model_service.metrics['accuracy']}")
    yield
    logger.info("Shutting down Iris API service.")

app = FastAPI(
    title="Iris Classifier API",
    description="Full-stack Decision Tree Machine Learning Service on the Iris Dataset",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local dev and configurable frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "iris-ml-backend"}

@app.post("/predict", response_model=PredictResponse, summary="Predict flower species")
def predict_species(req: PredictRequest):
    try:
        res = model_service.predict(
            sepal_length=req.sepal_length,
            sepal_width=req.sepal_width,
            petal_length=req.petal_length,
            petal_width=req.petal_width
        )
        return res
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Prediction failed: {str(e)}")

@app.get("/metrics", response_model=MetricsResponse, summary="Get model performance metrics")
def get_metrics():
    try:
        return model_service.metrics
    except Exception as e:
        logger.error(f"Error fetching metrics: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not retrieve metrics")

@app.get("/tree", summary="Get decision tree structure as JSON")
def get_tree():
    try:
        return model_service.get_tree_structure()
    except Exception as e:
        logger.error(f"Error parsing tree: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not retrieve tree")

@app.post("/retrain", response_model=MetricsResponse, summary="Retrain model with custom hyperparameters")
def retrain_model(req: RetrainRequest):
    try:
        metrics = model_service.train(
            criterion=req.criterion,
            max_depth=req.max_depth,
            test_size=req.test_size,
            random_state=req.random_state
        )
        return metrics
    except Exception as e:
        logger.error(f"Retraining error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Retraining failed: {str(e)}")

@app.get("/dataset", response_model=DatasetResponse, summary="Get full Iris dataset samples")
def get_dataset():
    try:
        return model_service.get_dataset()
    except Exception as e:
        logger.error(f"Error fetching dataset: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not retrieve dataset")

# Serve production frontend if built
dist_dir = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if dist_dir.exists() and (dist_dir / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=dist_dir / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        file_path = dist_dir / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(dist_dir / "index.html")
