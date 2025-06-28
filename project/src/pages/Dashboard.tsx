import React from 'react';
import { 
  LineChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertTriangle, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignalCard from '../components/signals/SignalCard';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import { mockSignals } from '../data/mockData';
import TelegramMessages from '../components/TelegramMessages';
import { useProductionAnalytics } from '../hooks/useProductionAnalytics';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const metrics = useProductionAnalytics();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Trades" 
          value={metrics.activeTrades.toString()} 
          change="+1"
          icon={<Clock className="text-primary-500" />}
          trend="up"
        />
        <StatCard 
          title="Today's Profit" 
          value={`$${metrics.todayProfit.toFixed(2)}`} 
          change={metrics.todayProfit >= 0 ? "+8.3%" : "-3.1%"}
          icon={<ArrowUpRight className="text-profit-500" />}
          trend={metrics.todayProfit >= 0 ? "up" : "down"}
        />
        <StatCard 
          title="Weekly P&L" 
          value={`$${metrics.weeklyPnL.toFixed(2)}`} 
          change={metrics.weeklyPnL >= 0 ? "+2.4%" : "-3.1%"}
          icon={<ArrowDownRight className="text-loss-500" />}
          trend={metrics.weeklyPnL >= 0 ? "up" : "down"}
        />
        <StatCard 
          title="Win Rate" 
          value={`${metrics.winRate.toFixed(1)}%`} 
          change="+2.4%"
          icon={<LineChart className="text-signal-500" />}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Account Performance</h2>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Last 30 days</div>
          </div>
          <PerformanceChart />
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Signals</h2>
            <button 
              onClick={() => navigate('/signal-history')}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {mockSignals.slice(0, 3).map(signal => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">System Status</h2>
            <span className="px-2 py-1 text-xs rounded-full bg-profit-100 text-profit-800 dark:bg-profit-900 dark:text-profit-200">
              All Systems Operational
            </span>
          </div>
          <div className="space-y-4">
            <StatusItem 
              name="Telegram Monitoring" 
              status="operational" 
              description="Connected to 3 channels"
            />
            <StatusItem 
              name="Signal Processing" 
              status="operational" 
              description="Processing at normal capacity"
            />
            <StatusItem 
              name="MetaTrader Connection" 
              status="operational" 
              description="Connected to MT5 instance"
            />
            <StatusItem 
              name="Image Analysis" 
              status="operational" 
              description="OCR and pattern recognition online"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Active Trades</h2>
            <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              3 Open Positions
            </span>
          </div>
          <div className="space-y-4">
            <TradeItem 
              pair="EURUSD" 
              direction="BUY" 
              entryPrice="1.0842" 
              currentPrice="1.0856" 
              pnl="+0.13%" 
              timeOpen="2h 15m"
            />
            <TradeItem 
              pair="GBPJPY" 
              direction="SELL" 
              entryPrice="190.35" 
              currentPrice="190.12" 
              pnl="+0.12%" 
              timeOpen="4h 22m"
            />
            <TradeItem 
              pair="XAUUSD" 
              direction="BUY" 
              entryPrice="2312.45" 
              currentPrice="2324.80" 
              pnl="+0.53%" 
              timeOpen="1h 05m"
            />
          </div>
        </div>
      </div>

      <TelegramMessages />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend }) => {
  const trendColor = trend === 'up' 
    ? 'text-profit-500 dark:text-profit-400' 
    : trend === 'down' 
      ? 'text-loss-500 dark:text-loss-400' 
      : 'text-neutral-500 dark:text-neutral-400';

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className={`mt-4 text-sm ${trendColor}`}>
        {change}
      </div>
    </div>
  );
};

interface StatusItemProps {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  description: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ name, status, description }) => {
  let statusColor = 'text-profit-500';
  let statusIcon = <CheckCircle2 size={16} className="text-profit-500" />;
  
  if (status === 'degraded') {
    statusColor = 'text-signal-500';
    statusIcon = <AlertTriangle size={16} className="text-signal-500" />;
  } else if (status === 'offline') {
    statusColor = 'text-loss-500';
    statusIcon = <AlertTriangle size={16} className="text-loss-500" />;
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">{description}</div>
      </div>
      <div className="flex items-center">
        {statusIcon}
        <span className={`ml-2 text-sm ${statusColor}`}>
          {status === 'operational' ? 'Operational' : status === 'degraded' ? 'Degraded' : 'Offline'}
        </span>
      </div>
    </div>
  );
};

interface TradeItemProps {
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: string;
  currentPrice: string;
  pnl: string;
  timeOpen: string;
}

const TradeItem: React.FC<TradeItemProps> = ({ 
  pair, 
  direction, 
  entryPrice, 
  currentPrice, 
  pnl, 
  timeOpen 
}) => {
  const directionColor = direction === 'BUY' ? 'text-profit-500' : 'text-loss-500';
  
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center">
        <div className="mr-3">
          <div className="font-medium">{pair}</div>
          <div className={`text-sm font-medium ${directionColor}`}>{direction}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end space-x-2">
          <div className="text-sm">
            <div>Entry: {entryPrice}</div>
            <div>Current: {currentPrice}</div>
          </div>
          <div className="bg-profit-100 dark:bg-profit-900 text-profit-800 dark:text-profit-200 px-2 py-1 rounded text-xs font-medium">
            {pnl}
          </div>
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Open for {timeOpen}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;