import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TelegramSetup from './pages/TelegramSetup';
import MetaTraderSetup from './pages/MetaTraderSetup';
import Settings from './pages/Settings';
import SignalHistory from './pages/SignalHistory';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/telegram-setup" element={<TelegramSetup />} />
          <Route path="/metatrader-setup" element={<MetaTraderSetup />} />
          <Route path="/signal-history" element={<SignalHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;