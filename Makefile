.PHONY: install test test-backend build run run-backend run-frontend

install:
	pip install -r backend/requirements.txt
	cd frontend && npm install

test: test-backend

test-backend:
	python -m pytest backend/tests -v

build:
	cd frontend && npm run build

run-backend:
	python -m uvicorn app.main:app --app-dir backend --port 8000 --reload

run-frontend:
	cd frontend && npm run dev -- --port 5173

run:
	@powershell -ExecutionPolicy Bypass -File ./run.ps1
