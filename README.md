# Iris Flower Decision Tree Classifier (Full-Stack Web App)

An interactive, responsive full-stack machine learning web application built on the classic Iris dataset. The backend is powered by **FastAPI** and **scikit-learn**, and the frontend is designed with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**, featuring full **Arabic (RTL default)** and **English** localization, interactive Decision Tree path exploration, 2D scatter plots, and live hyperparameter retraining.

---

## Architecture Overview

```
irisPROJECT/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application, CORS, routers & endpoints
│   │   ├── model.py         # IrisClassifier model class (training, predict, tree export, metrics)
│   │   └── schemas.py       # Pydantic models (PredictRequest, RetrainRequest, Metrics, Tree)
│   ├── tests/
│   │   └── test_api.py      # pytest test suite (predictions, accuracy, validation, retrain)
│   └── requirements.txt     # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts    # Typed API client with VITE_API_BASE_URL
│   │   ├── components/
│   │   │   ├── Header.tsx           # Language switch (AR/EN), Theme switch (Dark/Light)
│   │   │   ├── PredictCard.tsx      # Sliders + inputs + species prediction + probability bars
│   │   │   ├── ScatterPlot.tsx      # 2D dataset visualization with current sample highlighted
│   │   │   ├── TreeViewer.tsx       # Interactive Decision Tree visualization with path highlight
│   │   │   ├── MetricsView.tsx      # Confusion matrix heatmap, report table, feature importances
│   │   │   └── SettingsModal.tsx    # Hyperparameters retraining panel
│   │   ├── i18n/
│   │   │   └── translations.ts # Full Arabic (default, RTL) and English dictionary
│   │   ├── types/
│   │   │   └── index.ts     # TypeScript interfaces matching backend schemas
│   │   ├── App.tsx          # Main dashboard layout (responsive, tabs/cards)
│   │   ├── main.tsx
│   │   └── index.css        # Tailwind directives + custom RTL font styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── README.md
├── Makefile                 # Make automation targets
├── run.ps1                  # PowerShell one-command startup script
└── run.sh                   # Unix/Bash one-command startup script
```

---

## Features

1. **Model Persistence & Custom Retraining**:
   - Trains on startup using the original configuration (`entropy`, `max_depth=3`, 80/20 stratified split, `random_state=42`).
   - Retrain dynamically with custom `max_depth`, `criterion` (`gini`, `entropy`, `log_loss`), and `test_size`.
2. **RESTful FastAPI Endpoints**:
   - `POST /predict`: accepts the 4 flower measurements; returns predicted species, class probabilities, and tree decision path.
   - `GET /metrics`: returns test accuracy, confusion matrix, per-class classification report, and feature importances.
   - `GET /tree`: exports the full decision tree hierarchy (nodes, thresholds, impurities, samples, classes).
   - `POST /retrain`: retrains in memory with custom hyperparameters and returns updated metrics.
   - `GET /dataset`: serves all 150 Iris samples for frontend visualizations.
3. **Interactive Frontend**:
   - **Arabic Default + Full RTL**: Includes bilingual toggle (العربية / English) with proper typography and layout alignment.
   - **Dark & Light Mode**: Accessible, polished design using Tailwind CSS.
   - **Live Prediction**: Interactive sliders and number inputs with debounced real-time predictions.
   - **Interactive Decision Tree**: Graphically displays nodes with split rules, and illuminates the exact decision path taken by the current input.
   - **2D Dataset Scatter Plot**: Select any 2 features as axes (X and Y) with the user's active flower highlighted as a glowing diamond.
   - **Model Metrics**: Interactive confusion matrix heatmap, classification report table, and horizontal bar chart for feature importances.

---

## Quick Start (One-Command)

### Option A: PowerShell (Windows)
```powershell
.\run.ps1
```

### Option B: Bash / Make (Linux / macOS / WSL)
```bash
# Using Makefile
make run

# Or using the shell script
chmod +x run.sh
./run.sh
```

---

## Manual Startup

### 1. Backend Setup
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run backend tests
python -m pytest

# Start FastAPI server on port 8000
python -m uvicorn app.main:app --app-dir backend --reload --port 8000
```
API Documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start Vite dev server on port 5173
npm run dev
```
Open your browser at: [http://localhost:5173](http://localhost:5173)

---

## Environment Configuration

The frontend uses an environment variable for the backend API base URL:
```env
VITE_API_BASE_URL=http://localhost:8000
```
This is configured in `frontend/.env` and `frontend/.env.example`.

---

## Testing & Verification

Run the automated backend test suite:
```bash
python -m pytest backend/tests -v
```

This verifies:
- Health check endpoint
- Initial metrics output
- Prediction accuracy for Setosa-like, Versicolor-like, and Virginica-like samples
- Pydantic range and type validation errors (HTTP 422)
- Tree export endpoint
- In-memory retraining and parameter updates
- Dataset sample retrieval
