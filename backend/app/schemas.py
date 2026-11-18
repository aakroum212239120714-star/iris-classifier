from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PredictRequest(BaseModel):
    sepal_length: float = Field(..., ge=0.5, le=15.0, description="Sepal length in cm", examples=[5.1])
    sepal_width: float = Field(..., ge=0.5, le=10.0, description="Sepal width in cm", examples=[3.5])
    petal_length: float = Field(..., ge=0.1, le=12.0, description="Petal length in cm", examples=[1.4])
    petal_width: float = Field(..., ge=0.05, le=8.0, description="Petal width in cm", examples=[0.2])

class PredictResponse(BaseModel):
    predicted_class: str
    class_index: int
    probabilities: Dict[str, float]
    decision_path: List[int]
    input_values: Dict[str, float]

class RetrainRequest(BaseModel):
    max_depth: Optional[int] = Field(3, ge=1, le=10, description="Maximum tree depth")
    criterion: str = Field("entropy", pattern="^(gini|entropy|log_loss)$", description="Split criterion")
    test_size: float = Field(0.20, ge=0.1, le=0.5, description="Proportion of test split")
    random_state: int = Field(42, description="Random seed")

class ClassReportMetric(BaseModel):
    precision: float
    recall: float
    f1_score: float
    support: int

class MetricsResponse(BaseModel):
    accuracy: float
    confusion_matrix: List[List[int]]
    classes: List[str]
    classification_report: Dict[str, ClassReportMetric]
    feature_importances: Dict[str, float]
    params: Dict[str, Any]
    train_samples_count: int
    test_samples_count: int

class TreeNode(BaseModel):
    id: int
    feature_name: Optional[str] = None
    feature_index: Optional[int] = None
    threshold: Optional[float] = None
    criterion_name: str
    impurity: float
    samples: int
    values: List[float]
    predicted_class: str
    is_leaf: bool
    left_child_id: Optional[int] = None
    right_child_id: Optional[int] = None

class TreeResponse(BaseModel):
    root: TreeNode
    classes: List[str]
    features: List[str]
    max_depth: int

class IrisSample(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float
    target: int
    species: str

class DatasetResponse(BaseModel):
    features: List[str]
    classes: List[str]
    samples: List[IrisSample]
