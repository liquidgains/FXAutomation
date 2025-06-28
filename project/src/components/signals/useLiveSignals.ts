import { useEffect, useState } from 'react';

const SIGNALS_API_URL = 'https://<your-ngrok-url>/signals'; // Replace with your actual ngrok URL

export function useLiveSignals() {
  const [signals, setSignals] = useState<any[]>([]);
  useEffect(() => {
    const fetchSignals = () => {
      fetch(SIGNALS_API_URL)
        .then(res => res.json())
        .then(setSignals);
    };
    fetchSignals();
    const interval = setInterval(fetchSignals, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);
  return signals;
}
