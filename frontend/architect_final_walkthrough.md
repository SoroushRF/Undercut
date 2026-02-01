# 🏗️ Final Architectural Walkthrough: Finishing the "Undercut" Core

This walkthrough outlines the technical execution plan for the final 5 architectural pillars. Once these are complete, the project will be ready for the **Integrator** to build full business logic.

---

## 🛠️ Phase 1: Semantic Color Expansion
**Goal:** Replace hard-coded greens/reds with theme-aware status variables.

1.  **CSS Update**: Open `globals.css` and add `--success`, `--warning`, and `--destructive` (if missing) to both `:root` and `.dark` blocks.
    *   *Light*: Success = Emerald 600, Warning = Amber 500.
    *   *Midnight*: Success = Green 400, Warning = Orange 400.
2.  **Tailwind Configuration**: Update `tailwind.config.ts` to map these new HSL variables.
3.  **Component Refactor**: Update `Badge.tsx` and `SoldBadge.tsx` to use `bg-success` instead of `bg-green-600`.

---

## 🔔 Phase 2: The Feedback Engine (Toasts)
**Goal:** Provide professional, non-intrusive feedback for user actions.

1.  **Installation**: Run `npm install sonner`.
2.  **Global Provider**: Add the `<Toaster />` component to `frontend/app/layout.tsx`.
3.  **Theme Sync**: Configure the toaster to use the `theme="system"` and custom `toastOptions` so that backgrounds match our `bg-card` and borders match `border-border`.

---

## 📂 Phase 3: Advanced Interaction Layers (Radix)
**Goal:** Implement complex overlays like sidebars (Sheets) and dropdowns.

1.  **Dropdown Menu**:
    *   Install `@radix-ui/react-dropdown-menu`.
    *   Create `components/ui/Dropdown.tsx`.
    *   Implement as an "Atom": Trigger -> Content -> Items.
2.  **The Sheet (Drawer)**:
    *   Install `@radix-ui/react-dialog` (Radix uses Dialog for Sheets).
    *   Create `components/ui/Sheet.tsx`.
    *   Add animations for "Slide in from Right" for mobile filters.
3.  **Navbar Implementation**: Replace the static "Profile" button in `Navbar.tsx` with a functional `DropdownMenu`.

---

## 🚧 Phase 4: Resilient UI Atoms
**Goal:** Create "Safety Net" components for a polished production feel.

1.  **EmptyState Component**: Create `components/ui/EmptyState.tsx`.
    *   Props: `icon`, `title`, `description`, `actionLabel`, `onAction`.
    *   Visuals: Large centered icon, muted text, and a primary CTA button.
2.  **ErrorState Component**: Create `components/ui/ErrorState.tsx`.
    *   Visuals: Red-tinted warning icon and a "Refresh Page" button.

---

## 📐 Phase 5: Iconographic & Typographic Standardization
**Goal:** Ensure visual consistency across the entire app.

1.  **Shared Icon Config**: Create a helper class or component to force `strokeWidth={2}` and `size={20}` on all Lucide icons.
2.  **Global Selection**: Update the CSS `::selection` to use your Purple theme accent color (`bg-primary/20`) to make the app feel proprietary during copy/paste actions.

---

### ✅ **Expected Result**
After these 5 phases, you will have a **Total Design System**. You can say "Show a success toast" or "Open the filter drawer," and it will take exactly 1 line of code to implement.
