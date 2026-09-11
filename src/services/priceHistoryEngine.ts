import { PriceObservation, PriceHistorySummary } from '../types';

export function analyzePriceHistory(
  observations: PriceObservation[],
  currentPrice: number,
  originalPrice: number
): PriceHistorySummary {
  if (!observations || observations.length === 0) {
    return {
      currentPrice,
      originalPrice,
      lowestObservedPrice: currentPrice,
      highestObservedPrice: originalPrice,
      change7d: 0,
      change30d: 0,
      change60d: 0,
      priceDropPercentage: Math.round(((originalPrice - currentPrice) / originalPrice) * 100),
      observations: [
        {
          timestamp: 'Today',
          price: currentPrice,
          originalPrice,
          discountPercent: Math.round(((originalPrice - currentPrice) / originalPrice) * 100),
          retailerId: 'myntra',
          isLowest: true,
          verifiedSource: 'demo_snapshot',
        },
      ],
    };
  }

  const prices = observations.map((o) => o.price);
  const lowestObservedPrice = Math.min(...prices, currentPrice);
  const highestObservedPrice = Math.max(...prices, originalPrice);

  // Mark which observation was the lowest
  const annotatedObservations = observations.map((obs) => ({
    ...obs,
    isLowest: obs.price === lowestObservedPrice,
  }));

  // Estimate 7d, 30d, 60d changes based on observation points
  let change7d = 0;
  let change30d = 0;
  let change60d = 0;

  if (observations.length >= 2) {
    const prevObs = observations[observations.length - 2];
    change7d = currentPrice - prevObs.price;
  }
  if (observations.length >= 3) {
    const midObs = observations[observations.length - 3];
    change30d = currentPrice - midObs.price;
  }
  if (observations.length >= 4) {
    const oldestObs = observations[0];
    change60d = currentPrice - oldestObs.price;
  } else if (observations.length > 0) {
    change60d = currentPrice - observations[0].price;
  }

  const priceDropPercentage = originalPrice > 0
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return {
    currentPrice,
    originalPrice,
    lowestObservedPrice,
    highestObservedPrice,
    change7d,
    change30d,
    change60d,
    priceDropPercentage,
    observations: annotatedObservations,
  };
}
