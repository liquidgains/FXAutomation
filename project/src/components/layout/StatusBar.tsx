import React from 'react';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';

const StatusBar: React.FC = () => {
  const { telegramStatus, metatraderStatus, lastUpdate } = useConnectionStatus();

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 px-6 py-2 text-xs text-neutral-500 dark:text-neutral-400 flex justify-between">
      <div className="flex items-center space-x-4">
        <StatusIndicator 
          label="Telegram" 
          status={telegramStatus} 
        />
        <StatusIndicator 
          label="MetaTrader" 
          status={metatraderStatus} 
        />
      </div>
      <div>
        Last updated: {lastUpdate}
      </div>
    </div>
  );
};

interface StatusIndicatorProps {
  label: string;
  status: 'connected' | 'disconnected' | 'connecting';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ label, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-profit-500';
      case 'disconnected':
        return 'bg-loss-500';
      case 'connecting':
        return 'bg-signal-500 animate-pulse';
      default:
        return 'bg-neutral-500';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
      <span>{label}: {status}</span>
    </div>
  );
};

export default StatusBar;