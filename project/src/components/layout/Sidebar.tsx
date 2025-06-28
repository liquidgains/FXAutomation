import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  MessageSquare, 
  BarChart2, 
  History, 
  Settings as SettingsIcon,
  Activity
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-neutral-100 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary-600" />
          <h1 className="text-lg font-bold">Forex Signal Trader</h1>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavItem to="/" icon={<BarChart3 size={20} />} label="Dashboard" />
        <NavItem to="/telegram-setup" icon={<MessageSquare size={20} />} label="Telegram Setup" />
        <NavItem to="/metatrader-setup" icon={<BarChart2 size={20} />} label="MetaTrader Setup" />
        <NavItem to="/signal-history" icon={<History size={20} />} label="Signal History" />
        <NavItem to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
      </nav>

      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-col space-y-2">
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            System Status
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-profit-500"></div>
            <span className="text-sm">System Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200'
            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

export default Sidebar;