# Frontend Team: What You Can Work On NOW

**Last Updated:** 2026-01-19
**Status:** Backend API is live. Contract is aligned.

---

## 🚀 Phase 0: Setup

### Option A: Mock Data Only (Recommended for UI Development)

You don't need the backend running. Just use mock data.

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:3000` using `lib/mock-data.ts`.

### Option B: Connect to Live Backend (For Integration Testing)

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
| Save Car to Backend | `POST /saved-cars` doesn't exist | TBD |
| Real Trending Data | `GET /cars/trending` doesn't exist | TBD |
| User Profile Submit | `PATCH /users/me` doesn't exist | TBD |
| Sniper Alert Submit | `POST /alerts` doesn't exist | TBD |

---

## 🔗 Backend API Reference

The API runs at `http://localhost:8000`. CORS is enabled for `localhost:3000`.

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/cars` | GET | ✅ Live | Returns all cars |
| `/cars/{id}` | GET | ✅ Live | Returns single car |
| `/cars/{id}/analyze` | POST | ✅ Live | Triggers AI analysis |
| `/docs` | GET | ✅ Live | Swagger UI |

---

## 📋 New Fields Available

These fields were just added. Use them in your components:

| Field | Type | Use Case |
|-------|------|----------|
| `trim` | `string \| null` | Display "2023 BMW M3 **Competition**" |
| `transmission` | `automatic \| manual \| cvt` | Filter chip |
| `fuel_type` | `gasoline \| electric \| hybrid...` | TCO Calculator, Filter |
| `drivetrain` | `fwd \| rwd \| awd \| 4wd` | Toronto winter filter |
| `seller_type` | `dealer \| private` | Badge or negotiation hint |
| `postal_code` | `string \| null` | Proximity display |
| `last_seen_at` | `ISO string \| null` | "Verified 2h ago" |
| `status` | `active \| sold \| deleted` | "SOLD" badge overlay |

---

**Questions?** Check `docs/Global_Feature_Manifest.md` for the full feature list.
