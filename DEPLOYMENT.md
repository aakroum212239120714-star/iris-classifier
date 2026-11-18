# Deployment Guide: Iris Decision Tree Web App

This application can be deployed either **as a single full-stack container** (recommended) or **decoupled** (Frontend on Vercel/Netlify + Backend on Render/Railway/Fly.io/VPS).

---

## Strategy A: Single Full-Stack Container (Recommended)

The included multi-stage `Dockerfile`:
1. Compiles the React + TypeScript frontend into optimized static assets.
2. Packages the FastAPI Python backend and mounts the built frontend.
3. Serves both the REST API (`/predict`, `/metrics`, `/tree`, etc.) and the interactive UI from one single URL with **zero CORS issues**.

### 1. Deploy on Render (Free / Low Cost)
1. Push your repository to **GitHub** or **GitLab**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** &rarr; **Web Service**.
3. Select your repository.
4. Render detects the `Dockerfile` automatically (or you can use the included `render.yaml`).
   - **Environment**: Docker
   - **Branch**: `master` or `main`
   - **Plan**: Free
5. Click **Deploy Web Service**.
6. Render builds the frontend, boots FastAPI, and assigns you a public URL like `https://iris-classifier.onrender.com`.

---

### 2. Deploy on Railway
1. Go to [Railway.app](https://railway.app/).
2. Click **New Project** &rarr; **Deploy from GitHub repo**.
3. Select your repository.
4. Railway will automatically detect the `Dockerfile` and read the dynamic `$PORT`.
5. Under service settings, click **Generate Domain** to get a public `https://...up.railway.app` URL.

---

### 3. Deploy with Docker / Docker Compose on any VPS (DigitalOcean / AWS EC2 / Hetzner)
Run directly on your server:

```bash
# Clone the repository
git clone <your-repo-url>
cd irisPROJECT

# Build and run with Docker Compose
docker compose up -d --build
```
Your app is now live at `http://your-server-ip:8000`.

To set up HTTPS with a domain name, use Nginx or Caddy as a reverse proxy:
```caddy
yourdomain.com {
    reverse_proxy localhost:8000
}
```

---

## Strategy B: Decoupled Deployment (Frontend on Vercel + Backend on Render/Fly.io)

### Step 1: Deploy Backend (FastAPI)
1. In your cloud provider (Render, Railway, or Fly.io), set:
   - **Root directory**: `.`
   - **Build command**: `pip install -r backend/requirements.txt`
   - **Start command**: `python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT`
2. Copy the public backend URL (e.g. `https://iris-backend.onrender.com`).

### Step 2: Deploy Frontend on Vercel
1. Go to [Vercel](https://vercel.com/) &rarr; **Add New Project**.
2. Choose your repository.
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
4. Under **Environment Variables**, add:
   ```env
   VITE_API_BASE_URL=https://iris-backend.onrender.com
   ```
5. Click **Deploy**. Vercel will build and host your frontend on its global CDN.

---

## Production Checklist

- [x] **CORS Configuration**: Configured in `backend/app/main.py`.
- [x] **Dynamic Port**: Dockerfile and FastAPI bind to `${PORT:-8000}`.
- [x] **Production Static Assets**: Built with `npm run build` using minified chunks and KaTeX / Noto Sans Arabic fonts.
- [x] **Git Repository Initialized**: Ready to push to GitHub with `.gitignore` and `.dockerignore`.
