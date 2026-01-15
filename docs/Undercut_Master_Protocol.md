# Undercut: Master Development Protocol & Governance

## 1. Introduction
This document serves as the "Source of Truth" for the Undercut monorepo development team. In a high-speed "Vibe Coding" environment, strict boundary adherence is mandatory to prevent merge conflicts, technical debt, and cross-domain logic pollution. Every developer (and AI assistant) must strictly operate within their designated folders.

---

## 2. General Monorepo Rules
1. **Read Permission:** All roles have global read access (`*`) to understand context, imports, and types.
2. **Write Permission:** Strictly enforced. Modifying a file outside your jurisdiction is a **Critical Failure**.
3. **The Contract:** The only shared ground is `frontend/lib/types.ts` and `backend/models/`. Changes here require a "Handshake" between The Controller and The Architect.
4. **Tooling:** Never run cross-domain installs (e.g., The Controller should never run `npm install`). 
5. **Isolation:** Keep the "Vibe" pure in your specific folder.

---

## 3. Role Breakdown: The Detailed Jurisdiction

### 🛡️ Role A: The Controller (Backend API & AI Architect)
*   **Mission:** To build the robust, high-performance gateway between the data and the user. The Controller manages FastAPI routes, Google Gemini SDK integration, and high-level orchestration.
*   **Primary Tasks:**
    *   Designing RESTful endpoints (FastAPI).
    *   Crafting Gemini 1.5 prompt templates for car description analysis.
    *   Managing database connections and Supabase interactions.
    *   Authentication and security middleware.
*   **Write Jurisdiction (ALLOWED):**
    *   `backend/routers/`
    *   `backend/models/`
    *   `backend/main.py`
    *   `backend/requirements.txt`
*   **Forbidden Zones (NO-GO):**
    *   `backend/services/quant/` (Handled by The Quant).
    *   `frontend/*` (Handled by Frontend roles).
    *   `scraper/*` (Handled by The Hunter).

### 📈 Role B: The Quant (Mathematical Financial Logic)
*   **Mission:** To provide the "intelligence" behind the pricing. The Quant translates market data into Fair Market Value (FMV) scores and identifies outliers.
*   **Primary Tasks:**
    *   Implementing pricing algorithms in Python.
    *   Statistical analysis of mileage vs. price trends.
    *   Building the "Deal Grade" logic (A, B, C, F).
    *   Optimization of data clusters.
*   **Write Jurisdiction (ALLOWED):**
    *   `backend/services/quant/`
*   **Forbidden Zones (NO-GO):**
    *   `backend/routers/` (The Quant provides the math; The Controller exposes it).
    *   `frontend/*`
    *   `scraper/*`

### 🏹 Role C: The Hunter (Go-Lang Scraper / Data Ingestion)
*   **Mission:** To feed the engine. The Hunter builds high-concurrency Go crawlers that extract raw data from AutoTrader, Clutch, and other marketplaces.
*   **Primary Tasks:**
    *   Managing Colly collectors and DOM parsing logic.
    *   Handling rotating proxies and anti-bot bypass.
    *   Mapping raw site data to the Undercut internal schema.
    *   Go dependency management.
*   **Write Jurisdiction (ALLOWED):**
    *   `scraper/`
    *   `scraper/go.mod`
    *   `scraper/main.go`
*   **Forbidden Zones (NO-GO):**
    *   `backend/*`
    *   `frontend/*`
    *   `docker-compose.yml` (Unless adding a new scraper service).

### 🏛️ Role D: The Architect (Atomic UI Designer)
*   **Mission:** To define the visual language. The Architect builds the "Atoms" of the design system using Shadcn/UI and Tailwind CSS.
*   **Primary Tasks:**
    *   Creating reusable Button, Card, Input, and Modal components.
    *   Managing global Tailwind themes and colors.
    *   Maintaining the TypeScript "Contract" (`types.ts`).
    *   Consistency of design tokens.
*   **Write Jurisdiction (ALLOWED):**
    *   `frontend/components/ui/`
    *   `frontend/lib/` (The Shared Contract)
    *   `frontend/lib/mock-data.ts`
    *   `frontend/tsconfig.json`
*   **Forbidden Zones (NO-GO):**
    *   `frontend/app/` (The Integrator assembles; The Architect provides parts).
    *   `frontend/hooks/`
    *   `backend/*`

### 🎨 Role E: The UX Engineer (Visualization & Motion)
*   **Mission:** To bring the data to life. The UX Engineer focuses on complex charts, Framer Motion animations, and responsive interactions.
*   **Primary Tasks:**
    *   Building the "Gauges" and "Market Trend" charts in `/viz`.
    *   Implementing fluid page transitions.
    *   Crafting custom React hooks for mobile gestures and window resizing.
    *   Refining the "Gemini Verdict" display experience.
*   **Write Jurisdiction (ALLOWED):**
    *   `frontend/components/viz/`
    *   `frontend/components/motion/`
    *   `frontend/hooks/` (General hooks)
    *   `frontend/lib/mock-data.ts`
*   **Forbidden Zones (NO-GO):**
    *   `frontend/components/ui/` (Usage only; no modification).
    *   `frontend/app/`
    *   `backend/*`

### 🧩 Role F: The Integrator (Page Assembly & State Manager)
*   **Mission:** To build the actual app. The Integrator takes the components and data to assemble the final user experience.
*   **Primary Tasks:**
    *   Building layouts and page routes in `/app`.
    *   Managing TanStack Query state and API fetching.
    *   Handling form submission and validation logic.
    *   Ensuring the app "feels" connected to the Backend.
