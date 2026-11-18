from typing import Dict, Any, List, Tuple
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, _tree
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

class IrisModelService:
    def __init__(self):
        self.raw_data = load_iris()
        self.feature_names = [name.replace(" (cm)", "") for name in self.raw_data.feature_names]
        # Map clean identifiers: sepal_length, sepal_width, petal_length, petal_width
        self.clean_features = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
        self.class_names = [str(cls) for cls in self.raw_data.target_names]
        
        self.model: DecisionTreeClassifier = None
        self.current_params: Dict[str, Any] = {}
        self.metrics: Dict[str, Any] = {}
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        
        # Initial training with defaults from iris.ipynb
        self.train(
            criterion="entropy",
            max_depth=3,
            test_size=0.20,
            random_state=42
        )

    def train(self, criterion: str = "entropy", max_depth: int = 3, test_size: float = 0.20, random_state: int = 42) -> Dict[str, Any]:
        X = self.raw_data.data
        y = self.raw_data.target

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=test_size,
            random_state=random_state,
            stratify=y
        )

        model = DecisionTreeClassifier(
            criterion=criterion,
            max_depth=max_depth,
            random_state=random_state
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        acc = float(accuracy_score(y_test, y_pred))
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        report_dict = classification_report(
            y_test,
            y_pred,
            target_names=self.class_names,
            output_dict=True,
            zero_division=0
        )

        clean_report = {}
        for cls in self.class_names:
            clean_report[cls] = {
                "precision": round(float(report_dict[cls]["precision"]), 4),
                "recall": round(float(report_dict[cls]["recall"]), 4),
                "f1_score": round(float(report_dict[cls]["f1-score"]), 4),
                "support": int(report_dict[cls]["support"])
            }

        feat_importances = {}
        for name, imp in zip(self.clean_features, model.feature_importances_):
            feat_importances[name] = round(float(imp), 4)

        self.model = model
        self.X_train = X_train
        self.X_test = X_test
        self.y_train = y_train
        self.y_test = y_test
        self.current_params = {
            "criterion": criterion,
            "max_depth": max_depth,
            "test_size": test_size,
            "random_state": random_state
        }
        self.metrics = {
            "accuracy": round(acc, 4),
            "confusion_matrix": cm,
            "classes": self.class_names,
            "classification_report": clean_report,
            "feature_importances": feat_importances,
            "params": self.current_params,
            "train_samples_count": len(X_train),
            "test_samples_count": len(X_test)
        }
        return self.metrics

    def predict(self, sepal_length: float, sepal_width: float, petal_length: float, petal_width: float) -> Dict[str, Any]:
        features = np.array([[sepal_length, sepal_width, petal_length, petal_width]], dtype=np.float64)
        pred_idx = int(self.model.predict(features)[0])
        probabilities = self.model.predict_proba(features)[0]

        # Extract decision path node IDs
        decision_path_csr = self.model.decision_path(features)
        node_indices = [int(idx) for idx in decision_path_csr.indices]

        prob_dict = {
            cls_name: round(float(prob), 4)
            for cls_name, prob in zip(self.class_names, probabilities)
        }

        return {
            "predicted_class": self.class_names[pred_idx],
            "class_index": pred_idx,
            "probabilities": prob_dict,
            "decision_path": node_indices,
            "input_values": {
                "sepal_length": sepal_length,
                "sepal_width": sepal_width,
                "petal_length": petal_length,
                "petal_width": petal_width
            }
        }

    def get_tree_structure(self) -> Dict[str, Any]:
        tree_ = self.model.tree_
        feature_names = self.clean_features
        class_names = self.class_names

        def recurse(node_id: int) -> Dict[str, Any]:
            is_leaf = tree_.children_left[node_id] == _tree.TREE_LEAF
            values = tree_.value[node_id][0].tolist()
            pred_class_idx = int(np.argmax(values))
            pred_class = class_names[pred_class_idx]
            
            node_data = {
                "id": int(node_id),
                "criterion_name": self.current_params.get("criterion", "entropy"),
                "impurity": round(float(tree_.impurity[node_id]), 4),
                "samples": int(tree_.n_node_samples[node_id]),
                "values": [round(float(v), 2) for v in values],
                "predicted_class": pred_class,
                "is_leaf": bool(is_leaf)
            }

            if not is_leaf:
                f_idx = int(tree_.feature[node_id])
                node_data["feature_index"] = f_idx
                node_data["feature_name"] = feature_names[f_idx]
                node_data["threshold"] = round(float(tree_.threshold[node_id]), 4)
                node_data["left_child_id"] = int(tree_.children_left[node_id])
                node_data["right_child_id"] = int(tree_.children_right[node_id])
                node_data["left"] = recurse(tree_.children_left[node_id])
                node_data["right"] = recurse(tree_.children_right[node_id])
            else:
                node_data["feature_index"] = None
                node_data["feature_name"] = None
                node_data["threshold"] = None
                node_data["left_child_id"] = None
                node_data["right_child_id"] = None

            return node_data

        root = recurse(0)
        return {
            "root": root,
            "classes": self.class_names,
            "features": self.clean_features,
            "max_depth": self.current_params.get("max_depth", 3)
        }

    def get_dataset(self) -> Dict[str, Any]:
        samples = []
        for i in range(len(self.raw_data.data)):
            row = self.raw_data.data[i]
            tgt = int(self.raw_data.target[i])
            samples.append({
                "sepal_length": float(row[0]),
                "sepal_width": float(row[1]),
                "petal_length": float(row[2]),
                "petal_width": float(row[3]),
                "target": tgt,
                "species": self.class_names[tgt]
            })
        return {
            "features": self.clean_features,
            "classes": self.class_names,
            "samples": samples
        }

model_service = IrisModelService()
