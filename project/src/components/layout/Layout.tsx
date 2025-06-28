import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import StatusBar from './StatusBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-neutral-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <StatusBar />
      </div>
    </div>
  );
};

function getPageTitle(pathname: string): string {
  switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/telegram-setup':
      return 'Telegram Setup';
    case '/metatrader-setup':
      return 'MetaTrader Setup';
    case '/signal-history':
      return 'Signal History';
    case '/settings':
      return 'Settings';
    default:
      return 'Forex Signal Trader';
  }
}

export default Layout;