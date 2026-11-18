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
