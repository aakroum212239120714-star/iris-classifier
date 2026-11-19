export interface PredictRequest {
  sepal_length: number;
  sepal_width: number;
  petal_length: number;
  petal_width: number;
}

export interface PredictResponse {
  predicted_class: 'setosa' | 'versicolor' | 'virginica' | string;
  class_index: number;
  probabilities: Record<string, number>;
  decision_path: number[];
  input_values: {
    sepal_length: number;
    sepal_width: number;
    petal_length: number;
    petal_width: number;
  };
}

export interface RetrainRequest {
  max_depth?: number;
  criterion: 'gini' | 'entropy' | 'log_loss';
  test_size: number;
  random_state?: number;
}

export interface ClassReportMetric {
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
}

export interface MetricsResponse {
  accuracy: number;
  confusion_matrix: number[][];
  classes: string[];
  classification_report: Record<string, ClassReportMetric>;
  feature_importances: Record<string, number>;
  params: {
    criterion: string;
    max_depth: number;
    test_size: number;
    random_state: number;
  };
  train_samples_count: number;
  test_samples_count: number;
}

export interface TreeNode {
  id: number;
  feature_name?: string | null;
  feature_index?: number | null;
  threshold?: number | null;
  criterion_name: string;
  impurity: number;
  samples: number;
  values: number[];
  predicted_class: string;
  is_leaf: boolean;
  left_child_id?: number | null;
  right_child_id?: number | null;
  left?: TreeNode;
  right?: TreeNode;
}

export interface TreeResponse {
  root: TreeNode;
  classes: string[];
  features: string[];
  max_depth: number;
}

export interface IrisSample {
  sepal_length: number;
  sepal_width: number;
  petal_length: number;
  petal_width: number;
  target: number;
  species: string;
}

export interface DatasetResponse {
  features: string[];
  classes: string[];
  samples: IrisSample[];
}

export type Language = 'ar' | 'en';

// --- TP1 Types ---
export interface RegressionModelMetrics {
  model_type: string;
  mae: number;
  mse: number;
  rmse: number;
  r2: number;
  intercept: number;
  coefficients: Record<string, number>;
  equation: string;
}

export interface SLRScatterPoint {
  x: number;
  y_actual: number;
  y_pred: number;
}

export interface MLRPredPoint {
  actual: number;
  predicted: number;
}

export interface ComparisonTableRow {
  metric: string;
  slr: number;
  mlr: number;
  better: string;
}

export interface RegressionDatasetResponse {
  dataset_name: string;
  target_name: string;
  feature_names: string[];
  slr_feature: string;
  slr_metrics: RegressionModelMetrics;
  mlr_metrics: RegressionModelMetrics;
  comparison_table: ComparisonTableRow[];
  slr_scatter_train: SLRScatterPoint[];
  slr_scatter_test: SLRScatterPoint[];
  mlr_pred_actual: MLRPredPoint[];
  slr_line: {
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
  };
}

export interface PredictDiabetesRequest {
  age: number;
  sex: number;
  bmi: number;
  bp: number;
  s1: number;
  s2: number;
  s3: number;
  s4: number;
  s5: number;
  s6: number;
}

export interface PredictDiabetesResponse {
  slr_predicted: number;
  mlr_predicted: number;
}

export interface PredictIrisSepalRequest {
  sepal_width: number;
  petal_length: number;
  petal_width: number;
}

export interface PredictIrisSepalResponse {
  slr_predicted: number;
  mlr_predicted: number;
}

// --- TP2 Types ---
export interface BoundaryLine {
  label: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  w1: number;
  w2: number;
  b: number;
  equation: string;
}

export interface PerceptronScatterPoint {
  x: number;
  y: number;
  actual_class: string;
  predicted_class: string;
  is_test: boolean;
}

export interface PerceptronMetrics {
  accuracy: number;
  precision_per_class: Record<string, number>;
  recall_per_class: Record<string, number>;
  f1_per_class: Record<string, number>;
  confusion_matrix: number[][];
  classes: string[];
}

export interface PerceptronResponse {
  mode: 'binary' | 'multiclass';
  features_used: string[];
  epochs: number;
  lr: number;
  training_errors_curve: number[];
  weights: number[][];
  biases: number[];
  metrics: PerceptronMetrics;
  decision_boundaries: BoundaryLine[];
  scatter_points: PerceptronScatterPoint[];
  linearly_separable: boolean;
  explanation: string;
}

export interface RetrainPerceptronRequest {
  lr: number;
  epochs: number;
  mode: 'binary' | 'multiclass';
  use_all_features: boolean;
}

export interface PredictPerceptronRequest {
  petal_length: number;
  petal_width: number;
  sepal_length?: number;
  sepal_width?: number;
}

export interface PredictPerceptronResponse {
  predicted_class: string;
  scores: Record<string, number>;
}
