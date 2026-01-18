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

def analyze_car_listing(make: str, model_name: str, year: int, price: float, mileage: int, description: str):
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

    Task:
    1. Look for red flags in the description (e.g., "rebuilt title", "needs work", "running rough").
    2. Evaluate if the price seems reasonable for the mileage (general knowledge).
    3. Give a ONE SENTENCE verdict on whether this is a potential flip or a pass.
    
    Format: "VERDICT: [Flip Potentail/Pass/Risky]. [Reasoning]"
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "AI Analysis Failed"
