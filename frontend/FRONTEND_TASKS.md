# Frontend Team: Complete Setup & Task Guide

**Last Updated:** 2026-01-19
**Status:** Backend API Phase 9 Complete. All core endpoints are LIVE (Search, Trending, Saved Cars, Alerts).

---

## 🔧 Phase 0: Getting Started

### Step 1: Clone the Repository (First Time Only)

```bash
git clone https://github.com/SoroushRF/Undercut.git
cd Undercut
```

### Step 2: Switch to Your Branch

Each role has a dedicated branch. **Work ONLY on your branch.**

| Role | Branch | Command |
|------|--------|---------|
| **The Architect (Stylist)** | `style` | `git checkout style` |
| **The UX Engineer** | `ux` | `git checkout ux` |
| **The Integrator** | `integration` | `git checkout integration` |

Example:
```bash
git checkout style
```

### Step 3: Pull Latest Code

**ALWAYS pull before starting work:**

```bash
git pull origin <your-branch>
```

Example:
```bash
git checkout style
git pull origin style
```

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 5: Start Development Server

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## 💾 Daily Workflow

### Starting Your Day

```bash
# Navigate to project
cd Undercut

# Switch to your branch
git checkout <your-branch>

# Pull latest changes
git pull origin <your-branch>

# Start dev server
cd frontend
npm run dev
```

### Saving Your Work

```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "[ROLE] What you did"

# Push to your branch
git push origin <your-branch>
```

**Commit message format:**
- `[ARCHITECT] Created DealCard component`
- `[UX] Added page transition animations`
- `[INTEGRATOR] Built landing page layout`

### Syncing with Latest API Changes

If the backend team pushes new contract changes:

```bash
git checkout <your-branch>
git pull origin <your-branch>
git merge origin/api -m "Sync with api updates"
git push origin <your-branch>
```

---

## 🖥️ Option A: Mock Data Only (Recommended)

You don't need the backend running. Just use mock data.

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:3000` using `lib/mock-data.ts`.

---

## 🔌 Option B: Connect to Live Backend (For Integration Testing)

If you want to test against the real API:

**Step 1: Install Python dependencies (one-time)**
```bash
cd backend
pip install -r requirements.txt
```

**Step 2: Start the API server**
```bash
# From the ROOT directory (not inside backend/)
cd ..  # if you're in backend/
uvicorn backend.main:app --reload
```

**Step 3: Verify**
- Open `http://localhost:8000/docs` - You should see Swagger UI
- API endpoints are ready at `http://localhost:8000/cars`

**Step 4: Run Frontend**
```bash
cd frontend
npm run dev
```

