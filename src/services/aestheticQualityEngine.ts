import { Product, TrendStitchScoreBreakdown } from '../types';

export interface AestheticEvaluationInput {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  imageUrl: string;
  sizesCount: number;
  colorsCount: number;
  isEditorial?: boolean;
  tags?: string[];
  daysSinceLastPriceDrop?: number;
  priceDropPercent?: number;
}

export class AestheticQualityEngine {
  /**
   * Calculates the Aesthetic Quality Score (0 - 100)
   * Evaluates photographic appeal, brand reputation, contemporary aesthetic styling,
   * presentation clarity, and stock health.
   */
  static calculateAestheticScore(input: AestheticEvaluationInput): number {
    let score = 50; // baseline

    // 1. Photographic & Visual Quality signal (0 - 25 pts)
    const isHighResPhoto = input.imageUrl.includes('unsplash.com') || input.imageUrl.includes('images.');
    if (isHighResPhoto) score += 18;
    else score += 10;

    // 2. Contemporary Brand & Curatorial Tier (0 - 25 pts)
    const premiumOrCultBrands = [
      'Zara', 'H&M', 'Mango', 'Fabindia', "Levi's", 'Snitch', 'Westside',
      'The Jodi Life', 'Raw Mango', 'Suta', 'AND', 'Global Desi', 'Marks & Spencer',
      'Nike', 'Puma', 'Adidas', 'GIVA', 'Fossil', 'Rare Rabbit', 'Urbanic'
    ];
    if (premiumOrCultBrands.some((b) => input.brand.toLowerCase().includes(b.toLowerCase()))) {
      score += 18;
    } else {
      score += 10;
    }

    // 3. Styling & Contemporary Design signals (0 - 20 pts)
    const contemporaryKeywords = [
      'oversized', 'linen', 'handloom', 'minimal', 'baggy', 'pleated',
      'chikan', 'kalamkari', 'co-ord', 'boxy', 'relaxed', 'vintage',
      'retro', 'chunky', 'tailored', 'crochet', 'tussar', 'organza', 'asymmetric'
    ];
    const textCorpus = `${input.name} ${input.category} ${(input.tags || []).join(' ')}`.toLowerCase();
    let contemporaryMatches = 0;
    for (const kw of contemporaryKeywords) {
      if (textCorpus.includes(kw)) contemporaryMatches++;
    }
    score += Math.min(18, contemporaryMatches * 6);

    // 4. Size & Color versatility (0 - 15 pts)
    if (input.sizesCount >= 4) score += 8;
    else if (input.sizesCount >= 2) score += 4;

    if (input.colorsCount >= 2) score += 6;

    // 5. Down-ranking penalties:
    // Poor ratings penalty
    if (input.rating < 3.8) score -= 25;
    else if (input.rating < 4.0) score -= 12;

    // Zero reviews / suspicious penalty
    if (input.reviewCount < 10) score -= 15;

    // Suspicious discount penalty (e.g. 85%+ discount with low rating)
    if (input.discountPercent > 80 && input.rating < 4.2) score -= 20;

    // Out of stock penalty
    if (input.availability === 'out_of_stock') score -= 30;

    return Math.max(15, Math.min(99, Math.round(score)));
  }

  /**
   * Calculates the Bayesian-smoothed Review Quality Score (0 - 100)
   */
  static calculateReviewScore(rating: number, reviewCount: number): number {
    const priorRating = 4.0;
    const confidenceWeight = 50;
    const smoothedRating =
      (confidenceWeight * priorRating + reviewCount * rating) / (confidenceWeight + reviewCount);
    
    // Convert 1 - 5 star scale to 0 - 100 with volume boost
    let base = ((smoothedRating - 2.5) / 2.5) * 80;
    if (reviewCount >= 1000) base += 20;
    else if (reviewCount >= 300) base += 14;
    else if (reviewCount >= 100) base += 8;

    return Math.max(10, Math.min(99, Math.round(base)));
  }

