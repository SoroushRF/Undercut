# Undercut: Product Specification (v2)
**Region:** Toronto & GTA Only
**Database Strategy:** Supabase Free Tier
**Date:** 2026-01-18 (Revised)

---

## 1. User Logic & Flow

### 🛡️ 1.1 Guest Mode (The Hook)
*   **Storage:** Guest preferences stored in Browser `localStorage` (No DB cost).
*   **Experience:**
    *   **Landing Page:** Shows "Top 10 Undercut Deals" in Toronto immediately.
    *   **Search:** Guests can search, but results are limited (e.g., restricted "Deep Analysis").
    *   **Search Limits:** Rate limited to prevent scraping our scraper.

### 🔑 1.2 The Conversion & Onboarding
*   **Trigger:** Action requiring state (Save Car, Full Analysis, Set Alert).
*   **Sign-In:** Google OAuth.
*   **Flow:**
    1.  User Signs In.
    2.  **Logic:** If `first_time_user`:
    3.  **Profile Completion:** User *must* complete profile (Name, Commute, Family Size) immediately.
    4.  **Redirect:** User is sent back to the exact page they triggered the login from (Seamless).
    5.  **Navbar:** Updates to show "First Name" and "Profile".

### 👤 1.3 User Profile
*   **Addressing:** UI always addresses user by First Name.
*   **Modifiability:** User can edit ALL profile fields (Name, Preferences) except Email.

---

## 2. Core Features

### 🧠 2.1 Hybrid AI Analysis ("The Mechanic")
*   **Choice:** AI Analysis is NOT automatic for every car (cost/speed saving).
*   **Action:** User clicks "Analyze This Deal".
*   **Output:** Gemini checks description for red flags (Rebuilt title, "needs sensor", etc.).
*   **Negotiation:** Optional "Generate Negotiation Script" based on FMV vs. List Price.

### 📉 2.2 TCO Calculator (Math-Based)
*   User enters "Annual Mileage" in profile.
*   App calculates "Real Monthly Cost" (Gas + Depreciation + Estimated Maintenance).
*   *Note:* Uses Algorithm, not Gemini.

### 🔔 2.3 Sniper Mode & Saved Cars
*   **Sniper:** "Notify me if [Car] drops below [Price] in GTA."
*   **Saved Cars Page:**
    *   User can view/remove saved listings.
    *   **Deleted Post Logic:**
        *   If the Scraper detects a car is gone/sold -> Mark DB status as `deleted`.
        *   **UI Behavior:** Car remains in User's list but has a "DELETED/SOLD" tag overlay. User cannot open details but sees it was lost.
        *   **Cleanup:** Auto-remove from list after 30 days.

---

## 3. The Backend (Controller)

### 3.1 Data Integrity
*   **Currency:** Hardcoded `CAD`. Scraper must convert if needed.
*   **Timestamp:** Every listing has `last_seen_at`.
*   **Location:** Toronto + ~100km radius.

### 3.2 Deleted Post Handling
*   **Logic:** The Hunter must log "Missing" cars during a scrape cycle.
*   **db.cars.status:** Enum [`active`, `sold`, `deleted`].

---

**Approved by:** The User & The Controller
