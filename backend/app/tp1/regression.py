from typing import Dict, Any, List
import numpy as np
from sklearn.datasets import load_diabetes, load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

class TP1RegressionService:
    def __init__(self):
        # Load and prepare Diabetes
        self.diabetes_raw = load_diabetes()
        self.diabetes_feature_names = list(self.diabetes_raw.feature_names)  # 10 features, index 2 is 'bmi'
        
        # Load and prepare Iris for regression (predicting sepal length, index 0)
        self.iris_raw = load_iris()
        # Features for sepal length prediction are: sepal_width (1), petal_length (2), petal_width (3)
        self.iris_mlr_features = ["sepal_width", "petal_length", "petal_width"]
        
        self._train_models()

    def _train_models(self):
        # 1. Diabetes
        X_d = self.diabetes_raw.data
        y_d = self.diabetes_raw.target
        self.X_d_tr, self.X_d_te, self.y_d_tr, self.y_d_te = train_test_split(
            X_d, y_d, test_size=0.2, random_state=42
        )
        # Diabetes SLR (BMI is index 2)
        self.d_slr = LinearRegression().fit(self.X_d_tr[:, [2]], self.y_d_tr)
        # Diabetes MLR (all 10)
        self.d_mlr = LinearRegression().fit(self.X_d_tr, self.y_d_tr)

        # 2. Iris regression on Sepal Length
        # target = iris.data[:, 0]
        # features = iris.data[:, 1:]
        X_i_features = self.iris_raw.data[:, 1:]
        y_i_target = self.iris_raw.data[:, 0]
        self.X_i_tr, self.X_i_te, self.y_i_tr, self.y_i_te = train_test_split(
            X_i_features, y_i_target, test_size=0.2, random_state=42
        )
        # Iris SLR: Petal Length (index 2 in original iris, which is index 1 in X_i_features)
        self.i_slr = LinearRegression().fit(self.X_i_tr[:, [1]], self.y_i_tr)
        # Iris MLR: sepal_width, petal_length, petal_width
        self.i_mlr = LinearRegression().fit(self.X_i_tr, self.y_i_tr)

    def get_diabetes_results(self) -> Dict[str, Any]:
        # SLR Metrics
        y_te_pred_slr = self.d_slr.predict(self.X_d_te[:, [2]])
        mae_slr = float(mean_absolute_error(self.y_d_te, y_te_pred_slr))
        mse_slr = float(mean_squared_error(self.y_d_te, y_te_pred_slr))
        rmse_slr = float(np.sqrt(mse_slr))
        r2_slr = float(r2_score(self.y_d_te, y_te_pred_slr))
        slope_slr = float(self.d_slr.coef_[0])
        intercept_slr = float(self.d_slr.intercept_)

        # MLR Metrics
        y_te_pred_mlr = self.d_mlr.predict(self.X_d_te)
        mae_mlr = float(mean_absolute_error(self.y_d_te, y_te_pred_mlr))
        mse_mlr = float(mean_squared_error(self.y_d_te, y_te_pred_mlr))
        rmse_mlr = float(np.sqrt(mse_mlr))
        r2_mlr = float(r2_score(self.y_d_te, y_te_pred_mlr))
        intercept_mlr = float(self.d_mlr.intercept_)
        coeffs_mlr = {name: round(float(c), 4) for name, c in zip(self.diabetes_feature_names, self.d_mlr.coef_)}

        # SLR Scatter points
        slr_scatter_test = [
            {"x": round(float(x), 4), "y_actual": round(float(y), 2), "y_pred": round(float(yp), 2)}
            for x, y, yp in zip(self.X_d_te[:, 2], self.y_d_te, y_te_pred_slr)
        ]
        # Line endpoints for plot
        x_min, x_max = float(np.min(self.X_d_tr[:, 2])), float(np.max(self.X_d_tr[:, 2]))
        line_data = {
            "x_min": x_min,
            "y_min": round(slope_slr * x_min + intercept_slr, 2),
            "x_max": x_max,
            "y_max": round(slope_slr * x_max + intercept_slr, 2),
        }

        # MLR actual vs predicted
        mlr_points = [
            {"actual": round(float(act), 2), "predicted": round(float(pred), 2)}
            for act, pred in zip(self.y_d_te, y_te_pred_mlr)
        ]

        comparison_table = [
            {"metric": "MAE", "slr": round(mae_slr, 2), "mlr": round(mae_mlr, 2), "better": "MLR" if mae_mlr < mae_slr else "SLR"},
            {"metric": "MSE", "slr": round(mse_slr, 1), "mlr": round(mse_mlr, 1), "better": "MLR" if mse_mlr < mse_slr else "SLR"},
            {"metric": "RMSE", "slr": round(rmse_slr, 2), "mlr": round(rmse_mlr, 2), "better": "MLR" if rmse_mlr < rmse_slr else "SLR"},
            {"metric": "R² Score", "slr": round(r2_slr, 4), "mlr": round(r2_mlr, 4), "better": "MLR" if r2_mlr > r2_slr else "SLR"},
        ]

        return {
            "dataset_name": "Diabetes (load_diabetes)",
            "target_name": "Disease Progression (Quantitative)",
            "feature_names": self.diabetes_feature_names,
            "slr_feature": "bmi",
            "slr_metrics": {
                "model_type": "Simple Linear Regression (BMI)",
                "mae": round(mae_slr, 2),
                "mse": round(mse_slr, 1),
                "rmse": round(rmse_slr, 2),
                "r2": round(r2_slr, 4),
                "intercept": round(intercept_slr, 2),
                "coefficients": {"bmi": round(slope_slr, 2)},
                "equation": f"Target = {slope_slr:.2f} × BMI + {intercept_slr:.2f}"
            },
            "mlr_metrics": {
                "model_type": "Multiple Linear Regression (All 10 features)",
                "mae": round(mae_mlr, 2),
                "mse": round(mse_mlr, 1),
                "rmse": round(rmse_mlr, 2),
                "r2": round(r2_mlr, 4),
                "intercept": round(intercept_mlr, 2),
                "coefficients": coeffs_mlr,
                "equation": f"Target = Σ(w_i × x_i) + {intercept_mlr:.2f}"
            },
            "comparison_table": comparison_table,
            "slr_scatter_train": [],
            "slr_scatter_test": slr_scatter_test,
            "mlr_pred_actual": mlr_points,
            "slr_line": line_data
        }

    def get_iris_regression_results(self) -> Dict[str, Any]:
        # SLR: Petal Length (index 1 of X_i_te) -> Sepal Length
        y_te_pred_slr = self.i_slr.predict(self.X_i_te[:, [1]])
        mae_slr = float(mean_absolute_error(self.y_i_te, y_te_pred_slr))
        mse_slr = float(mean_squared_error(self.y_i_te, y_te_pred_slr))
        rmse_slr = float(np.sqrt(mse_slr))
        r2_slr = float(r2_score(self.y_i_te, y_te_pred_slr))
        slope_slr = float(self.i_slr.coef_[0])
        intercept_slr = float(self.i_slr.intercept_)

        # MLR: sepal_width, petal_length, petal_width
        y_te_pred_mlr = self.i_mlr.predict(self.X_i_te)
        mae_mlr = float(mean_absolute_error(self.y_i_te, y_te_pred_mlr))
        mse_mlr = float(mean_squared_error(self.y_i_te, y_te_pred_mlr))
        rmse_mlr = float(np.sqrt(mse_mlr))
        r2_mlr = float(r2_score(self.y_i_te, y_te_pred_mlr))
        intercept_mlr = float(self.i_mlr.intercept_)
        coeffs_mlr = {name: round(float(c), 4) for name, c in zip(self.iris_mlr_features, self.i_mlr.coef_)}

        # SLR Scatter points
        slr_scatter_test = [
            {"x": round(float(x), 3), "y_actual": round(float(y), 3), "y_pred": round(float(yp), 3)}
            for x, y, yp in zip(self.X_i_te[:, 1], self.y_i_te, y_te_pred_slr)
        ]
        x_min, x_max = float(np.min(self.X_i_tr[:, 1])), float(np.max(self.X_i_tr[:, 1]))
        line_data = {
            "x_min": x_min,
            "y_min": round(slope_slr * x_min + intercept_slr, 3),
            "x_max": x_max,
            "y_max": round(slope_slr * x_max + intercept_slr, 3),
        }

        # MLR points
        mlr_points = [
            {"actual": round(float(act), 3), "predicted": round(float(pred), 3)}
            for act, pred in zip(self.y_i_te, y_te_pred_mlr)
        ]

        comparison_table = [
            {"metric": "MAE", "slr": round(mae_slr, 3), "mlr": round(mae_mlr, 3), "better": "MLR" if mae_mlr < mae_slr else "SLR"},
            {"metric": "MSE", "slr": round(mse_slr, 3), "mlr": round(mse_mlr, 3), "better": "MLR" if mse_mlr < mse_slr else "SLR"},
            {"metric": "RMSE", "slr": round(rmse_slr, 3), "mlr": round(rmse_mlr, 3), "better": "MLR" if rmse_mlr < rmse_slr else "SLR"},
            {"metric": "R² Score", "slr": round(r2_slr, 3), "mlr": round(r2_mlr, 3), "better": "MLR" if r2_mlr > r2_slr else "SLR"},
        ]

        return {
            "dataset_name": "Iris (Sepal Length Target)",
            "target_name": "Sepal Length (cm)",
            "feature_names": self.iris_mlr_features,
            "slr_feature": "petal_length",
            "slr_metrics": {
                "model_type": "Simple Linear Regression (Petal Length)",
                "mae": round(mae_slr, 3),
                "mse": round(mse_slr, 3),
                "rmse": round(rmse_slr, 3),
                "r2": round(r2_slr, 3),
                "intercept": round(intercept_slr, 3),
                "coefficients": {"petal_length": round(slope_slr, 3)},
                "equation": f"Sepal Length = {slope_slr:.3f} × Petal Length + {intercept_slr:.3f}"
            },
            "mlr_metrics": {
                "model_type": "Multiple Linear Regression (Sepal Width, Petal Length, Petal Width)",
                "mae": round(mae_mlr, 3),
                "mse": round(mse_mlr, 3),
                "rmse": round(rmse_mlr, 3),
                "r2": round(r2_mlr, 3),
                "intercept": round(intercept_mlr, 3),
                "coefficients": coeffs_mlr,
                "equation": f"Sepal Length = {coeffs_mlr['sepal_width']:.3f}·SW + {coeffs_mlr['petal_length']:.3f}·PL + {coeffs_mlr['petal_width']:.3f}·PW + {intercept_mlr:.3f}"
            },
            "comparison_table": comparison_table,
            "slr_scatter_train": [],
            "slr_scatter_test": slr_scatter_test,
            "mlr_pred_actual": mlr_points,
            "slr_line": line_data
        }

    def predict_diabetes(self, features: List[float]) -> Dict[str, float]:
        X = np.array([features], dtype=np.float64)
        slr_pred = float(self.d_slr.predict(X[:, [2]])[0])
        mlr_pred = float(self.d_mlr.predict(X)[0])
        return {"slr_predicted": round(slr_pred, 2), "mlr_predicted": round(mlr_pred, 2)}

    def predict_iris_sepal(self, sepal_width: float, petal_length: float, petal_width: float) -> Dict[str, float]:
        # X: [sepal_width, petal_length, petal_width]
        X = np.array([[sepal_width, petal_length, petal_width]], dtype=np.float64)
        slr_pred = float(self.i_slr.predict(X[:, [1]])[0])
        mlr_pred = float(self.i_mlr.predict(X)[0])
        return {"slr_predicted": round(slr_pred, 3), "mlr_predicted": round(mlr_pred, 3)}

tp1_service = TP1RegressionService()