Now your frontend can fetch from `http://localhost:8000`.

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/types.ts` | The `Car` interface (aligned with backend) |
| `lib/mock-data.ts` | 5 sample cars for UI development |

---

## 🏛️ The Architect (Atomic UI Designer)

**Your Branch:** `style`
**Your Folder:** `frontend/components/ui/`

### Tasks You Can Start Today

| Task | Description | Dependencies |
|------|-------------|--------------|
| **Deal Card Component** | Card showing: Image, Year/Make/Model/Trim, Price, Deal Grade Badge (S/A/B/C/F) | `types.ts` ✅ |
| **Search Input Component** | Styled input with icon, debounce-ready | None |
| **Badge Component** | Colored badge for deal grades (Green=S, Red=F) + "SOLD" badge | None |
| **Button Variants** | Primary, Secondary, Ghost buttons | None |
| **Modal Component** | Reusable modal shell for Profile Setup and Negotiation Script | None |
| **Navbar Component** | Logo, Search, Profile Avatar placeholder | None |
| **Card Skeleton** | Loading state placeholder for Deal Cards | None |
| **Filter Chips** | Transmission, Fuel Type, Drivetrain filter pills | `types.ts` (enums) |

---

## 🎨 The UX Engineer (Visualization & Motion)

**Your Branch:** `ux`
**Your Folders:** `frontend/components/viz/`, `frontend/components/motion/`, `frontend/hooks/`

### Tasks You Can Start Today

| Task | Description | Dependencies |
|------|-------------|--------------|
| **Deal Grade Gauge** | Visual meter showing S→F tier (like a speedometer) | `mock-data.ts` ✅ |
| **TCO Chart (Mock)** | Line/Bar chart showing cost over time | Use `fuel_type` from mock |
| **Price Comparison Bar** | Visual bar: Listed Price vs FMV | `mock-data.ts` ✅ |
| **Page Transitions** | Framer Motion fade/slide between routes | None |
| **Card Hover Effects** | Scale/shadow animation on Deal Cards | None |
| **"Sold" Badge Animation** | Red overlay for `status: "sold"` cars | `mock-data.ts` ✅ |
| **Freshness Indicator** | "Verified 2h ago" using `last_seen_at` | `mock-data.ts` ✅ |

---

## 🧩 The Integrator (Page Assembly & State Manager)

**Your Branch:** `integration`
**Your Folders:** `frontend/app/`, `frontend/hooks/use-cars.ts`

### Tasks You Can Start Today

| Task | Description | Dependencies |
|------|-------------|--------------|
| **Landing Page (`/`)** | Hero + Trending Deals Grid | Components + `mock-data.ts` |
| **Car Detail Page (`/cars/[id]`)** | Full car view with all specs | Components + `mock-data.ts` |
| **`use-cars.ts` Hook** | Abstract data fetching (mock now, API later) | `mock-data.ts` ✅ |
| **Search Results Page** | Filtered list with chips for Transmission, Fuel, Drivetrain | Components + local state |
| **Profile Page Shell (`/profile`)** | Layout with form fields (no submit yet) | Components |
| **Saved Cars Page Shell (`/saved`)** | List with "Sold" badge logic | `mock-data.ts` ✅ |

---

## 🚫 What You CANNOT Work On Yet (Blocked by Backend)

| Feature | Reason | ETA |
|---------|--------|-----|
| Actual Login/Auth | Supabase Auth not integrated | TBD |
| User Profile Submit | `PATCH /users/me` endpoint exists but auth is mocked | TBD |

---

## 🔗 Backend API Reference

The API runs at `http://localhost:8000`. CORS is enabled for `localhost:3000`.
Authentication: Use header `X-User-Id: <user_uuid>` (Mock Auth).

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/cars/search` | POST | ✅ Live | Search with filters |
| `/cars/trending` | GET | ✅ Live | Get top S/A grade cars |
| `/cars/{id}` | GET | ✅ Live | Returns single car |
| `/cars/{id}/tco` | POST | ✅ Live | Calculate ownership cost |
| `/cars/{id}/analyze` | POST | ✅ Live | Triggers AI analysis |
| `/users/saved-cars` | GET | ✅ Live | List saved cars |
| `/users/saved-cars/{id}` | POST | ✅ Live | Save a car |
| `/alerts` | POST | ✅ Live | Create sniper alert |
| `/docs` | GET | ✅ Live | Swagger UI |

---

## 📋 Available Fields

These fields are available in `types.ts` and `mock-data.ts`:

| Field | Type | Use Case |
|-------|------|----------|
| `id` | `string` | Unique identifier |
| `vin` | `string` | Vehicle ID (17 chars) |
| `make` | `string` | e.g., "Toyota", "BMW" |
| `model` | `string` | e.g., "Camry", "M3" |
| `year` | `number` | e.g., 2023 |
| `trim` | `string \| null` | e.g., "Competition", "Type R" |
| `transmission` | `automatic \| manual \| cvt` | Filter chip |
| `fuel_type` | `gasoline \| electric \| hybrid...` | TCO Calculator, Filter |
| `drivetrain` | `fwd \| rwd \| awd \| 4wd` | Toronto winter filter |
| `price` | `number` | Listed price in CAD |
| `mileage` | `number` | Odometer in KM |
| `postal_code` | `string \| null` | e.g., "M5V 3L9" |
| `seller_type` | `dealer \| private` | Badge or negotiation hint |
| `listing_url` | `string` | Original listing URL |
| `image_url` | `string \| null` | Display image |
| `description` | `string \| null` | Seller's description |
| `created_at` | `ISO string` | When scraped |
| `last_seen_at` | `ISO string \| null` | "Verified 2h ago" |
| `status` | `active \| sold \| deleted` | "SOLD" badge overlay |
| `fair_market_value` | `number \| null` | Quant's FMV |
| `deal_grade` | `S \| A \| B \| C \| F \| null` | Deal rating |
| `ai_verdict` | `string \| null` | AI analysis text |

---

## ❓ Need Help?

- **Full feature list:** `docs/Global_Feature_Manifest.md`
- **Team roles & rules:** `docs/Undercut_Master_Protocol.md`
- **Product spec:** `docs/Product_Spec_v1.md`
