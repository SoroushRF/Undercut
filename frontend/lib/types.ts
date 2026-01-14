export interface Car {
  id: string;
  title: string;
  price: number;
  currency: "CAD";
  mileage: { value: number; unit: "km" };
  market_analysis: {
    is_good_deal: boolean;
    gemini_verdict: string; // AI generated negotiation advice
  };
}
