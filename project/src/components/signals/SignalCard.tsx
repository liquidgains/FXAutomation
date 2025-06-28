import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Signal {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  price: string;
  timestamp: string;
  status: 'pending' | 'executed' | 'expired';
}

interface SignalCardProps {
  signal: Signal;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const directionColor = signal.direction === 'BUY' ? 'text-profit-500' : 'text-loss-500';
  const statusColors = {
    pending: 'bg-signal-100 text-signal-800 dark:bg-signal-900 dark:text-signal-200',
    executed: 'bg-profit-100 text-profit-800 dark:bg-profit-900 dark:text-profit-200',
    expired: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
      <div className="flex items-center">
        <div className="mr-3">
          <div className="font-medium">{signal.pair}</div>
          <div className={`text-sm font-medium ${directionColor} flex items-center`}>
            {signal.direction}
            {signal.direction === 'BUY' ? 
              <ArrowUpRight size={16} className="ml-1" /> : 
              <ArrowDownRight size={16} className="ml-1" />
            }
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">{signal.price}</div>
        <div className={`text-xs px-2 py-1 rounded-full ${statusColors[signal.status]} mt-1`}>
          {signal.status.charAt(0).toUpperCase() + signal.status.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default SignalCard;