import { Car } from "./types";

export const MOCK_CARS: Car[] = [
  {
    id: "1",
    title: "2021 Telsa Model 3 Long Range",
    price: 45000,
    currency: "CAD",
    mileage: { value: 32000, unit: "km" },
    market_analysis: {
      is_good_deal: true,
      gemini_verdict: "High resale value and clean history. Recommended for immediate negotiation.",
    },
  },
  {
    id: "2",
    title: "2019 Honda Civic Type R",
    price: 42500,
    currency: "CAD",
    mileage: { value: 55000, unit: "km" },
    market_analysis: {
      is_good_deal: false,
      gemini_verdict: "Priced 15% above market average. Seller description mentions recent track use. Proceed with caution.",
    },
  },
  {
    id: "3",
    title: "2023 BMW M3 Competition",
    price: 98000,
    currency: "CAD",
    mileage: { value: 4500, unit: "km" },
    market_analysis: {
      is_good_deal: true,
      gemini_verdict: "Rare configuration with low mileage. Price analysis shows this is at the 25th percentile of market listings.",
    },
  },
];
