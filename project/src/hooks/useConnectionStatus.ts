import { useState, useEffect } from 'react';
import { format } from 'date-fns';

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

interface ConnectionStatusState {
  telegramStatus: ConnectionStatus;
  metatraderStatus: ConnectionStatus;
  lastUpdate: string;
}

export function useConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatusState>({
    telegramStatus: 'disconnected',
    metatraderStatus: 'disconnected',
    lastUpdate: format(new Date(), 'HH:mm:ss')
  });

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would check actual connection status
      setStatus({
        telegramStatus: Math.random() > 0.3 ? 'connected' : 'disconnected',
        metatraderStatus: Math.random() > 0.3 ? 'connected' : 'disconnected',
        lastUpdate: format(new Date(), 'HH:mm:ss')
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return status;
}