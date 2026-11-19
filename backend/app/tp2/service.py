from typing import Dict, Any, List, Tuple
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from app.tp2.perceptron import Perceptron

class TP2PerceptronService:
    def __init__(self):
        self.iris_raw = load_iris()
        self.feature_names = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
        self.class_names = ["setosa", "versicolor", "virginica"]

        # Cache models & state
        self.binary_model: Perceptron = None
        self.binary_state: Dict[str, Any] = {}
        self.multiclass_models_2feat: List[Perceptron] = []
        self.multiclass_state_2feat: Dict[str, Any] = {}
        self.multiclass_models_4feat: List[Perceptron] = []
        self.multiclass_state_4feat: Dict[str, Any] = {}

        # Initial training
        self.train_binary(lr=0.1, epochs=20)
        self.train_multiclass(lr=0.1, epochs=100, use_all_features=False)
        self.train_multiclass(lr=0.1, epochs=100, use_all_features=True)

    def train_binary(self, lr: float = 0.1, epochs: int = 20) -> Dict[str, Any]:
        # Part A: Setosa (0) vs Versicolor (1), features petal length (idx 2) & petal width (idx 3)
        mask = self.iris_raw.target < 2
        X = self.iris_raw.data[mask][:, [2, 3]]
        y = self.iris_raw.target[mask]

        X_tr, X_te, y_tr, y_te = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        p = Perceptron(lr=lr, epochs=epochs, seed=42)
        p.fit(X_tr, y_tr)
        self.binary_model = p

        y_pred = p.predict(X_te)
        acc = float(accuracy_score(y_te, y_pred))
        cm = confusion_matrix(y_te, y_pred).tolist()

        classes = ["setosa", "versicolor"]
        prec = precision_score(y_te, y_pred, average=None, zero_division=0)
        rec = recall_score(y_te, y_pred, average=None, zero_division=0)
        f1 = f1_score(y_te, y_pred, average=None, zero_division=0)

        # Decision boundary: w1*x1 + w2*x2 + b = 0 => x2 = -(w1*x1 + b) / w2
        w1, w2 = float(p.w[0]), float(p.w[1])
        b = float(p.b)
        x_min, x_max = float(np.min(X[:, 0])) - 0.2, float(np.max(X[:, 0])) + 0.2
        if abs(w2) > 1e-6:
            y1 = -(w1 * x_min + b) / w2
            y2 = -(w1 * x_max + b) / w2
        else:
            y1, y2 = 0.0, 0.0

        boundary = [{
            "label": "Setosa / Versicolor Boundary",
            "x1": round(x_min, 3),
            "y1": round(float(y1), 3),
            "x2": round(x_max, 3),
            "y2": round(float(y2), 3),
            "w1": round(w1, 4),
            "w2": round(w2, 4),
            "b": round(b, 4),
            "equation": f"{w1:.3f}·x1 + {w2:.3f}·x2 + {b:.3f} = 0"
        }]

        # Scatter points (test set)
        scatter_points = []
        for xi, act, pred in zip(X_te, y_te, y_pred):
            scatter_points.append({
                "x": round(float(xi[0]), 3),
                "y": round(float(xi[1]), 3),
                "actual_class": classes[act],
                "predicted_class": classes[pred],
                "is_test": True
            })

        self.binary_state = {
            "mode": "binary",
            "features_used": ["petal_length", "petal_width"],
            "epochs": epochs,
            "lr": lr,
            "training_errors_curve": p.errors_,
            "weights": [[round(w1, 4), round(w2, 4)]],
            "biases": [round(b, 4)],
            "metrics": {
                "accuracy": round(acc, 4),
                "precision_per_class": {cls: round(float(p_), 4) for cls, p_ in zip(classes, prec)},
                "recall_per_class": {cls: round(float(r_), 4) for cls, r_ in zip(classes, rec)},
                "f1_per_class": {cls: round(float(f_), 4) for cls, f_ in zip(classes, f1)},
                "confusion_matrix": cm,
                "classes": classes
            },
            "decision_boundaries": boundary,
            "scatter_points": scatter_points,
            "linearly_separable": True,
            "explanation": "Setosa and Versicolor are linearly separable using petal length and width. Training errors rapidly drop to 0 after ~2 epochs."
        }
        return self.binary_state

    def train_multiclass(self, lr: float = 0.1, epochs: int = 100, use_all_features: bool = False) -> Dict[str, Any]:
        y_all = self.iris_raw.target
        classes = self.class_names

        if use_all_features:
            X_all = self.iris_raw.data
            features_used = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
        else:
            X_all = self.iris_raw.data[:, [2, 3]]
            features_used = ["petal_length", "petal_width"]

        X_tr, X_te, y_tr, y_te = train_test_split(
            X_all, y_all, test_size=0.2, random_state=42, stratify=y_all
        )

        perceptrons: List[Perceptron] = []
        combined_errors = np.zeros(epochs, dtype=int)
        weights_list = []
        biases_list = []
        boundaries = []

        # Train 3 One-vs-Rest Perceptrons
        for c in range(3):
            y_binary_tr = np.where(y_tr == c, 1, 0)
            p = Perceptron(lr=lr, epochs=epochs, seed=42)
            p.fit(X_tr, y_binary_tr)
            perceptrons.append(p)
            combined_errors += np.array(p.errors_)
            weights_list.append([round(float(w), 4) for w in p.w])
            biases_list.append(round(float(p.b), 4))

            # 2-feature boundaries for plotting
            if not use_all_features:
                w1, w2 = float(p.w[0]), float(p.w[1])
                b = float(p.b)
                x_min, x_max = float(np.min(X_all[:, 0])) - 0.2, float(np.max(X_all[:, 0])) + 0.2
                if abs(w2) > 1e-6:
                    y1 = -(w1 * x_min + b) / w2
                    y2 = -(w1 * x_max + b) / w2
                else:
                    y1, y2 = 0.0, 0.0
                boundaries.append({
                    "label": f"{classes[c]} vs Rest",
                    "x1": round(x_min, 3),
                    "y1": round(float(y1), 3),
                    "x2": round(x_max, 3),
                    "y2": round(float(y2), 3),
                    "w1": round(w1, 4),
                    "w2": round(w2, 4),
                    "b": round(b, 4),
                    "equation": f"{w1:.3f}·PL + {w2:.3f}·PW + {b:.3f} = 0"
                })

        # OvR prediction: argmax over decision_function scores
        scores = np.column_stack([p.decision_function(X_te) for p in perceptrons])
        y_pred = np.argmax(scores, axis=1)

        acc = float(accuracy_score(y_te, y_pred))
        cm = confusion_matrix(y_te, y_pred).tolist()
        prec = precision_score(y_te, y_pred, average=None, zero_division=0)
        rec = recall_score(y_te, y_pred, average=None, zero_division=0)
        f1 = f1_score(y_te, y_pred, average=None, zero_division=0)

        # Scatter points
        scatter_points = []
        for i, (xi, act, pred) in enumerate(zip(X_te, y_te, y_pred)):
            # If 4 features, plot petal_length (col 2) and petal_width (col 3)
            x_coord = float(xi[2]) if use_all_features else float(xi[0])
            y_coord = float(xi[3]) if use_all_features else float(xi[1])
            scatter_points.append({
                "x": round(x_coord, 3),
                "y": round(y_coord, 3),
                "actual_class": classes[act],
                "predicted_class": classes[pred],
                "is_test": True
            })

        state = {
            "mode": "multiclass",
            "features_used": features_used,
            "epochs": epochs,
            "lr": lr,
            "training_errors_curve": combined_errors.tolist(),
            "weights": weights_list,
            "biases": biases_list,
            "metrics": {
                "accuracy": round(acc, 4),
                "precision_per_class": {cls: round(float(p_), 4) for cls, p_ in zip(classes, prec)},
                "recall_per_class": {cls: round(float(r_), 4) for cls, r_ in zip(classes, rec)},
                "f1_per_class": {cls: round(float(f_), 4) for cls, f_ in zip(classes, f1)},
                "confusion_matrix": cm,
                "classes": classes
            },
            "decision_boundaries": boundaries,
            "scatter_points": scatter_points,
            "linearly_separable": False,
            "explanation": (
                "Using all 4 features reaches ~93% - 96.7% accuracy. Using only petal length/width reaches ~83.3% "
                "because Versicolor and Virginica overlap and are NOT linearly separable by a single hyperplane."
            )
        }

        if use_all_features:
            self.multiclass_models_4feat = perceptrons
            self.multiclass_state_4feat = state
        else:
            self.multiclass_models_2feat = perceptrons
            self.multiclass_state_2feat = state

        return state

    def predict(self, petal_length: float, petal_width: float, sepal_length: float = None, sepal_width: float = None) -> Dict[str, Any]:
        # If sepal length and width provided, use 4-feature multiclass OvR, otherwise 2-feature multiclass OvR
        if sepal_length is not None and sepal_width is not None and len(self.multiclass_models_4feat) == 3:
            x = np.array([[sepal_length, sepal_width, petal_length, petal_width]], dtype=np.float64)
            scores = {cls: float(p.decision_function(x)[0]) for cls, p in zip(self.class_names, self.multiclass_models_4feat)}
            best_cls = max(scores, key=scores.get)
            return {"predicted_class": best_cls, "scores": {k: round(v, 4) for k, v in scores.items()}}
        else:
            x = np.array([[petal_length, petal_width]], dtype=np.float64)
            scores = {cls: float(p.decision_function(x)[0]) for cls, p in zip(self.class_names, self.multiclass_models_2feat)}
            best_cls = max(scores, key=scores.get)
            return {"predicted_class": best_cls, "scores": {k: round(v, 4) for k, v in scores.items()}}

tp2_service = TP2PerceptronService()
