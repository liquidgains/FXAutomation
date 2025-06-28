import React, { useState, useEffect } from 'react';
import { Settings, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ConnectionStatus {
  connected: boolean;
  lastCheck: Date;
  error?: string;
}

export default function MetaTraderSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    server: '',
    login: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    lastCheck: new Date()
  });
  const MAX_RETRIES = 3;

  useEffect(() => {
    checkExistingConnection();
    const interval = setInterval(checkConnectionStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const checkExistingConnection = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('metatrader_login')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.metatrader_login) {
        setFormData(prev => ({ ...prev, login: data.metatrader_login }));
        setConnected(true);
      }
    } catch (err) {
      console.error('Error checking existing connection:', err);
    }
  };

  const checkConnectionStatus = async () => {
    if (!connected || !formData.login) return;

    try {
      const response = await supabase.functions.invoke('mt5-connect', {
        body: {
          ...formData,
          action: 'test'
        }
      });

      setConnectionStatus({
        connected: response.data?.success ?? false,
        lastCheck: new Date(),
        error: response.error?.message
      });
    } catch (err) {
      setConnectionStatus(prev => ({
        ...prev,
        connected: false,
        lastCheck: new Date(),
        error: err instanceof Error ? err.message : 'Connection check failed'
      }));
    }
  };

  const getErrorMessage = (error: any) => {
    if (!error) return 'An unknown error occurred';
    
    switch (error.code) {
      case 'INVALID_CREDENTIALS':
        return 'Invalid MT5 credentials. Please check your login and password.';
      case 'CONNECTION_TIMEOUT':
        return 'Connection timed out. Please try again.';
      case 'INVALID_API_TOKEN':
        return 'Server configuration error. Please contact support.';
      case 'ACCOUNT_NOT_FOUND':
        return 'MT5 account not found. Please verify your credentials.';
      case 'TEST_FAILED':
        return 'Connection test failed. Please try again.';
      default:
        return error.message || 'Failed to connect to MT5. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke('mt5-connect', {
        body: {
          ...formData,
          action: 'connect'
        }
      });

      if (response.error) {
        throw response.error;
      }

      if (response.data.success) {
        await supabase
          .from('users')
          .update({
            metatrader_login: formData.login
          })
          .eq('id', user?.id);

        setConnected(true);
        setRetryCount(0);
        await checkConnectionStatus();
      } else {
        throw new Error(response.data.error || 'Failed to connect MT5');
      }
    } catch (err: any) {
      console.error('MT5 connection error:', err);
      
      if (retryCount < MAX_RETRIES && 
          (err.message?.includes('timeout') || err.message?.includes('Failed to fetch'))) {
        setRetryCount(prev => prev + 1);
        setError(`Connection attempt failed. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => handleSubmit(e), 2000);
        return;
      }
      
      setError(getErrorMessage(err));
    } finally {
      if (retryCount >= MAX_RETRIES) {
        setLoading(false);
      }
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setTestMessage('');
    setRetryCount(0);

    try {
      const response = await supabase.functions.invoke('mt5-connect', {
        body: {
          ...formData,
          action: 'test'
        }
      });

      if (response.error) {
        throw response.error;
      }

      if (response.data.success) {
        setTestMessage('MT5 connection test successful!');
        await checkConnectionStatus();
      } else {
        throw new Error(response.data.error || 'Failed to test MT5 connection');
      }
    } catch (err: any) {
      console.error('MT5 test error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-primary-500" />
        <h1 className="text-2xl font-semibold">MetaTrader Setup</h1>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6"
      >
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Connect MT5 Account
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Connect your MetaTrader 5 account to enable automated trading.
          </p>
        </div>

        {!connected ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="server" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                MT5 Server
              </label>
              <input
                type="text"
                id="server"
                value={formData.server}
                onChange={(e) => setFormData(prev => ({ ...prev, server: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-neutral-700 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your MT5 server"
                required
              />
            </div>

            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Login ID
              </label>
              <input
                type="text"
                id="login"
                value={formData.login}
                onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-neutral-700 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your login ID"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-neutral-700 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !formData.server || !formData.login || !formData.password}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Connect MT5'
                )}
              </button>

              <button
                type="button"
                onClick={testConnection}
                disabled={loading || !formData.server || !formData.login || !formData.password}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Test Connection
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <p className="ml-2 text-sm text-green-800 dark:text-green-200">
                  MT5 account connected successfully!
                </p>
              </div>
              <button
                onClick={checkConnectionStatus}
                className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50"
              >
                <RefreshCw className="h-4 w-4 text-green-600 dark:text-green-400" />
              </button>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Connection Status
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {connectionStatus.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Last checked: {new Date(connectionStatus.lastCheck).toLocaleTimeString()}
                </span>
              </div>
              {connectionStatus.error && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {connectionStatus.error}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setConnected(false);
                  setFormData({ server: '', login: '', password: '' });
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {testMessage && (
          <div className="mt-4 p-4 rounded-md bg-green-50 dark:bg-green-900/30">
            <div className="flex">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <p className="ml-2 text-sm text-green-800 dark:text-green-200">{testMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-md bg-red-50 dark:bg-red-900/30">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-2 text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}