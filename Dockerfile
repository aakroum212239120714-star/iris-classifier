# Multi-stage Dockerfile: Builds frontend, builds backend, serves full-stack app

# Stage 1: Build the React + TypeScript frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
# Build production assets into dist/
RUN npm run build

# Stage 2: Python Backend runtime
FROM python:3.11-slim AS runner
WORKDIR /app

# Set production environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Install dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (default 8000 or Railway/Render/CloudRun $PORT)
EXPOSE 8000

# Run uvicorn server
CMD uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port ${PORT:-8000}
