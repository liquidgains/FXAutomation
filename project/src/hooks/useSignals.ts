import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Signal {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  status: 'pending' | 'executed' | 'cancelled' | 'completed';
  source: string;
  created_at: string;
}

export function useSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSignals();
  }, []);

  async function fetchSignals() {
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addSignal(signal: Omit<Signal, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('signals')
        .insert([signal])
        .select()
        .single();

      if (error) throw error;
      setSignals(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  }

  return { signals, loading, error, addSignal, refreshSignals: fetchSignals };
}