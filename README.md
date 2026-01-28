<div align="center">
  <img src="https://img.icons8.com/isometric/512/car.png" width="128" height="128" alt="Undercut Logo" />
  <br />
  <h1>🚗 U N D E R C U T</h1>
  <h3>AI-Powered Used Car Deal Finder for Toronto & GTA</h3>
  <p><em>Find mathematically-proven underpriced vehicles. Negotiate with confidence. Never overpay again.</em></p>
  
  <br />
  
  <img src="https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.100+-00D9D9?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Go-1.21+-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</div>

---

## 📑 Table of Contents

<details>
<summary>Click to expand</summary>

- [📖 Overview](#-overview)
- [🌟 Features](#-features)
  - [Deal Discovery & Grading](#️-1-deal-discovery--grading)
  - [Hybrid AI Analysis](#-2-hybrid-ai-analysis-the-mechanic)
  - [Negotiation Script Generator](#️-3-ai-negotiation-script-generator)
  - [TCO Calculator](#-4-total-cost-of-ownership-tco-calculator)
  - [Sniper Alerts](#-5-sniper-alerts)
  - [Saved Cars ("The Garage")](#-6-saved-cars-the-garage)
  - [User Profiles](#-7-user-profiles--progressive-authentication)
- [🛠️ Tech Stack](#️-tech-stack)
  - [Backend](#-backend-python)
  - [Frontend](#-frontend-typescript--react)
  - [Scraper](#-scraper-go)
  - [Database & Infrastructure](#-database--infrastructure)
  - [AI / Machine Learning](#-ai--machine-learning)
- [🏛️ Architecture](#️-architecture)
  - [System Diagram](#high-level-system-diagram)
  - [Directory Structure](#directory-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#1-clone-the-repository)
  - [Environment Configuration](#2-environment-configuration)
  - [Backend Setup](#3-backend-setup)
  - [Database Setup](#4-database-setup-docker)
  - [Run Backend Server](#5-run-the-backend-server)
  - [Frontend Setup](#6-frontend-setup)
  - [Scraper Setup](#7-scraper-setup-optional)
  - [Docker Compose](#8-running-the-full-stack-with-docker-compose)
- [📡 API Reference](#-api-reference)
  - [Cars API](#cars-api-cars)
  - [Users API](#users-api-users)
  - [Alerts API](#alerts-api-alerts)
- [📊 Data Models](#-data-models)
  - [Car Schema](#car-schema)
  - [User Schema](#user-schema)
  - [Alert Schema](#alert-schema)
  - [SavedCar Schema](#savedcar-schema-junction-table)
- [🧪 Testing](#-testing)
- [🗺️ Roadmap](#️-roadmap)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

</details>

---

## 📖 Overview

**Undercut** is a full-stack, monorepo-based application designed to revolutionize the used car buying experience in the **Toronto and Greater Toronto Area (GTA)** market. By combining high-frequency web scraping, sophisticated quantitative pricing algorithms, and cutting-edge Google Gemini AI analysis, Undercut empowers buyers with "unfair" market intelligence that was previously only available to professional car dealers and flippers.

### The Problem We Solve

The used car market is notoriously opaque. Buyers often lack the tools to determine if a listing is fairly priced, potentially scammy, or a genuine steal. Sellers have asymmetric information advantages. Undercut levels the playing field by:

1.  **Automated Data Aggregation**: Continuously scraping thousands of listings from major platforms like AutoTrader.ca.
2.  **Fair Market Value (FMV) Calculation**: Using quantitative algorithms to estimate what a car *should* be worth based on make, model, year, mileage, and market trends.
3.  **Deal Grading System**: Assigning every listing a transparent grade (S, A, B, C, F) based on its price relative to the calculated FMV.
4.  **AI-Powered "Vibe Check"**: Leveraging Google Gemini 1.5 Flash to analyze seller descriptions for red flags (e.g., "rebuilt title," "needs sensor," "running rough").
5.  **Personalized Negotiation Scripts**: Generating AI-driven, copy-pasteable scripts tailored to a specific car's price situation, providing buyers with actionable leverage.
6.  **Total Cost of Ownership (TCO) Insights**: Helping users understand the *real* monthly cost of a vehicle beyond just the sticker price, including fuel, depreciation, insurance, and maintenance.

---

## 🌟 Features

Undercut is packed with features designed to give car buyers a significant advantage. Below is a comprehensive breakdown of the core functionality.

### Core Product Features

#### 🏷️ 1. Deal Discovery & Grading

At the heart of Undercut is the ability to find and rank deals.

| Feature | Description |
| :--- | :--- |
| **Trending Deals Dashboard** | The landing page displays the "Top 10 Undercut Deals" in the GTA, pre-filtered for S-Tier and A-Tier listings. |
| **Advanced Search** | Users can filter by Make, Model, Year Range, Price Range, Mileage, Transmission, Fuel Type, Drivetrain, and Seller Type. |
| **Deal Grade Badges** | Every car displays a clear badge: `S` (Steal), `A` (Great), `B` (Fair), `C` (Overpriced), `F` (Avoid). |
| **Fair Market Value (FMV)** | Our Quant algorithms calculate what a car *should* cost, providing objective price context. |

**Grading Scale:**
*   **S-Tier**: Listed price is more than 10% *below* the calculated FMV. These are exceptional opportunities.
*   **A-Tier**: Listed price is 5-10% below FMV. A great deal worth pursuing quickly.
*   **B-Tier**: Listed price is within 5% of FMV. A fair market price.
*   **C-Tier**: Listed price is 5-10% *above* FMV. Buyer should negotiate aggressively.
*   **F-Tier**: Listed price is more than 10% above FMV. Avoid unless you have strong leverage.

#### 🧠 2. Hybrid AI Analysis ("The Mechanic")

Not all listings are what they seem. Our AI integration acts as a virtual expert.

| Feature | Description |
| :--- | :--- |
| **On-Demand Analysis** | AI is not run automatically on every car to save costs. Users click "Analyze This Deal" to trigger an AI scan. |
| **Red Flag Detection** | The AI scans the seller's description for concerning keywords like "rebuilt title," "needs work," "as-is," or "running rough." |
| **Gemini 1.5 Flash** | We use Google's fast and cost-effective model for instantaneous verdicts. |
| **Ruthless Buyer Prompt** | The AI is prompted to act as a "ruthless expert car flipper," providing unbiased, profit-focused verdicts. |

**Example AI Verdict:**
> `VERDICT: Pass. Description mentions "rod bearing noise" which indicates significant engine wear. High repair cost likely.`

#### 🗣️ 3. AI Negotiation Script Generator

Once a user finds a car they like, Undercut helps them negotiate the best price.

| Feature | Description |
| :--- | :--- |
| **Personalized Scripts** | The AI generates a complete, conversational negotiation script tailored to the specific car, its price vs. FMV, and any known issues. |
| **Key Leverage Points** | The script includes specific data points from our analysis to back up the buyer's position. |
| **Target Offer Price** | The AI suggests a specific number to open with, along with a walk-away point. |
| **Quick Tips (No AI)** | Instant, rule-based tips are also provided without an API call, for faster feedback. |

**Example Negotiation Script (Excerpt):**
> "Hi, I'm interested in the 2018 BMW M3. I've done my research, and based on my analysis of comparable listings in the GTA, the fair market value for this vehicle is around $62,000. Given the mileage is slightly above average and the mention of [issue], I'd like to propose an offer of $58,500. This is a fair price considering the market data..."

#### 📉 4. Total Cost of Ownership (TCO) Calculator

The sticker price is just the beginning. The TCO calculator provides a realistic view of long-term ownership costs.

| Cost Component | Calculation Method |
| :--- | :--- |
| **Monthly Fuel Cost** | Based on user's annual driving distance (from profile) and vehicle fuel type. Accounts for L/100km efficiency and current average fuel prices in Toronto (~$1.55/L). EVs use a different calculation based on kWh/100km. |
| **Monthly Depreciation** | Uses a declining balance model: 15% first year, 10% years 2-5, 5% thereafter. |
| **Monthly Insurance** | Estimates based on vehicle type (sedan, SUV, truck, luxury, sports) and value. EV premiums are factored in. |
| **Monthly Maintenance** | Based on annual KM and vehicle age. EVs have lower costs (~$15/1000km vs ~$40/1000km for gas). Older cars incur a 5%/year penalty. |
| **Total Monthly Cost** | Sum of all above components. |
| **Total Annual Cost** | `Monthly Total * 12`. |

Users can see a 5-year projection chart visualizing their cumulative costs.

#### 🔔 5. Sniper Alerts

Users can set up persistent alerts to be notified instantly when a car matching their criteria appears.

| Feature | Description |
| :--- | :--- |
| **Custom Criteria** | Set alerts based on Make, Model, Year Range, Price Max, Mileage Max, Fuel Type, Transmission, Drivetrain, and Minimum Deal Grade. |
| **Name Your Alert** | E.g., "My Dream Tesla" or "Cheap Civic Under $20k". |
| **Instant Notification** | When the Hunter scrapes a new car matching an active alert, users can be notified (email integration pending). |
| **Pause/Delete Alerts** | Full control over active alerts. |

#### 🚗 6. Saved Cars ("The Garage")

Users can save interesting listings to review and compare later.

| Feature | Description |
| :--- | :--- |
| **One-Click Save** | Add any car to your personal garage. |
| **Persistent Tracking** | Saved cars remain in your list even if the original listing is removed from the source platform. |
| **"Sold" Badge Logic** | If our scraper detects a car has been delisted, it is marked as `SOLD` or `DELETED` in the user's garage. The user still sees it (so they know it's gone), but cannot open the listing details. This is a key differentiator. |
| **30-Day Cleanup** | Sold/deleted cars are auto-removed from the garage after 30 days to keep the list clean. |

#### 👤 7. User Profiles & Progressive Authentication

Undercut is designed for a seamless experience from anonymous browsing to registered power-user.

| Feature | Description |
| :--- | :--- |
| **Guest Mode** | Users can browse, search, and see Deal Grades without logging in. Preferences are stored in browser `localStorage`. |
| **Conversion Triggers** | Attempting to Save a Car, Run AI Analysis, or View Seller Details prompts login. |
| **Google OAuth** | Sign-in is handled via Supabase Auth with Google OAuth for simplicity and security. |
| **Mandatory Onboarding** | First-time users must complete their profile (First Name, Commute Distance, Postal Code) before continuing. This data powers personalized features like TCO. |
| **Profile Sync** | Guest preferences (e.g., search filters) are transferred to the user's permanent profile upon sign-up. |

---

## 🛠️ Tech Stack

Undercut is built on a modern, polyglot technology stack optimized for performance, developer experience, and cost-efficiency.

<div align="center">

### Core Technologies

| Technology | Description |
|:---|:---|
| ![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white) | Backend API & AI integration |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white) | Type-safe frontend development |
| ![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square&logo=go&logoColor=white) | High-performance web scraper |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white) | Robust relational database |

</div>

---

### ![Python](https://img.shields.io/badge/Python-Backend-3776AB?style=flat-square&logo=python&logoColor=white)

| Technology | Purpose | Version |
| :--- | :--- | :--- |
| **FastAPI** | High-performance asynchronous web framework for building the REST API. | `^0.100` |
| **Uvicorn** | Lightning-fast ASGI server for running FastAPI. | Latest |
| **Pydantic** | Data validation and serialization using Python type hints. Powers request/response schemas. | `v2` |
| **SQLAlchemy** | SQL toolkit and ORM for database interactions. | `^2.0` |
| **psycopg2-binary** | PostgreSQL database adapter for Python. | Latest |
| **python-dotenv** | Loads environment variables from `.env` files. | Latest |
| **slowapi** | Rate limiting for FastAPI based on `limits`. | Latest |
| **google-generativeai** | Official Python SDK for Google Gemini AI models. | Latest |
| **pytest** | Mature, full-featured Python testing framework. | Latest |

---

### ![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black)

| Technology | Purpose | Version |
| :--- | :--- | :--- |
| **Next.js** | React framework with App Router, server components, and file-based routing. | `14.2.x` |
| **React** | Core UI library. | `18.x` |
| **TypeScript** | Static type checking for JavaScript. | `5.x` |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development. | `3.3.x` |
| **Radix UI** | Unstyled, accessible UI primitives (Dialog, Dropdown, Slider, Switch). | Various |
| **TanStack Query** | Powerful asynchronous state management for data fetching. | `5.x` |
| **Framer Motion** | Production-ready motion library for React animations. | `12.x` |
| **Recharts** | Composable charting library built on React components. | `3.x` |
| **Lucide React** | Beautiful, consistent, and customizable SVG icon set. | `0.300.x` |
| **Sonner** | An opinionated, beautiful toast notification library. | `2.x` |
| **CVA (Class Variance Authority)** | Utility for building type-safe component variants. | `0.7.x` |
| **tailwind-merge** | Utility for merging Tailwind CSS classes without style conflicts. | Latest |
| **tailwindcss-animate** | Plugin for adding animation utilities to Tailwind. | Latest |

---

### ![Go](https://img.shields.io/badge/Go-Scraper-00ADD8?style=flat-square&logo=go&logoColor=white)

| Technology | Purpose | Version |
| :--- | :--- | :--- |
| **Go (Golang)** | High-performance, concurrent language ideal for web scraping. | `1.21+` |
| **Playwright for Go** | Browser automation library for scraping dynamic JavaScript-rendered pages. | Latest |
| **Colly** | Elegant scraping framework for Go (used for simpler pages). | `v2` |

---

### ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)

| Technology | Purpose |
| :--- | :--- |
| **PostgreSQL** | Robust, open-source relational database. Hosted on Supabase. |
| **Supabase** | Open-source Firebase alternative providing managed PostgreSQL, Auth, and more. Utilized on the Free Tier. |
| **Docker** | Containerization for consistent development and deployment environments. |
| **Docker Compose** | Multi-container orchestration for local development (DB, Backend, Scraper). |

---

### ![Google](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white)

| Technology | Purpose |
| :--- | :--- |
| **Google Gemini 1.5 Flash** | Large Language Model for text analysis (red flag detection, negotiation scripts). Chosen for speed and cost-efficiency. |

---

## 🏛️ Architecture

Undercut follows a **monorepo architecture** with a clear separation of concerns between the backend API, frontend application, and data ingestion scraper. This structure promotes code sharing, atomic commits across components, and simplified dependency management.

### High-Level System Diagram

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                              USER (Browser)                                   │
└───────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js 14)                               │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│ │   /app (Pages)  │ │ /components/ui  │ │ /components/viz │ │ /components/  │ │
│ │ (The Integrator)│ │  (The Architect)│ │ (UX Engineer)   │ │    motion     │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └───────────────┘ │
│ ┌─────────────────┐ ┌─────────────────┐                                       │
│ │    /lib/api.ts  │ │   /lib/types.ts │  ◄── The "Contract" between FE & BE  │
│ │  (API Client)   │ │   (Types Def)   │                                       │
│ └─────────────────┘ └─────────────────┘                                       │
└───────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTP (REST API)
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND (FastAPI)                                  │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│ │  /routers/cars  │ │ /routers/users  │ │ /routers/alerts │ │    main.py    │ │
│ │  (CRUD, Search) │ │ (Profile, Auth) │ │ (Sniper Logic)  │ │  (App Entry)  │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └───────────────┘ │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│ │  /services/ai   │ │  /services/tco  │ │/services/alerts │ │/services/quant│ │
│ │ (Gemini AI SDK) │ │ (TCO Calculator)│ │ (Alert Matcher) │ │ (FMV, Grader) │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └───────────────┘ │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │                           /models/ (SQLAlchemy + Pydantic)                │ │
│ │                        car.py | user.py | alert.py                        │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ SQL (SQLAlchemy ORM)
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                       DATABASE (PostgreSQL on Supabase)                       │
│                                                                               │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌────────────────┐          │
│   │  CARS    │    │  USERS   │    │  ALERTS  │    │  SAVED_CARS    │          │
│   │  Table   │    │  Table   │    │  Table   │    │ (Junction Tbl) │          │
│   └──────────┘    └──────────┘    └──────────┘    └────────────────┘          │
└───────────────────────────────────────────────────────────────────────────────┘
                                       ▲
                                       │ HTTP POST /cars
                                       │
┌───────────────────────────────────────────────────────────────────────────────┐
│                         SCRAPER ("The Hunter" - Go)                           │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│ │     main.go     │ │  /collectors/   │ │   /analyzer/    │ │   /models/    │ │
│ │  (Entry Point)  │ │ (Playwright Bot)│ │ (Posts to API)  │ │  (CarListing) │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └───────────────┘ │
│                                                                               │
│                   Target: AutoTrader.ca (Toronto/GTA - 100km Radius)          │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
Undercut/
├── .agent/                     # AI Agent governance files (gitignored)
│   ├── SYSTEM_PROTOCOL.md      # Global AI boundaries
│   ├── ai_rules.yaml           # Structured permission rules
│   └── identity.yaml           # Active role declaration
│
├── .github/                    # GitHub-specific configuration
│   └── workflows/              # CI/CD pipelines
│
├── backend/                    # 🐍 Python FastAPI Backend
│   ├── main.py                 # Application entry point, CORS, Rate Limiting
│   ├── database.py             # SQLAlchemy engine & session factory
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Container build instructions
│   │
│   ├── models/                 # SQLAlchemy ORM Models & Pydantic Schemas
│   │   ├── __init__.py
│   │   ├── car.py              # Car model (listings)
│   │   ├── user.py             # User model & SavedCar junction table
│   │   └── alert.py            # Alert model (Sniper feature)
│   │
│   ├── routers/                # FastAPI API Route Handlers
│   │   ├── __init__.py
│   │   ├── cars.py             # /cars endpoints (CRUD, Search, TCO, Negotiate)
│   │   ├── users.py            # /users endpoints (Profile, Saved Cars)
│   │   └── alerts.py           # /alerts endpoints (Sniper CRUD)
│   │
│   ├── services/               # Business Logic Layer
│   │   ├── ai.py               # Google Gemini SDK integration
│   │   ├── tco.py              # Total Cost of Ownership calculations
│   │   ├── alerts.py           # Alert matching logic
│   │   └── quant/              # Quantitative Analysis Engine
│   │       ├── __init__.py
│   │       ├── fmv.py          # Fair Market Value estimation
│   │       └── deal_grader.py  # Deal Grade (S/A/B/C/F) calculation
│   │
│   └── tests/                  # Backend Test Suite
│       ├── conftest.py         # pytest fixtures
│       ├── test_cars.py        # Car endpoint tests
│       ├── test_users.py       # User endpoint tests
│       ├── test_alerts.py      # Alert endpoint tests
│       ├── test_services.py    # Service unit tests (Quant, TCO)
│       └── test_integration.py # End-to-end flow tests
│
├── frontend/                   # ⚛️ Next.js 14 Frontend
│   ├── package.json            # Node.js dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   ├── tailwind.config.ts      # Tailwind CSS theme & plugins
│   ├── postcss.config.js       # PostCSS configuration
│   ├── next.config.mjs         # Next.js configuration
│   │
│   ├── app/                    # Next.js App Router (Pages & Layouts)
│   │   ├── layout.tsx          # Root layout with Toaster provider
│   │   ├── page.tsx            # Landing page (Home)
│   │   ├── globals.css         # Global styles & CSS variables (theming)
│   │   ├── profile/page.tsx    # User profile page
│   │   ├── watchlist/page.tsx  # Saved cars page
│   │   ├── membership/page.tsx # Subscription page (placeholder)
│   │   └── settings/page.tsx   # User settings page (placeholder)
│   │
│   ├── components/             # React Component Library
│   │   ├── ui/                 # Atomic Design System (Buttons, Cards, Inputs, etc.)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── DealCard.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── DropdownMenu.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Sheet.tsx
│   │   │   ├── Sliders.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── ThemeSelector.tsx
│   │   │   └── ... (20+ components)
│   │   │
│   │   ├── viz/                # Data Visualization Components
│   │   │   ├── TcoChart.tsx        # TCO projection chart
│   │   │   ├── DealGradeGauge.tsx  # Visual gauge for deal grade
│   │   │   ├── PriceComparisonBar.tsx # Price vs FMV bar chart
│   │   │   └── ... (demos & exports)
│   │   │
│   │   ├── motion/             # Animation Components (Framer Motion)
│   │   │   ├── CardHover.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   ├── SoldBadge.tsx
│   │   │   ├── FreshnessBadge.tsx
│   │   │   └── ...
│   │   │
│   │   └── home/               # Page-specific component sections
│   │       └── SearchSection.tsx
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── use-cars.ts         # Data fetching hook for cars (Mock/API toggle)
│   │   └── ...
│   │
│   └── lib/                    # Shared Utilities & Types
│       ├── api.ts              # Frontend API client (fetch wrapper)
│       ├── types.ts            # TypeScript interfaces (The "Contract")
│       ├── mock-data.ts        # Mock data for UI development
│       └── utils.ts            # Utility functions (cn, etc.)
│
├── scraper/                    # 🐹 Go Web Scraper ("The Hunter")
│   ├── main.go                 # Scraper entry point
│   ├── go.mod                  # Go module definition
│   ├── go.sum                  # Go dependency lock file
│   ├── Dockerfile              # Container build instructions
│   │
│   ├── collectors/             # Scraping logic (Playwright / Colly)
│   │   └── autotrader.go       # AutoTrader.ca parser
│   │
│   ├── internal/               # Internal packages
│   │   ├── collector/          # Playwright collector wrapper
│   │   └── model/              # Go data models
│   │
│   ├── analyzer/               # Post-processing & API integration
│   │   └── api.go              # Posts scraped cars to Backend
│   │
│   └── models/                 # Data structures
│       └── car.go              # CarListing struct
│
├── docs/                       # 📚 Project Documentation
│   ├── Undercut_Master_Protocol.md # Source of Truth for governance & roles
│   ├── Product_Spec_v1.md          # Product specification (user flow, logic)
│   ├── Global_Feature_Manifest.md  # Comprehensive feature list & status
│   ├── Controller_Build_Plan.md    # Backend development phases & tasks
│   └── Setup_Guide.md              # Onboarding guide for developers
│
├── tests/                      # 🧪 E2E Tests (Playwright) [Guardian Domain]
│
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # Multi-service Docker orchestration
├── package.json                # Root-level npm scripts (monorepo tooling)
└── README.md                   # This file!
```

---

## 🚀 Getting Started

Follow these instructions to set up the Undercut development environment on your local machine.

### Prerequisites

Ensure you have the following installed:

| Requirement | Version |
|:---|:---|
| ![Node.js](https://img.shields.io/badge/Node.js-18.17+-339933?style=flat-square&logo=node.js&logoColor=white) | v18.17 or higher |
| ![npm](https://img.shields.io/badge/npm-9+-CB3837?style=flat-square&logo=npm&logoColor=white) | v9 or higher |
| ![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white) | v3.11 or higher |
| ![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square&logo=go&logoColor=white) | v1.21 or higher |
| ![Docker](https://img.shields.io/badge/Docker-Latest-2496ED?style=flat-square&logo=docker&logoColor=white) | Latest |
| ![Git](https://img.shields.io/badge/Git-Latest-F05032?style=flat-square&logo=git&logoColor=white) | Latest |

### 1. Clone the Repository

```bash
git clone https://github.com/SoroushRF/Undercut.git
cd Undercut
```

### 2. Environment Configuration

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

**`.env` File Contents:**

```dotenv
# =============================================================================
# DATABASE
# =============================================================================
# For local Docker development:
DATABASE_URL=postgresql://user:password@localhost:5432/undercut

# For Supabase (Production):
# DATABASE_URL=postgresql://postgres.[project-ref]:[password]@[region].pooler.supabase.com:6543/postgres

# =============================================================================
# GEMINI AI
# =============================================================================
GEMINI_API_KEY=your_google_gemini_api_key_here

# =============================================================================
# CORS (comma-separated origins)
# =============================================================================
CORS_ORIGINS=http://localhost:3000

# =============================================================================
# OPTIONAL: Supabase
# =============================================================================
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-anon-key
```

**Getting a Gemini API Key:**
1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create a new API key.
3.  Copy it into your `.env` file.

### 3. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Database Setup (Docker)

Start the local PostgreSQL database using Docker Compose:

```bash
# From the project root directory
docker-compose up -d db
```

This will start a PostgreSQL 15 instance on port `5432` with the credentials specified in `docker-compose.yml` (`user`/`password`).

### 5. Run the Backend Server

```bash
# From the backend directory (with venv activated)
cd backend
uvicorn main:app --reload
```

The API will be available at: `http://localhost:8000`
API documentation (Swagger UI): `http://localhost:8000/docs`

### 6. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install
# If you encounter peer dependency issues:
# npm install --legacy-peer-deps

# Start the development server
npm run dev
```

The application will be available at: `http://localhost:3000`

### 7. Scraper Setup (Optional)

The scraper is used to populate the database with real car listings.

```bash
# Navigate to the scraper directory
cd scraper

# Download Go dependencies
go mod download

# Run the scraper
go run main.go
```

**Note:** The scraper requires a Playwright browser installation. It will attempt to launch a headless Chromium browser to scrape dynamic JavaScript-rendered pages from AutoTrader.ca.

### 8. Running the Full Stack with Docker Compose

For a complete local environment, use Docker Compose:

```bash
# From the project root
docker-compose up --build
```

This starts:
*   `db`: PostgreSQL on port `5432`
*   `backend`: FastAPI on port `8000`
*   `scraper`: The Go scraper (runs once)

---

## 📡 API Reference

The Undercut backend exposes a comprehensive REST API. All endpoints are documented with Swagger UI at `/docs` when the server is running.

### Base URL

*   **Local Development:** `http://localhost:8000`
*   **Production:** (TBD)

### Authentication (Temporary)

Currently, authentication is simulated via a header. In production, this will be replaced by Supabase JWT validation.

| Header | Description |
| :--- | :--- |
| `X-User-Id` | The UUID of the user making the request. Required for authenticated endpoints. |

---

### Cars API (`/cars`)

#### `GET /cars`
Retrieve a paginated list of all active car listings.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `skip` | `int` | `0` | Number of records to skip (offset). |
| `limit` | `int` | `100` | Maximum number of records to return. |

**Response:** `List[CarResponse]`
**Rate Limit:** `30/minute`

---

#### `GET /cars/trending`
Retrieve the "Top Deals" for the landing page. Returns S and A tier deals, ordered by grade and recency.

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | `int` | `10` | Maximum number of deals to return. |

**Response:** `List[CarResponse]`
**Rate Limit:** `30/minute`

---

#### `GET /cars/{car_id}`
Retrieve a single car by its ID.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `car_id` | `str` (path) | The unique identifier of the car. |

**Response:** `CarResponse`
**Rate Limit:** `60/minute`

---

#### `POST /cars`
Ingest a new car listing. Primarily used by the scraper.

**Request Body:** `CarCreate` schema (see Data Models).

**Response:** `CarResponse`
**Rate Limit:** None (internal use)

**Behavior:**
*   If a car with the same VIN exists, returns the existing record.
*   Automatically calculates FMV and Deal Grade upon insertion.

---

#### `POST /cars/search`
Advanced search with multiple filter criteria.

**Request Body:** `CarSearchFilters`

| Field | Type | Description |
| :--- | :--- | :--- |
| `query` | `str` | Free-text search (matches make or model). |
| `make` | `str` | Filter by manufacturer. |
| `model` | `str` | Filter by model name. |
| `year_min` | `int` | Minimum year. |
| `year_max` | `int` | Maximum year. |
| `price_min` | `float` | Minimum price. |
| `price_max` | `float` | Maximum price. |
| `mileage_max` | `int` | Maximum mileage (KM). |
| `transmission` | `str` | `automatic`, `manual`, `cvt`. |
| `fuel_type` | `str` | `gasoline`, `electric`, `hybrid`, etc. |
| `drivetrain` | `str` | `fwd`, `rwd`, `awd`, `4wd`. |
| `seller_type` | `str` | `dealer`, `private`. |
| `deal_grade` | `str` | Filter by specific grade (S, A, B, C, F). |
| `only_good_deals` | `bool` | If `true`, only returns S and A grade cars. |
| `skip` | `int` | Pagination offset. |
| `limit` | `int` | Pagination limit (max 100). |

**Response:** `List[CarResponse]`
**Rate Limit:** `20/minute`

---

#### `POST /cars/{car_id}/analyze`
Trigger AI analysis for a specific car listing.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `car_id` | `str` (path) | The unique identifier of the car. |

**Response:** `CarResponse` (with updated `ai_verdict` field)
**Rate Limit:** `10/minute` (AI calls are expensive)

---

#### `POST /cars/{car_id}/tco`
Calculate Total Cost of Ownership for a specific car.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `car_id` | `str` (path) | The unique identifier of the car. |

**Request Body:** `TCORequest`

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `annual_km` | `int` | `15000` | Expected annual driving distance. |
| `fuel_price` | `float` | `None` | Override fuel price (CAD/L). |
| `vehicle_type` | `str` | `"sedan"` | `sedan`, `suv`, `truck`, `luxury`, `sports`. |

**Response:** `TCOResponse`

| Field | Type | Description |
| :--- | :--- | :--- |
| `car_id` | `str` | The car ID. |
| `car_title` | `str` | e.g., "2020 Honda Civic". |
| `purchase_price` | `float` | The car's listed price. |
| `monthly_total` | `float` | Sum of all monthly costs. |
| `monthly_fuel` | `float` | Estimated monthly fuel cost. |
| `monthly_depreciation` | `float` | Estimated monthly depreciation. |
| `monthly_insurance` | `float` | Estimated monthly insurance. |
| `monthly_maintenance` | `float` | Estimated monthly maintenance. |
| `annual_total` | `float` | `monthly_total * 12`. |
| `assumptions` | `dict` | Assumptions used in calculation. |

**Rate Limit:** `30/minute`

---

#### `POST /cars/{car_id}/negotiate`
Generate an AI-powered negotiation script for a specific car.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `car_id` | `str` (path) | The unique identifier of the car. |

**Request Body:** `NegotiationRequest`

| Field | Type | Description |
| :--- | :--- | :--- |
| `known_issues` | `str` (optional) | Any known problems with the car. |

**Response:** `NegotiationResponse`

| Field | Type | Description |
| :--- | :--- | :--- |
| `car_id` | `str` | The car ID. |
| `car_title` | `str` | e.g., "2020 Honda Civic". |
| `deal_grade` | `str` | S/A/B/C/F. |
| `listed_price` | `float` | Seller's asking price. |
| `fair_market_value` | `float` | Our calculated FMV. |
| `price_difference` | `float` | `listed_price - fair_market_value`. |
| `price_difference_pct` | `float` | Percentage difference. |
| `script` | `str` | The AI-generated negotiation script. |
| `quick_tips` | `list[str]` | Instant tips (no AI call). |

**Rate Limit:** `10/minute` (AI calls are expensive)

---

### Users API (`/users`)

#### `POST /users`
Create a new user after OAuth sign-up.

**Request Body:** `UserCreate`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `str` | Supabase Auth UUID. |
| `email` | `EmailStr` | User's email address. |

**Response:** `UserResponse`

---

#### `GET /users/me`
Get the current authenticated user's profile.

**Headers:** `X-User-Id: <user_uuid>`

**Response:** `UserResponse`
**Rate Limit:** `60/minute`

---

#### `PATCH /users/me`
Update the current user's profile.

**Headers:** `X-User-Id: <user_uuid>`

**Request Body:** `UserProfileUpdate`

| Field | Type | Description |
| :--- | :--- | :--- |
| `first_name` | `str` | User's first name. |
| `last_name` | `str` | User's last name. |
| `commute_distance_km` | `int` | Daily commute in KM. |
| `family_size` | `int` | Number of passengers. |
| `postal_code` | `str` | For proximity features. |
| `preferences` | `dict` | Flexible JSON preferences. |

**Response:** `UserResponse`
**Rate Limit:** `30/minute`

**Behavior:** If `first_name` is set for the first time, automatically sets `profile_complete = True`.

---

#### `DELETE /users/me`
Delete the current user's account and all associated data.

**Headers:** `X-User-Id: <user_uuid>`

**Response:** `204 No Content`

---

#### `GET /users/saved-cars`
Get all cars saved by the current user.

**Headers:** `X-User-Id: <user_uuid>`

**Response:** `List[CarResponse]`
**Rate Limit:** `30/minute`

**Note:** Returns cars even if their status is `sold` or `deleted`. The frontend should display a "SOLD" badge.

---

#### `POST /users/saved-cars/{car_id}`
Save a car to the current user's garage.

**Headers:** `X-User-Id: <user_uuid>`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `car_id` | `str` (path) | The ID of the car to save. |

**Response:** `SavedCarResponse`
**Rate Limit:** `30/minute`

---

#### `DELETE /users/saved-cars/{car_id}`
Remove a car from the current user's garage.

**Headers:** `X-User-Id: <user_uuid>`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `car_id` | `str` (path) | The ID of the car to remove. |

**Response:** `204 No Content`
**Rate Limit:** `30/minute`

---

### Alerts API (`/alerts`)

#### `POST /alerts`
Create a new Sniper alert for the current user.

**Headers:** `X-User-Id: <user_uuid>`

**Request Body:** `AlertCreate`

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | `str` | User-friendly name (e.g., "My Dream Tesla"). |
| `make` | `str` | Car make to match. |
| `model` | `str` | Car model to match. |
| `year_min` | `int` | Minimum year. |
| `year_max` | `int` | Maximum year. |
| `price_max` | `float` | Alert if price is below this. |
| `mileage_max` | `int` | Alert if mileage is below this. |
| `transmission` | `str` | Transmission type. |
| `fuel_type` | `str` | Fuel type. |
| `drivetrain` | `str` | Drivetrain type. |
| `deal_grade_min` | `str` | Minimum deal grade (e.g., "A" = S or A). |

**Response:** `AlertResponse`
**Rate Limit:** `10/minute`

---

#### `GET /alerts`
Get all alerts for the current user.

**Headers:** `X-User-Id: <user_uuid>`

**Response:** `List[AlertResponse]`
**Rate Limit:** `30/minute`

---

#### `DELETE /alerts/{alert_id}`
Delete a specific alert.

**Headers:** `X-User-Id: <user_uuid>`

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `alert_id` | `str` (path) | The ID of the alert to delete. |

**Response:** `204 No Content`
**Rate Limit:** `30/minute`

---

## 📊 Data Models

This section documents the core data schemas used across the application.

### Car Schema

**Database Table:** `cars`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (PK)` | Unique identifier (UUID). |
| `vin` | `String (Indexed)` | Vehicle Identification Number (17 chars). |
| `make` | `String (Indexed)` | Manufacturer (e.g., Toyota). |
| `model` | `String (Indexed)` | Model name (e.g., Camry). |
| `year` | `Integer (Indexed)` | Manufacturing year. |
| `trim` | `String (Nullable)` | Trim level (e.g., Sport, Touring). |
| `transmission` | `String (Nullable)` | `automatic`, `manual`, `cvt`. |
| `fuel_type` | `String (Nullable)` | `gasoline`, `diesel`, `electric`, `hybrid`, `plugin_hybrid`. |
| `drivetrain` | `String (Nullable)` | `fwd`, `rwd`, `awd`, `4wd`. |
| `price` | `Float` | Listed price in CAD. |
| `currency` | `String` | Currency code (default: `CAD`). |
| `mileage` | `Integer` | Odometer reading in KM. |
| `postal_code` | `String (Nullable)` | For proximity filtering. |
| `seller_type` | `String (Nullable)` | `dealer`, `private`. |
| `listing_url` | `String` | Original listing URL. |
| `image_url` | `String (Nullable)` | Main display image URL. |
| `description` | `String (Nullable)` | Raw seller description. |
| `created_at` | `DateTime` | Record creation timestamp (UTC). |
| `last_seen_at` | `DateTime (Nullable)` | When the scraper last verified the listing. |
| `status` | `String` | `active`, `sold`, `deleted`. |
| `fair_market_value` | `Float (Nullable)` | Calculated FMV. |
| `deal_grade` | `String (Nullable)` | `S`, `A`, `B`, `C`, `F`. |
| `ai_verdict` | `String (Nullable)` | Gemini AI analysis result. |

### User Schema

**Database Table:** `users`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (PK)` | Supabase Auth UUID. |
| `email` | `String (Unique, Indexed)` | User's email address. |
| `first_name` | `String (Nullable)` | User's first name. |
| `last_name` | `String (Nullable)` | User's last name. |
| `commute_distance_km` | `Integer (Nullable)` | Daily commute in KM. |
| `family_size` | `Integer (Nullable)` | Number of passengers. |
| `postal_code` | `String (Nullable)` | For proximity features. |
| `preferences` | `JSON (Nullable)` | Flexible preferences object. |
| `profile_complete` | `Boolean` | Has the user completed onboarding? |
| `created_at` | `DateTime` | Account creation timestamp. |
| `updated_at` | `DateTime` | Last profile update timestamp. |

### Alert Schema

**Database Table:** `alerts`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (PK)` | Unique identifier. |
| `user_id` | `String (Indexed)` | FK to `users.id`. |
| `name` | `String (Nullable)` | User-defined alert name. |
| `make` | `String (Nullable)` | Car make filter. |
| `model` | `String (Nullable)` | Car model filter. |
| `year_min` | `Integer (Nullable)` | Minimum year filter. |
| `year_max` | `Integer (Nullable)` | Maximum year filter. |
| `price_max` | `Float (Nullable)` | Maximum price filter. |
| `mileage_max` | `Integer (Nullable)` | Maximum mileage filter. |
| `transmission` | `String (Nullable)` | Transmission filter. |
| `fuel_type` | `String (Nullable)` | Fuel type filter. |
| `drivetrain` | `String (Nullable)` | Drivetrain filter. |
| `deal_grade_min` | `String (Nullable)` | Minimum deal grade filter. |
| `is_active` | `Boolean` | Is the alert enabled? |
| `created_at` | `DateTime` | Alert creation timestamp. |
| `last_triggered_at` | `DateTime (Nullable)` | When the alert last matched a car. |

### SavedCar Schema (Junction Table)

**Database Table:** `saved_cars`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (PK)` | Unique identifier. |
| `user_id` | `String (Indexed)` | FK to `users.id`. |
| `car_id` | `String (Indexed)` | FK to `cars.id`. |
| `saved_at` | `DateTime` | When the car was saved. |

---

## 🧪 Testing

Undercut has a comprehensive test suite covering unit, service, and integration tests.

### Backend Tests

The backend uses `pytest` for testing.

```bash
# Navigate to the backend directory
cd backend

# Activate virtual environment
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run a specific test file
pytest tests/test_cars.py

# Run a specific test function
pytest tests/test_cars.py::test_create_car
```

#### Test Suite Structure

| File | Scope | Description |
| :--- | :--- | :--- |
| `conftest.py` | Fixtures | Shared fixtures (test database, test client, mock data). |
| `test_cars.py` | Unit | Car CRUD endpoints, validation. |
| `test_users.py` | Unit | User profile, saved cars endpoints. |
| `test_alerts.py` | Unit | Alert CRUD endpoints. |
| `test_services.py` | Unit | Service layer tests (Quant FMV, Deal Grader, TCO, Alert Matcher). |
| `test_integration.py` | E2E | Full flow tests (Search, Trending, Saved Cars). |

#### Test Configuration

Tests use an **in-memory SQLite database** by default, overriding the production PostgreSQL connection. This is configured in `conftest.py`:

```python
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
```

**Test Coverage Goals:**
*   Car CRUD: ✅ Covered
*   User CRUD: ✅ Covered
*   Alert CRUD: ✅ Covered
*   Quant Service (FMV, Deal Grader): ✅ Covered
*   TCO Calculator: ✅ Covered
*   Alert Matcher: ✅ Covered
*   Search Endpoint: ✅ Covered
*   Trending Endpoint: ✅ Covered
*   AI Service (Mocked): ⏳ Deferred

### Frontend Tests (Planned)

End-to-end browser tests using Playwright are planned for the `tests/` directory (Guardian Domain). These will cover:

*   Landing page rendering.
*   Search functionality.
*   Authentication flow.
*   Deal card interactions.
*   TCO chart display.

---

## 🗺️ Roadmap

Undercut is under active development. Below is a high-level overview of planned features and improvements.

### Current Status

| Phase | Status | Description |
| :--- | :--- | :--- |
| **Phase 1-10** | ✅ Complete | Backend API, Quant Services, AI Integration, TCO, Negotiation, User Profiles, Saved Cars, Alerts, Testing, Dockerization. |
| **Frontend Core** | 🔄 In Progress | Landing page, Navbar, Deal Cards, Theming, Basic Routing, API Integration. |
| **Scraper Core** | 🔄 In Progress | AutoTrader.ca Playwright bot, data ingestion pipeline. |

### Upcoming Features

#### Short-Term (Q1 2026)

| Feature | Domain | Description |
| :--- | :--- | :--- |
| **Supabase Auth Integration** | Backend | Replace mock auth header with proper JWT validation from Supabase. |
| **Row-Level Security (RLS)** | Backend | Enable Postgres RLS to secure data at the database level. |
| **Profile Page UI** | Frontend | Implement a functional profile editing page. |
| **Watchlist Page UI** | Frontend | Display saved cars with proper "Sold" badges for delisted vehicles. |
| **Car Detail Page** | Frontend | Full car view with all specs, AI analysis, TCO, and negotiation script. |
| **Search Results Page** | Frontend | Display search results with filters and sorting. |

#### Mid-Term (Q2-Q3 2026)

| Feature | Domain | Description |
| :--- | :--- | :--- |
| **Email Notifications** | Backend | Send email alerts when a Sniper alert matches a new car. |
| **Scheduled Scraping** | Scraper | Implement a cron job for hourly/daily scraping cycles. |
| **Delta Detection** | Scraper | Detect when a car is removed from the source platform and mark as `sold`. |
| **Price History Tracking** | Backend | Log price changes over time for each listing. |
| **Comparison Tool** | Frontend | Side-by-side comparison of multiple saved cars. |
| **Mobile Responsiveness** | Frontend | Ensure full mobile optimization. |

#### Long-Term (Q4 2026+)

| Feature | Domain | Description |
| :--- | :--- | :--- |
| **Multi-Market Expansion** | All | Expand beyond Toronto/GTA to other Canadian cities (Vancouver, Montreal, Calgary). |
| **Membership/Subscription** | All | Implement tiered access (Free, Premium) with gated features. |
| **Advanced FMV Model** | Quant | Replace placeholder FMV with a machine learning model trained on historical sales data. |
| **VIN Decoding** | Backend | Integrate with a VIN decoding service for comprehensive vehicle spec lookup. |
| **Vehicle History Reports** | Backend | Partner with Carfax or AutoCheck to provide integrated history reports. |

---

## 📄 License

This project is proprietary and not open-source at this time. All rights reserved.

---

## 🙏 Acknowledgements

<div align="center">

| Technology | Contribution |
|:---|:---|
| ![Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white) | Powering intelligent analysis and negotiation features |
| ![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=flat-square&logo=supabase&logoColor=white) | Managed PostgreSQL and Auth solution |
| ![Radix](https://img.shields.io/badge/Shadcn_/_Radix-UI-161618?style=flat-square&logo=radixui&logoColor=white) | Beautiful, accessible component primitives |

</div>

---

<div align="center">
  <br />
  <h2>❤️</h2>
  <strong>Made with love in Toronto</strong>
  <br />
  <br />
  <em>"Never overpay for a car again."</em>
  <br />
  <br />
</div>
