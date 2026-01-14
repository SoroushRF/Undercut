# Undercut

Undercut is a "Data Fusion" application designed to revolutionize car pricing and negotiation. It combines real-time data scraping, market validation, and advanced AI analysis to provide users with competitive insights.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/UI, TanStack Query.
- **Backend:** FastAPI (Python), Pydantic, Google Gemini SDK.
- **Scraper:** Go (Golang) + Colly (High concurrency).
- **Database:** Supabase (PostgreSQL).
- **DevOps:** Docker, GitHub Actions, Playwright (E2E).
- **AI:** Google Gemini 1.5.

## Features

- **Real-Time Listings:** Scrapes live car listings from major platforms like AutoTrader and Clutch.
- **Market Validation:** Validates scraped listings against broader market data to identify deals.
- **AI Analysis:** Uses Google Gemini 1.5 to analyze seller descriptions for hidden risks and generate tailored negotiation scripts.
- **Deal Scoring:** Automatically grades deals based on price, mileage, and market trends.
