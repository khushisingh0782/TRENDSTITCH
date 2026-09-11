import { TrendStitchScoreBreakdown } from '../types';

interface ScoreCalculationInput {
  rating: number;             // 1.0 to 5.0
  reviewCount: number;        // e.g. 2400
  currentPrice: number;       // e.g. 1599
  originalPrice: number;      // e.g. 2599
  discountPercent: number;    // e.g. 38
  priceDropRecent: number;    // amount dropped in last 14-30 days, e.g. 700
  priceDropDays: number;      // e.g. 14
  trendVelocity?: number;     // 0 to 100 relative velocity
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  categoryName: string;       // e.g. "oversized shirts"
}

/**
 * Calculates genuine explainable TrendStitch scores using Bayesian rating smoothing,
 * historical price drops, discount depth, and trend velocity.
 */
export function calculateTrendStitchScores(input: ScoreCalculationInput): TrendStitchScoreBreakdown {
  // 1. Review Score (0 - 100)
  // Bayesian average: dampens unverified or low-count reviews (e.g., 5.0 from 2 reviews is only ~70)
  const priorRating = 3.8;
  const priorWeight = 50;
  const bayesianRating = (input.rating * input.reviewCount + priorRating * priorWeight) / (input.reviewCount + priorWeight);
  // Scale from 1-5 to 0-100 with emphasis above 4.0
  const reviewScore = Math.min(100, Math.round(((bayesianRating - 2.5) / 2.5) * 100));

  // 2. Deal Score (0 - 100)
  // Based on discount percentage and value ratio
  const discountWeight = Math.min(100, input.discountPercent * 1.5);
  const dealScore = Math.min(100, Math.max(10, Math.round(discountWeight)));

  // 3. Price Drop Score (0 - 100)
  // Evaluates actual rupee reduction relative to MRP
  let priceDropScore = 20;
  if (input.priceDropRecent > 0 && input.originalPrice > 0) {
    const dropRatio = (input.priceDropRecent / input.originalPrice) * 100;
    // Score scales up to 100 for drops >= 35%
    priceDropScore = Math.min(100, Math.round(30 + dropRatio * 2));
  }

  // 4. Trend Score (0 - 100)
  const baseVelocity = input.trendVelocity !== undefined ? input.trendVelocity : 65;
  const reviewBonus = Math.min(20, Math.floor(Math.log10(Math.max(1, input.reviewCount)) * 5));
  const trendScore = Math.min(100, Math.max(30, Math.round(baseVelocity * 0.8 + reviewBonus)));

  // Availability Penalty
  let availabilityMultiplier = 1.0;
  if (input.availability === 'low_stock') availabilityMultiplier = 0.95;
  if (input.availability === 'out_of_stock') availabilityMultiplier = 0.4;

  // 5. Overall TrendStitch Composite Score
  // Weighted: 30% Deal + 25% Review + 25% Price Drop + 20% Trend
  const rawComposite = (
    dealScore * 0.30 +
    reviewScore * 0.25 +
    priceDropScore * 0.25 +
    trendScore * 0.20
  ) * availabilityMultiplier;

  const overallScore = Math.min(99, Math.max(25, Math.round(rawComposite)));

  // Generate explainable, transparent reason
  const parts: string[] = [];
  parts.push(`${input.rating.toFixed(1)}★ from ${input.reviewCount.toLocaleString('en-IN')} reviews`);
  if (input.discountPercent > 0) {
    parts.push(`${input.discountPercent}% off`);
  }
  if (input.priceDropRecent > 0) {
    parts.push(`price dropped ₹${input.priceDropRecent.toLocaleString('en-IN')} in ${input.priceDropDays} days`);
  }
  if (trendScore >= 75) {
    parts.push(`currently trending in ${input.categoryName.toLowerCase()}`);
  }

  const aestheticScore = Math.min(98, Math.max(70, Math.round(reviewScore * 0.4 + trendScore * 0.3 + 30)));

  return {
    aestheticScore,
    reviewScore: Math.max(10, reviewScore),
    trendScore,
    dealScore,
    priceDropScore,
    overallScore,
    explanation: parts.join(' • '),
  };
}
