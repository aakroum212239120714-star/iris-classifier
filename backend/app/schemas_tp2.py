from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class RetrainPerceptronRequest(BaseModel):
    lr: float = Field(0.1, gt=0.0, le=5.0, description="Learning rate")
    epochs: int = Field(20, ge=1, le=500, description="Number of training epochs")
    mode: str = Field("binary", pattern="^(binary|multiclass)$", description="binary or multiclass")
    use_all_features: bool = Field(False, description="Use all 4 features for multiclass")

class BoundaryLine(BaseModel):
    label: str
    x1: float
    y1: float
    x2: float
    y2: float
    w1: float
    w2: float
    b: float
    equation: str

class PerceptronScatterPoint(BaseModel):
    x: float
    y: float
    actual_class: str
    predicted_class: str
    is_test: bool

class PerceptronMetrics(BaseModel):
    accuracy: float
    precision_per_class: Dict[str, float]
    recall_per_class: Dict[str, float]
    f1_per_class: Dict[str, float]
    confusion_matrix: List[List[int]]
    classes: List[str]

class PerceptronResponse(BaseModel):
    mode: str  # "binary" or "multiclass"
    features_used: List[str]
    epochs: int
    lr: float
    training_errors_curve: List[int]
    weights: List[List[float]]
    biases: List[float]
    metrics: PerceptronMetrics
    decision_boundaries: List[BoundaryLine]
    scatter_points: List[PerceptronScatterPoint]
    linearly_separable: bool
    explanation: str

class PredictPerceptronRequest(BaseModel):
    petal_length: float = Field(..., ge=0.1, le=12.0)
    petal_width: float = Field(..., ge=0.05, le=8.0)
    sepal_length: Optional[float] = Field(None, ge=0.5, le=15.0)
    sepal_width: Optional[float] = Field(None, ge=0.5, le=10.0)

class PredictPerceptronResponse(BaseModel):
    predicted_class: str
    scores: Dict[str, float]
