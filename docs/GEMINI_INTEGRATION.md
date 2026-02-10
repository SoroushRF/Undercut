# 🧠 Gemini AI Integration: "The Negotiator & The Expert"

In Undercut, **Google Gemini AI** (using the `gemini-1.5-flash` model) acts as the intelligent core of the application, transforming raw car listing data into actionable insights for the user.

## 🚀 Key AI Features

### 1. The "Vibe Check" (AI Deal Analysis)
Gemini analyzes car descriptions for hidden red flags that traditional filters miss. It identifies:
- **Title Issues**: Rebuilt, salvage, or non-clean titles.
- **Mechanical Warnings**: "Runs rough," "Needs TLC," or specific part failures.
- **Urgency/Motivation**: Identifying "must sell" situations to leverage during negotiation.
- **Custom Matching**: Gemini takes user-specific instructions (e.g., "Must have leather seats") and checks the description to verify if the car actually matches the user's dream criteria.

### 2. The Negotiation Script Generator
Instead of just showing a price, Undercut prepares the user for the actual transaction. Gemini generates a **personalized phone/text script** based on:
- The **Market Gap**: How much the car is over/underpriced vs. Fair Market Value.
- The **Deal Grade**: S, A, B, C, or F tier.
- **Leverage Points**: Specific issues noticed in the inspection or description.
- **User Goals**: Ensuring the script addresses the user's specific priorities (e.g., reliability vs. price).

## 🛠️ Implementation Details

- **Model**: `gemini-1.5-flash` for high-speed, cost-effective reasoning.
- **Architecture**: Integrated via a dedicated Python service (`backend/services/ai.py`) with strict rate limiting to protect API quotas.
- **Prompt Engineering**: We use role-based prompts (e.g., "You are a ruthless, expert car flipper") to ensure the AI provides blunt, honest, and high-value advice rather than generic summaries.

---
*Undercut: Making every car buyer as expert as a dealer.*
