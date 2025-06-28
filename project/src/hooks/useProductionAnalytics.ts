import { useState, useEffect } from 'react';

interface ProductionMetrics {
  totalProfit: number;
  todayProfit: number;
  weeklyPnL: number;
  winRate: number;
  totalTrades: number;
  activeTrades: number;
}

export function useProductionAnalytics() {
  const [metrics, setMetrics] = useState<ProductionMetrics>({
    totalProfit: 0,
    todayProfit: 0,
    weeklyPnL: 0,
    winRate: 0,
    totalTrades: 0,
    activeTrades: 0,
  });

  useEffect(() => {
    const calculateMetrics = async () => {
      try {
        // For now, use mock data until we have real signals
        // TODO: Replace with actual API call to your backend
        const mockMetrics = {
          totalProfit: 1240.28,
          todayProfit: 283.45,
          weeklyPnL: 1240.28,
          winRate: 68,
          totalTrades: 15,
          activeTrades: 3,
        };
        
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Error calculating metrics:', error);
      }
    };

    calculateMetrics();
    const interval = setInterval(calculateMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return metrics;
} 