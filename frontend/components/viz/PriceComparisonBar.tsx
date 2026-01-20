'use client';

/**
 * PriceComparisonBar Component
 * 
 * PURPOSE:
 * Visual comparison between Listed Price and Fair Market Value (FMV).
 * Helps users understand if the car is overpriced, fairly priced, or a deal.
 * 
 * VISUAL LOGIC:
 * - Shows two horizontal bars side-by-side
 * - Listed Price (gray) vs Fair Market Value (colored)
 * - Bars scale to the max of the two values
 * - Color coding:
 *   🟢 Green: Listed < FMV (buyer's advantage - good deal)
 *   🔴 Red: Listed > FMV (seller's advantage - overpriced)
 *   🟡 Yellow: Listed ≈ FMV (at market)
 * 
 * INPUTS:
 * - listedPrice: number (in CAD)
 * - fairMarketValue: number | null (FMV in CAD, or null if not calculated)
 * - currency: string (default: "CAD")
 * 
 * USAGE:
 * <PriceComparisonBar 
 *   listedPrice={45000} 
 *   fairMarketValue={48500}
 * />
 * 
 * Last updated: 2026-01-19
 */

import { useMemo } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PriceComparisonBarProps {
  listedPrice: number;
  fairMarketValue: number | null;
  currency?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determines the color and status based on price comparison
 * Returns: { color, bgColor, textColor, status, savings }
 */
const getPriceStatus = (listed: number, fmv: number | null) => {
  if (!fmv) {
    return {
      color: '#9ca3af',
      bgColor: 'bg-gray-400',
      textColor: 'text-gray-700',
      status: 'No market data',
      savings: 0,
      savingsPercentage: 0,
    };
  }

  const difference = fmv - listed;
  const percentageDiff = (difference / fmv) * 100;

  // Good deal: Listed is 5%+ below FMV
  if (percentageDiff >= 5) {
    return {
      color: '#10b981',
      bgColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      status: 'Great deal!',
      savings: difference,
      savingsPercentage: percentageDiff,
    };
  }

  // Fair: Listed is within -5% to +5% of FMV
  if (percentageDiff >= -5 && percentageDiff < 5) {
    return {
      color: '#eab308',
      bgColor: 'bg-yellow-400',
      textColor: 'text-yellow-700',
      status: 'At market',
      savings: difference,
      savingsPercentage: percentageDiff,
    };
  }

  // Overpriced: Listed is 5%+ above FMV
  return {
    color: '#ef4444',
    bgColor: 'bg-red-500',
    textColor: 'text-red-700',
    status: 'Overpriced',
    savings: difference, // Will be negative
    savingsPercentage: percentageDiff, // Will be negative
  };
};

/**
 * Format currency to CAD
 */
const formatPrice = (price: number, currency = 'CAD') => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
};

// ============================================================================
// COMPONENT: PriceComparisonBar
// ============================================================================

export const PriceComparisonBar = ({
  listedPrice,
  fairMarketValue,
  currency = 'CAD',
}: PriceComparisonBarProps) => {
  // Calculate status and styling
  const status = useMemo(
    () => getPriceStatus(listedPrice, fairMarketValue),
    [listedPrice, fairMarketValue]
  );

  // Calculate bar widths (scale to max value)
  const maxPrice = Math.max(listedPrice, fairMarketValue || listedPrice);
  const listedBarWidth = (listedPrice / maxPrice) * 100;
  const fmvBarWidth = (fairMarketValue ? (fairMarketValue / maxPrice) * 100 : 0);

  return (
    <div className="space-y-4">
      {/* 
        HEADER SECTION
        Shows title and status indicator with discount/premium info
      */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Price Analysis</h3>
        {fairMarketValue && (
          <div className={`text-xs font-bold px-2 py-1 rounded ${status.bgColor} bg-opacity-20 ${status.textColor}`}>
            {status.status}
          </div>
        )}
      </div>

      {/* 
        PRICE DISPLAY
        Shows listed price and FMV side-by-side (no bars, just clean prices)
      */}
      <div className="grid grid-cols-2 gap-4">
        {/* Listed Price */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="text-xs font-medium text-gray-600 mb-1">Listed Price</div>
          <div className="text-xl font-bold text-gray-900">
            {formatPrice(listedPrice, currency)}
          </div>
        </div>

        {/* Fair Market Value */}
        {fairMarketValue ? (
          <div className={`${status.bgColor} bg-opacity-10 border-2 p-3 rounded-lg`}
            style={{ borderColor: status.color }}
          >
            <div className="text-xs font-medium text-gray-600 mb-1">Market Value</div>
            <div className={`text-xl font-bold ${status.textColor}`}>
              {formatPrice(fairMarketValue, currency)}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 animate-pulse">
            <div className="text-xs font-medium text-gray-600 mb-1">Market Value</div>
            <div className="text-xl font-bold text-gray-400">Calculating...</div>
          </div>
        )}
      </div>

      {/* 
        PRICE DIFFERENCE CARD
        Prominently shows: $ difference + % difference (the metric that matters!)
      */}
      {fairMarketValue && (
        <div className={`p-4 rounded-lg ${status.bgColor} bg-opacity-15 border-2`}
          style={{ borderColor: status.color }}
        >
          <div className="flex items-center justify-between">
            {/* Left side: Label and $ difference */}
            <div>
              <div className="text-xs text-gray-700 font-medium mb-1">Price Difference:</div>
              <div className={`text-2xl font-bold ${status.textColor}`}>
                {status.savings > 0 ? '−' : '+'}
                {formatPrice(Math.abs(status.savings), currency)}
              </div>
            </div>

            {/* Right side: % difference and meaning */}
            <div className="text-right">
              <div className={`text-2xl font-bold ${status.textColor}`}>
                {status.savingsPercentage > 0 ? '−' : '+'}
                {Math.abs(status.savingsPercentage).toFixed(1)}%
              </div>
              <div className={`text-xs ${status.textColor} font-semibold mt-1`}>
                {status.status}
              </div>
            </div>
          </div>

          {/* Explanation under the card */}
          <div className="mt-3 text-xs text-gray-700">
            <strong>Meaning:</strong> This car is listed {status.savings < 0 ? 'higher' : 'lower'} than the market value by {Math.abs(status.savingsPercentage).toFixed(1)}%
          </div>
        </div>
      )}

      {/* 
        INFO TEXT
        Explains what FMV is and why it matters
      */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
        📊 <strong>Fair Market Value</strong> is calculated by The Quant using mileage,
        condition, and market trends. It helps identify underpriced deals.
      </div>
    </div>
  );
};
