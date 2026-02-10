# 🛡️ Hackathon MVP: "Zero-Friction Discovery" Plan

This document outlines the strategic pivot for the Undercut project to ensure a high-impact, frictionless demo for the hackathon judges. The goal is to move from a complex auth-heavy application to a "Guest-First" personalized recommendation engine.

---

## 🏛️ Phase 1: Environment & State Foundation ✅
*   **Task 1: Git Strategy**: ✅
    *   Create a new `test` branch from the current state.
    *   Merge `front-temp` into `test` to establish the new MVP baseline.
*   **Task 2: Guest Authentication**: ✅
    *   **Frontend**: Modify `AuthContext.tsx` to bypass mandatory login.
    *   **Volatility**: Automatically generate a `Guest UUID` and store it in `sessionStorage` (data resets on tab close).
*   **Task 3: Backend Guest Support**: ✅
    *   **Backend**: Update user dependencies to auto-create "Guest Profiles" on the fly when a new UUID is detected.

## 🐹 Phase 2: The "Hunter" (Scraper) & Pipeline Fix
*   **Task 1: Wire Connection**: ✅ Update `scraper/main.go` to pipe all results into the `PostCarToBackend` function.
*   **Task 2: Data Alignment**: ✅ Synchronize the Go `CarListing` struct names with the FastAPI `CarBase` Pydantic schemas (e.g., `SourceURL` → `listing_url`).
*   **Task 3: Deduplication Fix**: ✅ Implement a URL-based `hash_id` to replace the strict 17-character `VIN` requirement, ensuring the backend accepts all scraped data.
*   **Task 4: Populating the DB**: ✅ Broaden the scraper's target list to include Toronto's top 5 models (Civic, Corolla, RAV4, CR-V, Model 3).

## 📝 Phase 3: The "Matchmaker" Questionnaire (UX)
*   **Task 1: Landing Page Pivot**: ✅ The main "Get Started" button will skip login and jump directly to the preferences survey.
*   **Task 2: Survey Overhaul**: ✅ Refactor `ProfilePage.tsx` to remove red-tape (Address, Name) and focus on **Utility Data**:
    1. **Budget**: Maximum price slider.
    2. **Fuel/Commute**: Daily KM travel (powers the TCO score).
    3. **Space**: Body type preference (SUV, Sedan, Truck).
    4. **Vibe/Priority**: Deal Grade focus vs. reliability vs. speed.

## 🧠 Phase 4: The Recommendation Engine (Backend Logic)
*   **Task 1: Schema Update**: ✅ Add missing columns (`body_type`, `transmission`, `drivetrain`) to the Backend SQLAlchemy `Car` model.
*   **Task 2: Recommendation Endpoint**: ✅ Create `POST /cars/recommendations` to process survey answers:
    *   Hard filters for Price and Body Type.
    *   Scoring boost for **S** and **A** grade deals.
    *   Personalized TCO calculation included in the response.

## 🚀 Phase 5: The "Hero Shot" (Final UI)
*   **Task 1: Results Dashboard**: ✅ Create a high-polish results page displaying the "Top 3 Best Matches for You."
*   **Task 2: AI Integration**: ✅ Ensure the "Analyze This Deal" (Gemini Vibe Check) button is fully functional for recommended cars.
*   **Task 3: UX Polish**: Add micro-animations and "Freshness" badges to listings to wow the judges.

## 📦 Phase 6: Submission Deliverables

*   **Task 1: Gemini Integration Write-up**:
    *   Create `docs/GEMINI_INTEGRATION.md` (~200 words)
    *   Explain: AI-powered deal analysis, negotiation script generation, how Gemini is central to the UX
*   **Task 2: Deployment (Public URL)**:
    *   **Frontend**: Deploy to Vercel (free tier)
    *   **Backend**: Deploy to Railway or Render (free tier)
    *   Ensure app is publicly accessible with NO login required
*   **Task 3: Public Repository**:
    *   Verify GitHub repo is set to **Public**
    *   Add clear README with setup instructions
*   **Task 4: Demo Video (~3 min)**:
    *   Record screen demo showing: landing → questionnaire → AI recommendations → deal analysis
    *   Upload to YouTube (unlisted) or Loom

---

## 🧐 Audit & Critical Success Factors

- **No Dead Heat**: Ensure the backend fallback for SQLite is working if the Supabase connection is unstable during the demo.
- **Mock Fallback**: Keep `mock-data.ts` updated as a safety net in case of scraper IP blocks.
- **Speed**: All transitions must be under 300ms to maintain a "premium" feel.
- **Gemini Visibility**: Ensure the AI analysis button is prominent and clearly labeled as "Powered by Gemini".

---

## 🔄 Post-Hackathon: Re-enable After Demo

The following features are **temporarily disabled** for the hackathon demo to reduce complexity:

*   **Deal Search Feature**: Temporarily hidden from UI. The recommendation endpoint and deal grading logic remain in codebase but not exposed in frontend. Files involved:
    -   `frontend/app/search/page.tsx` (search filters)
    -   `backend/routers/cars.py` (filtering endpoints)
    -   `backend/services/quant/deal_grader.py` (grading logic)
*   **User Authentication**: Login/signup hidden but logic preserved in:
    -   `frontend/context/AuthContext.tsx`
    -   `backend/routers/users.py`
    -   `frontend/components/ui/Navbar.tsx` (conditional login button)

