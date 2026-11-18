#!/usr/bin/env bash
set -e

echo "========================================="
echo "  Starting Iris Classifier Full-Stack App "
echo "========================================="

# Trap to kill both processes on exit
cleanup() {
  echo ""
  echo "Shutting down servers..."
  kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT SIGINT SIGTERM

echo "Starting Backend on http://localhost:8000 ..."
python -m uvicorn app.main:app --app-dir backend --port 8000 --reload &

echo "Starting Frontend on http://localhost:5173 ..."
(cd frontend && npm run dev -- --port 5173) &

echo "App running. Press Ctrl+C to terminate."
wait
