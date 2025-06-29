import { useEffect, useState } from 'react';

export interface LiveSignal {
  id: string | number;
  pair?: string;
  direction?: string;
  entry_price?: string;
  status?: string;
  text?: string;
  timestamp?: number;
}

export function useLiveSignals() {
  const [signals, setSignals] = useState<LiveSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  async function fetchSignals() {
    try {
      const res = await fetch(`https://fxautomation.onrender.com/signals?ts=${Date.now()}`);
      const data = await res.json();
      setSignals(data);
      setError(null);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { signals, loading, error, refreshSignals: fetchSignals };
}
