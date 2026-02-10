'use client';

/**
 * DealGradeGauge Demo/Test Component
 * 
 * PURPOSE:
 * Demonstrates the DealGradeGauge component with all possible grades.
 * Used for visual testing and development.
 * 
 * This file is NOT part of the production build - it's purely for dev/testing.
 * Delete or move to a separate demo route when ready for production.
 * 
 * SHOWS:
 * - All 5 grades: S, A, B, C, F
 * - Null state (no data)
 * - Component props in action
 */

import { DealGradeGauge } from './DealGradeGauge';
import { DealGrade } from '@/lib/types';

// ============================================================================
// DEMO DATA
// ============================================================================

const DEMO_GRADES: (DealGrade | null)[] = ['S', 'A', 'B', 'C', 'F', null];

// ============================================================================
// DEMO COMPONENT
// ============================================================================

export const DealGradeGaugeDemo = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Deal Grade Gauge - Component Demo
          </h1>
          <p className="text-gray-600">
            Interactive speedometer visualization for car deal ratings (S-Tier to F-Tier)
          </p>
        </div>

        {/* Grid of all grades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEMO_GRADES.map((grade) => (
            <div
              key={grade || 'null'}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {/* Card title */}
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  {grade ? `Grade: ${grade}` : 'No Grade'}
                </h2>
                {/* Explanation text for each grade */}
                {grade === 'S' && (
                  <p className="text-sm text-emerald-600 mt-1">
                    🎯 Steal - 10%+ below market value
                  </p>
                )}
                {grade === 'A' && (
                  <p className="text-sm text-green-600 mt-1">
                    ✨ Great - 5-9% below market value
                  </p>
                )}
                {grade === 'B' && (
                  <p className="text-sm text-yellow-600 mt-1">
                    ⚖️ Fair - At market value
                  </p>
                )}
                {grade === 'C' && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ Caution - Slightly overpriced
                  </p>
                )}
                {grade === 'F' && (
                  <p className="text-sm text-red-600 mt-1">
                    ❌ Avoid - Overpriced
                  </p>
                )}
                {!grade && (
                  <p className="text-sm text-gray-500 mt-1">
                    Loading or no data available
                  </p>
                )}
              </div>

              {/* Gauge component */}
              <DealGradeGauge dealGrade={grade} showLabel={true} />
            </div>
          ))}
        </div>

        {/* Usage example section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage Example</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import { DealGradeGauge } from '@/components/viz/DealGradeGauge';
import { MOCK_CARS } from '@/lib/mock-data';

export function CarCard({ carId }: { carId: string }) {
  // Find the car from mock data
  const car = MOCK_CARS.find(c => c.id === carId);
  
  // Render the gauge with the car's deal grade
  return (
    <div>
      <h2>{car?.make} {car?.model}</h2>
      
      {/* Pass the deal_grade prop from the car object */}
      <DealGradeGauge dealGrade={car?.deal_grade || null} />
    </div>
  );
}`}</pre>
        </div>

        {/* Technical notes */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📝 Component Technical Details
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              <strong>Location:</strong> <code>frontend/components/viz/DealGradeGauge.tsx</code>
            </li>
            <li>
              <strong>Props:</strong> dealGrade (DealGrade | null), showLabel (boolean)
            </li>
            <li>
              <strong>Visualization:</strong> SVG-based semi-circular gauge with rotating needle
            </li>
            <li>
              <strong>Colors:</strong> Green (S) → Yellow (B) → Red (F) gradient
            </li>
            <li>
              <strong>Responsive:</strong> Uses Tailwind's responsive classes (w-48 h-24)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
