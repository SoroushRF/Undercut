import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found. AI features will fail.")

# Configure Gemini
genai.configure(api_key=API_KEY)

# Use the fast, cost-effective Flash model
model = genai.GenerativeModel('gemini-1.5-flash')

def analyze_car_listing(make: str, model_name: str, year: int, price: float, mileage: int, description: str, user_instructions: str = None):
    """
    Sends car data to Gemini for a "Vibe Check" / Deal Analysis.
    Returns a short string verdict.
    """
    if not API_KEY:
        return "AI Error: No API Key"

    prompt = f"""
    You are a ruthless, expert car flipper. You only care about profit.
    Analyze this car listing:
    
    Vehicle: {year} {make} {model_name}
    Price: ${price}
    Mileage: {mileage} miles
    Seller Description: "{description}"
    User Specific Interests: "{user_instructions if user_instructions else 'None provided'}"

    Task:
    1. Look for red flags in the description (e.g., "rebuilt title", "needs work", "running rough").
    2. Evaluate if the price seems reasonable for the mileage (general knowledge).
    3. Take the User's specific interests into account if provided.
    4. Give a ONE SENTENCE verdict on whether this is a potential flip or a pass for THIS user.
    
    Format: "VERDICT: [Flip Potentail/Pass/Risky]. [Reasoning]"
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "AI Analysis Failed"


def generate_negotiation_script(
    make: str,
    model_name: str,
    year: int,
    listed_price: float,
    fair_market_value: float,
    mileage: int,
    deal_grade: str,
    issues: str = None,
    user_instructions: str = None,
) -> str:
    """
    Generate a negotiation script for a buyer.
    
    Uses AI to create personalized talking points based on:
    - Price vs FMV gap
    - Deal grade
    - Known issues
    
    Args:
        make: Car make
        model_name: Car model
        year: Model year
        listed_price: Seller's asking price
        fair_market_value: Our calculated FMV
        mileage: Odometer reading
        deal_grade: S/A/B/C/F
        issues: Optional known issues from description
    
    Returns:
        Negotiation script text
    """
    if not API_KEY:
        return "AI Error: No API Key configured."
    
    price_diff = listed_price - fair_market_value
    price_diff_pct = (price_diff / fair_market_value) * 100 if fair_market_value > 0 else 0
    
    # Build context for the AI
    if price_diff > 0:
        price_context = f"OVERPRICED by ${price_diff:,.0f} ({price_diff_pct:.1f}% above market value)"
    elif price_diff < 0:
        price_context = f"UNDERPRICED by ${abs(price_diff):,.0f} ({abs(price_diff_pct):.1f}% below market value)"
    else:
        price_context = "priced at market value"
    
    issues_context = issues if issues else "No specific issues identified."
    
    prompt = f"""
    You are a skilled negotiation coach helping a car buyer.
    
    THE CAR:
    - Vehicle: {year} {make} {model_name}
    - Listed Price: ${listed_price:,.0f}
    - Fair Market Value: ${fair_market_value:,.0f}
    - Status: {price_context}
    - Mileage: {mileage:,} km
    - Deal Grade: {deal_grade} (S=great, F=terrible)
    - Known Issues: {issues_context}
    - User's Specific Needs/Preferences: {user_instructions if user_instructions else 'None provided'}
    
    TASK:
    Generate a practical negotiation script the buyer can use.
    Include:
    1. Opening line (polite but firm)
    2. Key leverage points (price data, market research)
    3. Target offer price (suggest a specific number)
    4. Fallback/walk-away point
    5. Closing technique
    6. Ensure the script addresses the User's specific needs/preferences mentioned above.
    
    Keep it conversational and natural - not robotic.
    Make it specific to THIS car and price situation.
    
    Format as a script they can practice before calling the seller.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "Failed to generate negotiation script. Please try again."


def generate_quick_tips(deal_grade: str, price_diff_pct: float) -> list:
    """
    Generate quick negotiation tips without AI (instant, no API call).
    
    Returns a list of 3-5 tips based on the deal situation.
    """
    tips = []
    
    if deal_grade in ["S", "A"]:
        tips.append("🎯 This is already a good deal - don't be too aggressive or you might lose it.")
        tips.append("💡 Focus on minor issues to get a small discount, not a major price cut.")
        tips.append("⚡ Good deals go fast - be ready to act quickly.")
    
    elif deal_grade == "B":
        tips.append("📊 This is fairly priced. You have room for a 5-10% discount if you negotiate well.")
        tips.append("🔍 Research comparable listings to show the seller you've done homework.")
        tips.append("💰 Mention you're paying cash (if true) for extra leverage.")
    
    elif deal_grade in ["C", "F"]:
        tips.append(f"⚠️ This car is {abs(price_diff_pct):.0f}% overpriced. You have strong negotiating power.")
        tips.append("📉 Be prepared to walk away - there are better deals out there.")
        tips.append("🎯 Open with an offer 15-20% below asking to anchor the negotiation.")
        tips.append("🕐 Don't rush. Overpriced cars sit on the market - time is on your side.")
    
    tips.append("📱 Always get a pre-purchase inspection before finalizing any deal.")
    
    return tips

