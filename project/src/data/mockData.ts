interface Signal {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: string;
  status: 'pending' | 'executed' | 'expired';
  source: string;
  price: string;
}

export const mockSignals: Signal[] = [
  {
    id: '1',
    pair: 'EURUSD',
    direction: 'BUY',
    entryPrice: 1.0842,
    stopLoss: 1.0820,
    takeProfit: 1.0890,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    status: 'executed',
    source: 'TradingView Alerts',
    price: '1.0842'
  },
  {
    id: '2',
    pair: 'GBPJPY',
    direction: 'SELL',
    entryPrice: 190.35,
    stopLoss: 190.65,
    takeProfit: 189.80,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    status: 'pending',
    source: 'Premium Signals',
    price: '190.35'
  },
  {
    id: '3',
    pair: 'XAUUSD',
    direction: 'BUY',
    entryPrice: 2312.45,
    stopLoss: 2308.00,
    takeProfit: 2320.00,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    status: 'executed',
    source: 'Market Analysis',
    price: '2312.45'
  }
];