*   **Write Jurisdiction (ALLOWED):**
    *   `frontend/app/`
    *   `frontend/hooks/use-cars.ts` (The Data Gate)
    *   `frontend/lib/mock-data.ts`
    *   `frontend/package.json` (When adding state deps)
*   **Forbidden Zones (NO-GO):**
    *   `frontend/components/*` (Usage only).
    *   `backend/*`
    *   `scraper/*`

### 🛡️ Role G: The Guardian (DevOps & Test Lead)
*   **Mission:** To protect the code quality and ensure the project is deployable.
*   **Primary Tasks:**
    *   Writing Playwright E2E tests.
    *   Managing Docker Compose orchestration.
    *   Setting up GitHub Actions CI workflows.
    *   Configuration of environment variables.
*   **Write Jurisdiction (ALLOWED):**
    *   `tests/`
    *   `.github/`
    *   `docker-compose.yml`
    *   `.gitignore`
*   **Forbidden Zones (NO-GO):**
    *   `backend/*`
    *   `frontend/*`
    *   `scraper/*`

---

## 4. The "Handshake" Protocols (Communication)

### API Contract Changes
When **The Controller** needs to add a new property to a car object:
1. They propose the change in `backend/models/car.py`.
2. They notify **The Architect**.
3. **The Architect** updates `frontend/lib/types.ts`.
4. **The Integrator** implements the UI update in `frontend/app/`.

### Visual Bug Resolution
1. If a chart is broken, **The UX Engineer** investigates `frontend/components/viz/`.
2. If the data to the chart is wrong, they contact **The Controller**.
3. **The Guardian** writes a test to ensure it doesn't break again.

---

## 5. Mock-First Architecture & Data Governance

To enable parallel development, we operate on a "Mock-First" basis.

### 5.1 The Mock Files
- **`frontend/lib/mock-data.ts`**: Contains dummy data for UI testing.
  - **Permission:** Freely modifiable by any Frontend role.
  - **Usage:** Adding cars, testing edge cases (very high mileage, 0 price).
- **`frontend/hooks/use-cars.ts`**: The architectural gate for data.
  - **Permission:** **Integrator ONLY.**
  - **Usage:** Switches between Mock Data and Backend API.

### 5.2 The "Handshake" vs. "Free Mode"
- **Free Mode:** Changing the values inside `mock-data.ts`. No notification needed.
- **Handshake Mode:** Changing the *keys* or *types* of data.
  - *Example:* If you want to change `mileage` to `odometer`, you must trigger a Section 4 Handshake to sync `lib/types.ts` and `backend/models/`.

---

## 5. Summary Table

| Role | Core Technology | Primary Write Directory | High-Level Duty |
| :--- | :--- | :--- | :--- |
| **Controller** | FastAPI / Python | `backend/routers` | API & AI Logic |
| **Quant** | Statistics / Python | `backend/services/quant` | Pricing Math |
| **Hunter** | Go / Colly | `scraper/` | Web Scraping |
| **Architect** | Shadcn / Tailwind | `frontend/components/ui` | Atomic Design |
| **UX Engineer** | Framer / Recharts | `frontend/components/viz`, `motion` | Viz & Animation |
| **Integrator** | Next.js / TanStack | `frontend/app`, `hooks/use-cars.ts` | Page Assembly |
| **Guardian** | Docker / Playwright | `tests/`, `.github/`, `docker-compose.yml` | CI/CD & Testing |

---

---

## 6. GitHub Workflow (The Stage-Gate Model)

To ensure stability in a multi-role monorepo, Undercut uses a tiered merge strategy.

1.  **Level 1: Role Branches (`quant`, `ux`, `scrapper`, etc.)**
    *   Individual workers commit to their specific branch.
    *   No cross-role merging allowed at this stage.
2.  **Level 2: Domain Branches (`backend`, `frontend`)**
    *   Role branches merge into their respective Domain branch.
    *   **The Controller** oversees `backend` stability.
    *   **The Integrator**/ **Architect** oversees `frontend` stability.
3.  **Level 3: Integration Branch (`dev`)**
    *   `backend` and `frontend` merge here for full-stack "Fusion" testing.
    *   Full E2E suite (Playwright) must pass.
4.  **Level 4: Production Branch (`main`)**
    *   Only `dev` merges into `main` after a successful staging verification.

---

## 7. Commit & Push Procedure (The Discipline)

### 7.1 Commit Protocol
- **AI Persona Check:** Before every commit, the AI agent must verify the staged files match the active role's jurisdiction.
- **Message Format:** `[ROLE] Short description of change` (e.g., `[QUANT] Implemented Haversine pricing outlier logic`).
- **Forbidden Actions:** Never commit changes to `.env` or files in `.agent/`.

### 7.2 Push & PR Procedure
1.  **Sync First:** Always `git pull origin <your-branch>` before pushing to resolve local conflicts.
2.  **Strict Push:** Push only to your assigned branch. 
3.  **The PR Handshake:**
    *   When a feature is ready, open a Pull Request to the **Domain Branch** (`backend` or `frontend`).
    *   The PR description must include: "Related to [Contract Update/New Feature/Bugfix]".
    *   Tag the **Guardian** for a CI/CD check.

---

**END OF DOCUMENT**
**Last Updated: 2026-01-15**
