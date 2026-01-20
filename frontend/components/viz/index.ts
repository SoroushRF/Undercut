/**
 * Visualization Components Index
 * 
 * PURPOSE:
 * Central export point for all visualization components in the viz folder.
 * Makes imports cleaner: `import { DealGradeGauge } from '@/components/viz'`
 * instead of: `import { DealGradeGauge } from '@/components/viz/DealGradeGauge'`
 * 
 * EXPORTS:
 * - DealGradeGauge: Speedometer visualization for deal grades (S/A/B/C/F)
 * - DealGradeGaugeDemo: Demo component showing all grades
 * 
 * Last updated: 2026-01-19
 */

export { DealGradeGauge } from './DealGradeGauge';
export { DealGradeGaugeDemo } from './DealGradeGaugeDemo';
export { PriceComparisonBar } from './PriceComparisonBar';
export { PriceComparisonBarDemo } from './PriceComparisonBarDemo';

// Future exports will go here as we build more viz components:
// export { TCOChart } from './TCOChart';
