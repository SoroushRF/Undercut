# Undercut: Master Setup & Onboarding Guide

Welcome to the **Undercut** development team. To ensure our high-velocity "Vibe Coding" remains disciplined, conflict-free, and architecturally sound, follow this setup guide before writing a single line of code.

---

## 🚀 1. Initial Repository Setup (All Roles)

1.  **Clone the Repo:** 
    ```bash
    git clone <repository-url>
    cd Undercut
    ```
2.  **Initialize the Agent Environment:**
    *   Since the `.agent/` folder is gitignored for security, it will NOT exist when you clone the repo.
    *   **Action:** Manually create a folder named `.agent` in the root directory of the project.
    *   **Action:** You must manually create or paste the `SYSTEM_PROTOCOL.md` and `ai_rules.yaml` files (which the Project Lead will provide to you directly) into this `.agent/` folder. These files are essential for your AI assistants to function within project boundaries.

3.  **Activate AI Identity:**
    *   **Action:** Inside the `.agent/` folder, create a new file named `identity.yaml`.
    *   **Action:** Add exactly one line to define your role:
        ```yaml
        active_role: THE_QUANT  # Replace with your actual role
        ```
    *   **Available Roles:** `THE_CONTROLLER`, `THE_QUANT`, `THE_HUNTER`, `THE_ARCHITECT`, `THE_UX_ENGINEER`, `THE_INTEGRATOR`, `THE_GUARDIAN`.
4.  **Verification & Role Check:**
    *   To ensure your assistant is correctly "shackled" to your role, run this test prompt:
    > *"What is my active role and what are my write jurisdictions? Can I modify `README.md`?"*
    *   **The Expected Answer:** The AI should correctly identify your role from `identity.yaml` and state that `README.md` is **Forbidden** (only the Project Lead/Guardian can modify root docs).
    *   **To Change Roles:** If you move to a different role, simply update the `active_role` in `.agent/identity.yaml` and notify your AI of the change.

---

## 🎨 2. Frontend Onboarding (Architect, UX Engineer, Integrator)

### 2.1 Branching
*   **Architect:** `git checkout style`
*   **UX Engineer:** `git checkout ux`
*   **Integrator:** `git checkout integration`

### 2.2 Environment
```bash
cd frontend
npm install
npm run dev
```

### 2.3 Workflow (Mock-First)
*   **Data Consumption:** Import the `useCars()` hook from `frontend/hooks/use-cars.ts`.
*   **Customization:** Modify `frontend/lib/mock-data.ts` to test UI edge cases. You have free reign over the *values* here.

---

## 🐍 3. Backend Onboarding (Controller, Quant, Hunter)

### 3.1 Branching
*   **Controller:** `git checkout api`
*   **Quant:** `git checkout quant`
*   **Hunter (Scraper):** `git checkout scrapper`

### 3.2 Environment
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Unix/Mac:
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3.3 Jurisdiction Logic
*   **Quant:** Your logic lives strictly in `backend/services/quant/`. You provide the math; you do NOT modify the API routers.
*   **Controller:** You manage the `backend/routers/` and `backend/models/`. You are the "Handshake" point for the frontend team.
*   **Hunter (Go):** 
    ```bash
    cd scraper
    go mod download
    go run main.go
    ```

---

## 🤝 4. The Handshake Protocol (All Roles)

Any change to the **Structure** or **Types** of data (The "Contract") requires a Handshake.

1.  **Request:** Propose the schema change in the team chat.
2.  **Implement:** The Controller updates `backend/models/` and the Architect updates `frontend/lib/types.ts`.
3.  **Sync:** Everyone pulls from `dev` or the domain branch to get the new types.

---

## 📤 5. Commit & Stage-Gate Procedure

1.  **Commit Message:** Prefix with your role: `[QUANT] Optimized Fair Market Value regression model`.
2.  **Push:** Push only to your assigned branch.
3.  **PR:** Open a Pull Request to your Domain Branch (`backend` or `frontend`).

---

### 📋 Setup Checklist:
- [ ] `.agent/` folder in root?
- [ ] `identity.yaml` updated?
- [ ] Switched to jurisdiction branch?
- [ ] Dependencies installed (`npm` / `pip` / `go`)?
- [ ] AI Agent briefed and jurisdiction confirmed?

---
**END OF MASTER SETUP GUIDE**
