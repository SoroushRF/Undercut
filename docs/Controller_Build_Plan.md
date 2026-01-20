# 🛡️ The Controller: Ultimate 0-to-100 Build Guide

## 1. Mission Profile

**Role:** The Controller (Backend API & AI Architect)
**Core Responsibility:** Build the high-performance nervous system of Undercut. You ingest data, store it, analyze it with AI, and serve it to the frontend.
**Source of Truth:** this document and `Product_Spec_v2.md`.

---

## 2. Phase Breakdown & Status

### ✅ Phase 1: The Foundation (Environment & Setup)

*Build the runway so the plane can take off.*

- [x] **Task 1.1:** Clone/Setup Repo and switch to `backend/api` branch.
- [x] **Task 1.2:** Initialize Python Environment & Dependencies (`requirements.txt`).
- [x] **Task 1.3:** Create `backend/main.py` entry point.
- [x] **Task 1.4:** Verify Server Ignition.

### ✅ Phase 2: The Contract (Data Modeling)

*Define the shape of the universe (The Car).*

- [x] **Task 2.1:** Create `backend/models/car.py`.
- [x] **Task 2.2:** Create Basic Router `backend/routers/cars.py`.

### 🔄 Phase 3: The Persistence Layer (Database)

*Move from volatile memory to permanent storage.*

- [x] **Task 3.1:** Setup Environment Variables.
- [x] **Task 3.2:** Configure SQLAlchemy Engine (`backend/database.py`).
- [x] **Task 3.3:** Create DB Tables (Auto-create on startup via `main.py`).
- [x] **Task 3.4:** Refactor Router to use Real DB (SQLAlchemy queries).
- [ ] **Task 3.5:** **MIGRATE TO SUPABASE.** (Deferred - switch connection string when ready).

### ✅ Phase 4: The Brain (Gemini AI Integration)

*Inject intelligence into the raw data.*

- [x] **Task 4.1:** Get Gemini API Key.
- [x] **Task 4.2:** Create AI Service Module `backend/services/ai.py`.
- [x] **Task 4.3:** Design the "Ruthless Buyer" Prompt Template.
- [x] **Task 4.4:** Create Analysis Endpoint (`POST /cars/{id}/analyze`).

### ✅ Phase 5: The Gatekeeper (Security & Access)

*Allow the Frontend to talk to us.*

- [x] **Task 5.1:** Add CORS Middleware (env-based for dev/prod).
- [x] **Task 5.2:** Implement Rate Limiting for Guest Search.

### ✅ Phase 6: User & Profile System

*Implement the Logic defined in Product Spec v2.*

- [x] **Task 6.1:** Define `User` and `Profile` models in `backend/models/user.py`.
- [x] **Task 6.2:** Create `backend/routers/users.py` with `GET /me`, `PATCH /me`.
- [x] **Task 6.3:** Implement Saved Cars Logic (`POST /saved-cars/{id}`, `GET /saved-cars`).

### ✅ Phase 7: The Market & Search

- [x] **Task 7.1:** Implement Advanced Search Endpoint (`POST /cars/search`).
- [x] **Task 7.2:** Implement Trending Endpoint (`GET /cars/trending`).
- [x] **Task 7.3:** Scaffold Quant Service `backend/services/quant/`.

### ✅ Phase 8: Advanced Logic

*The cool features that make us different.*

#### 8.1 Sniper Alerts

- [x] **Task 8.1.1:** Create `Alert` model in `backend/models/alert.py`.
- [x] **Task 8.1.2:** Create `POST /alerts` endpoint (save user alert).
- [x] **Task 8.1.3:** Create `GET /alerts` endpoint (list user's alerts).
- [x] **Task 8.1.4:** Create `DELETE /alerts/{id}` endpoint.
- [x] **Task 8.1.5:** Create `check_alerts(car)` function in `backend/services/alerts.py`.

#### 8.2 TCO Calculator

- [x] **Task 8.2.1:** Create `backend/services/tco.py`.
- [x] **Task 8.2.2:** Add `POST /cars/{id}/tco` endpoint.

#### 8.3 Negotiation Script Generator

- [x] **Task 8.3.1:** Enhance `ai.py` with `generate_negotiation_script()`.
- [x] **Task 8.3.2:** Add `POST /cars/{id}/negotiate` endpoint.

### 🧪 Phase 9: Testing Suite

*Ensure everything works before production.*

#### 9.1 Unit Tests ✅

- [x] **Task 9.1.1:** Create `backend/tests/` directory structure.
- [x] **Task 9.1.2:** Test Car CRUD operations.
- [x] **Task 9.1.3:** Test User CRUD operations.
- [x] **Task 9.1.4:** Test Alert CRUD operations.

#### 9.2 Service Tests ✅

- [x] **Task 9.2.1:** Test Quant Service (FMV, Deal Grader).
- [x] **Task 9.2.2:** Test TCO Calculator.
- [x] **Task 9.2.3:** Test Alert Matcher (`check_alerts_for_car`).

#### 9.3 Integration Tests ✅

- [x] **Task 9.3.1:** Test Search Endpoint with various filters.
- [x] **Task 9.3.2:** Test Trending Endpoint.
- [x] **Task 9.3.3:** Test Saved Cars flow (save, list, unsave).

#### 9.4 AI Service Tests (Mock) [DEFERRED]

- [ ] **Task 9.4.1:** Test AI analysis with mocked Gemini response.
- [ ] **Task 9.4.2:** Test Negotiation Script with mocked response.

### 🚀 Phase 10: Production Readiness ✅

- [x] **Task 10.1:** Dockerize the Backend (verify `Dockerfile` works).
- [x] **Task 10.2:** Final Code Cleanup & Commenting.
- [x] **Task 10.3:** Update FRONTEND_TASKS.md to mark backend endpoints as "Live".

---

## 3. Current Status


**Completed Phases:** ALL PRIMARY PHASES COMPLETE (1-10).
**Status:** 🟢 **READY FOR HANDOFF / FRONTEND INTEGRATION.**
**Deferred:** Phase 3.5 (Supabase), Phase 9.4 (AI Mock Tests)

### Immediate Next Steps

1. **Frontend Team:** Begin integration using `FRONTEND_TASKS.md`.
2. **Backend Team:** Monitor for bugs; Prepare for future Supabase migration.

---

## 4. API Endpoints Summary

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/cars` | GET | ✅ Live | List all active cars |
| `/cars/trending` | GET | ✅ Live | Top S/A deals |
| `/cars/search` | POST | ✅ Live | Advanced search with filters |
| `/cars/{id}` | GET | ✅ Live | Get single car |
| `/cars/{id}/analyze` | POST | ✅ Live | Trigger AI analysis |
| `/cars/{id}/tco` | POST | ✅ Live | TCO calculation |
| `/cars/{id}/negotiate` | POST | ✅ Live | Negotiation script |
| `/users` | POST | ✅ Live | Create user (OAuth) |
| `/users/me` | GET | ✅ Live | Get current user |
| `/users/me` | PATCH | ✅ Live | Update profile |
| `/users/saved-cars` | GET | ✅ Live | List saved cars |
| `/users/saved-cars/{id}` | POST | ✅ Live | Save a car |
| `/users/saved-cars/{id}` | DELETE | ✅ Live | Unsave a car |
| `/alerts` | POST | ✅ Live | Create alert |
| `/alerts` | GET | ✅ Live | List alerts |
| `/alerts/{id}` | DELETE | ✅ Live | Delete alert |