  /**
   * Calculates Deal Quality Score (0 - 100)
   */
  static calculateDealScore(discountPercent: number, originalPrice: number, currentPrice: number): number {
    let score = 30;

    // Healthy, verified discounts in 20% - 60% range are optimal
    if (discountPercent >= 20 && discountPercent <= 65) {
      score += discountPercent * 0.9;
    } else if (discountPercent > 65) {
      score += 45; // cap to avoid fake clearance spam
    } else {
      score += discountPercent * 0.5;
    }

    // Value ratio (high absolute savings)
    const absoluteSavings = originalPrice - currentPrice;
    if (absoluteSavings >= 2000) score += 15;
    else if (absoluteSavings >= 800) score += 10;
    else if (absoluteSavings >= 300) score += 5;

    return Math.max(10, Math.min(99, Math.round(score)));
  }

  /**
   * Calculates Trend Relevance Score (0 - 100)
   */
  static calculateTrendScore(category: string, name: string, tags: string[] = []): number {
    const highDemandTrends = [
      'indo-western', 'streetwear', 'baggy', 'boxy', 'cargo', 'co-ord',
      'chikankari', 'retro', 'sneakers', 'quiet luxury', 'minimal',
      'workwear', 'college', 'linen', 'block print'
    ];
    const corpus = `${category} ${name} ${tags.join(' ')}`.toLowerCase();
    let hits = 0;
    for (const trend of highDemandTrends) {
      if (corpus.includes(trend)) hits++;
    }
    const base = 65 + hits * 10;
    return Math.max(40, Math.min(98, Math.round(base)));
  }

  /**
   * Calculates Price Drop Score (0 - 100)
   */
  static calculatePriceDropScore(dropPercentage: number, isLowest30d?: boolean): number {
    let score = 20;
    if (dropPercentage > 0) {
      score += Math.min(50, dropPercentage * 1.5);
    }
    if (isLowest30d) {
      score += 25;
    }
    return Math.max(10, Math.min(99, Math.round(score)));
  }

  /**
   * Calculates the Composite Master Overall Score
   * Formula:
   * Overall Score =
   *   Aesthetic Quality (25%)
   *   + Review Quality (25%)
   *   + Trend Relevance (20%)
   *   + Deal Quality (15%)
   *   + Price Attractiveness (10%)
   *   + Availability (5%)
   */
  static calculateFullScores(input: AestheticEvaluationInput): TrendStitchScoreBreakdown {
    const aestheticScore = this.calculateAestheticScore(input);
    const reviewScore = this.calculateReviewScore(input.rating, input.reviewCount);
    const trendScore = this.calculateTrendScore(input.category, input.name, input.tags);
    const dealScore = this.calculateDealScore(input.discountPercent, input.originalPrice, input.price);
    const priceDropScore = this.calculatePriceDropScore(
      input.priceDropPercent || 0,
      (input.priceDropPercent || 0) > 15
    );

    // Price Attractiveness component (0 - 100)
    let priceAttractiveness = 60;
    if (input.price <= 999) priceAttractiveness = 92;
    else if (input.price <= 1999) priceAttractiveness = 84;
    else if (input.price <= 3499) priceAttractiveness = 75;
    else priceAttractiveness = 65;

    // Availability component (0 - 100)
    let availabilityScore = 95;
    if (input.availability === 'low_stock') availabilityScore = 55;
    if (input.availability === 'out_of_stock') availabilityScore = 10;

    const overallScore = Math.round(
      aestheticScore * 0.25 +
      reviewScore * 0.25 +
      trendScore * 0.20 +
      dealScore * 0.15 +
      priceAttractiveness * 0.10 +
      availabilityScore * 0.05
    );

    // Human-readable, transparent explanation
    const parts: string[] = [];
    parts.push(`${input.rating.toFixed(1)}★ (${input.reviewCount.toLocaleString('en-IN')} reviews)`);
    if (input.discountPercent > 0) {
      parts.push(`${input.discountPercent}% off`);
    }
    if (input.priceDropPercent && input.priceDropPercent > 0) {
      parts.push(`dropped ${input.priceDropPercent}% this week`);
    } else {
      parts.push(`Aesthetic Index ${aestheticScore}/100`);
    }

    return {
      aestheticScore,
      reviewScore,
      trendScore,
      dealScore,
      priceDropScore,
      overallScore,
      explanation: parts.join(' • '),
    };
  }
}
