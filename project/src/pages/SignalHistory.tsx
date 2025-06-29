// import React from 'react';
import { History } from 'lucide-react';
import { useLiveSignals } from '../components/signals/useLiveSignals';

export default function SignalHistory() {
  const { signals, loading, error, refreshSignals } = useLiveSignals();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-primary-500" />
        <h1 className="text-2xl font-semibold">Signal History</h1>
      </div>
      
      <button
        onClick={refreshSignals}
        className="mb-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Refresh
      </button>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-4">Loading signals...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : signals.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No signals received yet
            </div>
          ) : (
            <div className="space-y-4">
              {signals.map((signal) => (
                <div
                  key={signal.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="font-medium">{signal.text || signal.pair || 'N/A'}</div>
                      <div className="text-sm font-medium flex items-center text-gray-500">
                        {signal.status || 'received'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Entry: {signal.entry_price || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {signal.timestamp ? new Date(signal.timestamp * 1000).toLocaleString() : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}