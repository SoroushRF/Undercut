'use client';

/**
 * DealGradeGauge Component
 * 
 * PURPOSE:
 * Displays the "Deal Grade" (S/A/B/C/F) as a visual speedometer gauge.
 * - S-Tier: 10%+ below FMV (Green - Steal)
 * - A-Tier: 5-9% below FMV (Light Green - Great)
 * - B-Tier: At market (Yellow - Fair)
 * - C-Tier: Slightly overpriced (Orange - Caution)
 * - F-Tier: Overpriced (Red - Avoid)
 * 
 * INPUTS:
 * - dealGrade: DealGrade type (S | A | B | C | F | null)
 * - showLabel: Optional boolean to show text label below gauge (default: true)
 * 
 * USAGE:
 * <DealGradeGauge dealGrade="S" />
 * 
 * Last updated: 2026-01-19
 */

import { useMemo } from 'react';
import { DealGrade } from '@/lib/types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface DealGradeGaugeProps {
  dealGrade: DealGrade | null;
  showLabel?: boolean;
}

// ============================================================================
// GRADE CONFIGURATION (Maps each grade to color, description, and position)
// ============================================================================

const GRADE_CONFIG = {
  S: {
    color: '#10b981', // Emerald green
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    label: 'Steal',
    description: '10%+ below FMV',
    rotationDegrees: 0, // Leftmost position
  },
  A: {
    color: '#34d399', // Light green
    bgColor: 'bg-green-400',
    textColor: 'text-green-600',
    label: 'Great',
    description: '5-9% below FMV',
    rotationDegrees: 22.5,
  },
  B: {
    color: '#eab308', // Amber/Yellow
    bgColor: 'bg-yellow-400',
    textColor: 'text-yellow-600',
    label: 'Fair',
    description: 'At market',
    rotationDegrees: 45,
  },
  C: {
    color: '#f97316', // Orange
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-600',
    label: 'Caution',
    description: 'Slightly overpriced',
    rotationDegrees: 67.5,
  },
  F: {
    color: '#ef4444', // Red
    bgColor: 'bg-red-500',
    textColor: 'text-red-600',
    label: 'Avoid',
    description: 'Overpriced',
    rotationDegrees: 90, // Rightmost position
  },
};

// ============================================================================
// COMPONENT: DealGradeGauge
// ============================================================================

export const DealGradeGauge = ({ dealGrade, showLabel = true }: DealGradeGaugeProps) => {
  // Get configuration for current grade, or use null state
  const config = useMemo(() => {
    if (!dealGrade) {
      return {
        color: '#d1d5db',
        bgColor: 'bg-gray-300',
        textColor: 'text-gray-500',
        label: 'N/A',
        description: 'No data',
        rotationDegrees: -45,
      };
    }
    return GRADE_CONFIG[dealGrade];
  }, [dealGrade]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 
        GAUGE VISUALIZATION
        Uses SVG to draw a semi-circular gauge with a needle indicator.
        The needle rotates based on the deal grade.
      */}
      <div className="relative w-48 h-24 flex items-center justify-center">
        {/* SVG Gauge Background (Semi-circle with color segments) */}
        <svg
          viewBox="0 0 200 120"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        >
          {/* Define the gradient for smooth color transitions */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={GRADE_CONFIG.S.color} />
              <stop offset="25%" stopColor={GRADE_CONFIG.A.color} />
              <stop offset="50%" stopColor={GRADE_CONFIG.B.color} />
              <stop offset="75%" stopColor={GRADE_CONFIG.C.color} />
              <stop offset="100%" stopColor={GRADE_CONFIG.F.color} />
            </linearGradient>
          </defs>

          {/* Background semi-circle (light gray) */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Colorful gradient semi-circle (overlays background) */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Needle indicator (triangle pointing at current grade) */}
          {/* 
            The needle starts at -90 degrees (pointing left) and rotates based on grade.
            S-grade: -90 degrees (left), F-grade: 0 degrees (right)
          */}
          <g
            transform={`rotate(${config.rotationDegrees - 90} 100 100)`}
            style={{ transformOrigin: '100px 100px' }}
          >
            {/* Needle line */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={config.color}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Center circle (where needle pivots) */}
            <circle cx="100" cy="100" r="5" fill={config.color} />
          </g>

          {/* Tick marks and labels for reference */}
          <text x="20" y="115" fontSize="10" fill="#666" textAnchor="middle" fontWeight="bold">
            S
          </text>
          <text x="50" y="115" fontSize="10" fill="#666" textAnchor="middle">
            A
          </text>
          <text x="100" y="115" fontSize="10" fill="#666" textAnchor="middle">
            B
          </text>
          <text x="150" y="115" fontSize="10" fill="#666" textAnchor="middle">
            C
          </text>
          <text x="180" y="115" fontSize="10" fill="#666" textAnchor="middle" fontWeight="bold">
            F
          </text>
        </svg>
      </div>

      {/* 
        TEXT INFORMATION
        Displays the grade label and description below the gauge
      */}
      {showLabel && (
        <div className="text-center">
          <div className={`text-3xl font-bold ${config.textColor}`}>
            {dealGrade || 'N/A'}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {config.label}: {config.description}
          </div>
        </div>
      )}
    </div>
  );
};
