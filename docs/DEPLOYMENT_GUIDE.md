# 🚀 Deployment Guide: Undercut Hackathon MVP

Follow these steps exactly to deploy the system. We use a **Hybrid Architecture**: 
- **Database**: Cloud (Supabase)
- **Backend API**: Cloud (Render)
- **Frontend UI**: Cloud (Vercel)
- **Data Scraper**: Local (Your PC)

---

## 🏗️ Step 1: Database (Supabase) - ALREADY LIVE
Your database is already hosted on Supabase. 
1. Log in to [supabase.com](https://supabase.com).
2. Go to **Project Settings** > **Database**.
3. Keep your **Connection String** (URI) ready. It should look like:
   `postgresql://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

---

## 🐍 Step 2: Backend API (Render)
Render will host your FastAPI server.
1. Create a free account at [render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. **Configuration**:
   - **Name**: `undercut-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables** (Click "Advanced"):
   - `DATABASE_URL`: (Your Supabase URI)
   - `GEMINI_API_KEY`: (Your Google AI Key)
   - `CORS_ORIGINS`: `*` (Change to your Vercel URL once the frontend is live)
   - `PYTHONPATH`: `/app`
6. Click **Create Web Service**. 
   - *Wait ~5 mins. Once live, copy your service URL (e.g., `https://undercut-backend.onrender.com`).*

---

## ⚛️ Step 3: Frontend UI (Vercel)
Vercel is the gold standard for Next.js apps.
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. **Configuration**:
   - **Project Name**: `undercut-web`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
5. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: (Your Render Backend URL from Step 2)
6. Click **Deploy**.
   - *Vercel will build the production bundle. Once finished, you will have your live app link!*

---

## 🏹 Step 4: The Hunter (Local Scraper)
Since your scraper needs a browser context (Playwright), run it from your local machine to feed data into the live cloud system.
1. Open a terminal in the `scraper` directory.
2. **Set the Target**: 
   - Windows (PowerShell): `$env:BACKEND_URL="https://your-render-url.onrender.com"`
   - Mac/Linux: `export BACKEND_URL="https://your-render-url.onrender.com"`
3. **Run**:
   ```bash
   go run main.go
   ```
4. **Verify**: The scraper will find cars and "Post" them to Render. Render will then save them to Supabase. Your Vercel frontend will show them instantly!

---

## 🚨 Critical Success Checklist
- [ ] **Render Wake-up**: Free Render instances "sleep" after 15 mins. Open your backend URL in a browser before the demo to wake it up.
- [ ] **Cors Check**: If the frontend shows "Network Error," ensure `CORS_ORIGINS` in Render matches your Vercel URL EXACTLY (no trailing slash).
- [ ] **Scraper Connectivity**: Ensure your local PC has internet when running the scraper.

---
*Undercut Team: Good luck with the judges!*
