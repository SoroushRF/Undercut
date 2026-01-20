'use client';

/**
 * PriceComparisonBar Demo/Test Component
 * 
 * PURPOSE:
 * Demonstrates the PriceComparisonBar component with different price scenarios.
 * Shows: Great Deals, Overpriced, At Market, and No Data scenarios.
 */

import { PriceComparisonBar } from './PriceComparisonBar';
import { MOCK_CARS } from '@/lib/mock-data';

// ============================================================================
// DEMO SCENARIOS
// ============================================================================

const DEMO_SCENARIOS = [
  {
    title: 'Great Deal (Listed < FMV)',
    description: 'This car is 7% below market value - good savings!',
    listedPrice: 45000,
    fairMarketValue: 48500,
  },
  {
    title: 'Overpriced (Listed > FMV)',
    description: 'This car is 12% above market value - avoid!',
    listedPrice: 42500,
    fairMarketValue: 38000,
  },
  {
    title: 'At Market (Listed ≈ FMV)',
    description: 'Fair price, nothing special but reasonable.',
    listedPrice: 52000,
    fairMarketValue: 51500,
  },
  {
    title: 'No Market Data Yet',
    description: 'FMV still calculating - will show up soon.',
    listedPrice: 65000,
    fairMarketValue: null,
  },
];

// ============================================================================
// DEMO COMPONENT
// ============================================================================

export const PriceComparisonBarDemo = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Price Comparison Bar - Component Demo
          </h1>
          <p className="text-gray-600">
            Visual comparison between Listed Price and Fair Market Value (FMV)
          </p>
        </div>

        {/* Demo Scenarios */}
        <div className="space-y-6">
          {DEMO_SCENARIOS.map((scenario, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {/* Scenario Title */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {scenario.title}
                </h2>
                <p className="text-sm text-gray-600">{scenario.description}</p>
              </div>

              {/* Component */}
              <PriceComparisonBar
                listedPrice={scenario.listedPrice}
                fairMarketValue={scenario.fairMarketValue}
                currency="CAD"
              />
            </div>
          ))}
        </div>

        {/* Real Mock Data Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Real Mock Data Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_CARS.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-md p-6">
                {/* Car Title */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {car.year} {car.make} {car.model}
                  </h3>
                  {car.trim && (
                    <p className="text-sm text-gray-600">{car.trim}</p>
                  )}
                </div>

                {/* Component */}
                <PriceComparisonBar
                  listedPrice={car.price}
                  fairMarketValue={car.fair_market_value}
                  currency={car.currency}
                />

                {/* AI Verdict */}
                {car.ai_verdict && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                    <strong>AI Verdict:</strong> {car.ai_verdict}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Usage Example */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage Example</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import { PriceComparisonBar } from '@/components/viz';
import { MOCK_CARS } from '@/lib/mock-data';

export function CarDetail({ carId }: { carId: string }) {
  const car = MOCK_CARS.find(c => c.id === carId);
  
  return (
    <div>
      <h1>{car?.year} {car?.make} {car?.model}</h1>
      
      {/* Show price comparison */}
      <PriceComparisonBar
        listedPrice={car?.price || 0}
        fairMarketValue={car?.fair_market_value}
        currency={car?.currency}
      />
    </div>
  );
}`}</pre>
        </div>

        {/* Technical Notes */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            📝 Component Technical Details
          </h3>
          <ul className="text-sm text-green-800 space-y-2">
            <li>
              <strong>Location:</strong> <code>frontend/components/viz/PriceComparisonBar.tsx</code>
            </li>
            <li>
              <strong>Props:</strong> listedPrice (number), fairMarketValue (number | null), currency (string)
            </li>
            <li>
              <strong>Color Logic:</strong> Green (good deal) → Yellow (at market) → Red (overpriced)
            </li>
            <li>
              <strong>Calculation:</strong> Percentage diff = (FMV - Listed) / FMV * 100
            </li>
            <li>
              <strong>Responsive:</strong> Bars scale to max value for clear comparison
            </li>
            <li>
              <strong>Currency Formatting:</strong> Uses Intl.NumberFormat for CAD
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
