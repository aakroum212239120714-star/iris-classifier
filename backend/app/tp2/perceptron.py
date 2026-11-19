from typing import List, Optional
import numpy as np

class Perceptron:
    """
    Pure NumPy implementation of Frank Rosenblatt's Perceptron.
    No scikit-learn Perceptron is used.
    
    z = w · x + b
    step activation: f(z) = 1 if z >= 0 else 0
    learning rule per sample:
        w += lr * (y - y_hat) * x
        b += lr * (y - y_hat)
    """
    def __init__(self, lr: float = 0.1, epochs: int = 20, seed: int = 42):
        self.lr = lr
        self.epochs = epochs
        self.seed = seed
        self.w: Optional[np.ndarray] = None
        self.b: float = 0.0
        self.errors_: List[int] = []

    def fit(self, X: np.ndarray, y: np.ndarray) -> "Perceptron":
        rng = np.random.RandomState(self.seed)
        # weights init: small random normal (seed), bias 0
        self.w = rng.normal(loc=0.0, scale=0.01, size=X.shape[1])
        self.b = 0.0
        self.errors_ = []

        for _ in range(self.epochs):
            errors = 0
            for xi, target in zip(X, y):
                z = np.dot(xi, self.w) + self.b
                y_hat = 1 if z >= 0.0 else 0
                update = self.lr * (target - y_hat)
                if update != 0.0:
                    self.w += update * xi
                    self.b += update
                    errors += 1
            self.errors_.append(errors)
        return self

    def decision_function(self, X: np.ndarray) -> np.ndarray:
        return np.dot(X, self.w) + self.b

    def predict(self, X: np.ndarray) -> np.ndarray:
        return np.where(self.decision_function(X) >= 0.0, 1, 0)
