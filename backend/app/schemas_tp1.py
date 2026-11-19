from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class RegressionModelMetrics(BaseModel):
    model_type: str  # "Simple Linear Regression" or "Multiple Linear Regression"
    mae: float
    mse: float
    rmse: float
    r2: float
    intercept: float
    coefficients: Dict[str, float]
    equation: str

class SLRScatterPoint(BaseModel):
    x: float
    y_actual: float
    y_pred: float

class MLRPredPoint(BaseModel):
    actual: float
    predicted: float

class RegressionDatasetResponse(BaseModel):
    dataset_name: str
    target_name: str
    feature_names: List[str]
    slr_feature: str
    slr_metrics: RegressionModelMetrics
    mlr_metrics: RegressionModelMetrics
    comparison_table: List[Dict[str, Any]]
    slr_scatter_train: List[SLRScatterPoint]
    slr_scatter_test: List[SLRScatterPoint]
    mlr_pred_actual: List[MLRPredPoint]
    slr_line: Dict[str, float]  # min_x, max_x, min_y, max_y

class PredictDiabetesRequest(BaseModel):
    age: float = Field(..., description="Age")
    sex: float = Field(..., description="Sex")
    bmi: float = Field(..., description="Body mass index")
    bp: float = Field(..., description="Average blood pressure")
    s1: float = Field(..., description="Total serum cholesterol")
    s2: float = Field(..., description="Low-density lipoproteins")
    s3: float = Field(..., description="High-density lipoproteins")
    s4: float = Field(..., description="Total cholesterol / HDL")
    s5: float = Field(..., description="Log of serum triglycerides level")
    s6: float = Field(..., description="Blood sugar level")

class PredictDiabetesResponse(BaseModel):
    slr_predicted: float
    mlr_predicted: float

class PredictIrisSepalRequest(BaseModel):
    sepal_width: float = Field(..., ge=0.5, le=10.0, description="Sepal width in cm")
    petal_length: float = Field(..., ge=0.1, le=12.0, description="Petal length in cm")
    petal_width: float = Field(..., ge=0.05, le=8.0, description="Petal width in cm")

class PredictIrisSepalResponse(BaseModel):
    slr_predicted: float
    mlr_predicted: float
