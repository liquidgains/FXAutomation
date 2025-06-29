import React, { useState, useEffect } from 'react';
import { Bot, Loader2, CheckCircle2, AlertCircle, MessageSquare, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';

export default function TelegramSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [botToken, setBotToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [botInfo, setBotInfo] = useState<{
    username?: string;
    inviteLink?: string;
  }>({});
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  useEffect(() => {
    const savedToken = localStorage.getItem('botToken');
    const savedConnected = localStorage.getItem('botConnected');
    if (savedToken && savedConnected === 'true') {
      setBotToken(savedToken);
      setConnected(true);
      setConnectionStatus('connected');
    }
    checkExistingConnection();
  }, [user]);

  const checkExistingConnection = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('telegram_enabled, telegram_settings')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.telegram_enabled && data?.telegram_settings?.bot_token) {
        setBotToken(data.telegram_settings.bot_token);
        setConnected(true);
        setBotInfo({
          username: data.telegram_settings.username,
          inviteLink: data.telegram_settings.invite_link
        });
      }
    } catch (err) {
      console.error('Error checking existing connection:', err);
    }
  };

  const startBot = async () => {
    try {
      const response = await supabase.functions.invoke('trading-bot', {
        body: { 
          botToken,
          testMode: true // Start in test mode initially
        }
      });

      if (response.error) throw response.error;
      return response.data;
    } catch (err) {
      console.error('Error starting bot:', err);
      throw err;
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    setBotToken('');
    setConnectionStatus('disconnected');
    localStorage.removeItem('botToken');
    localStorage.removeItem('botConnected');
  };

  const handleBotSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setConnectionStatus('connecting');

    try {
      // Test bot connection first
      const response = await fetch('https://fxautomation.onrender.com/test-telegram-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: botToken }),
      });
      const data = await response.json();

      if (!data.ok) {
        throw new Error('Bot connection test failed');
      }

      setBotInfo(data.result);
      setConnected(true);
      setConnectionStatus('connected');
      localStorage.setItem('botToken', botToken);
      localStorage.setItem('botConnected', 'true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup bot');
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (token: string) => {
    try {
      // Updated to use your actual ngrok URL
      const response = await fetch('https://fxautomation.onrender.com/test-telegram-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setConnectionStatus('connected');
        setBotInfo(data.result);
        setTestMessage('Bot connected successfully!');
      } else {
        setError(data.error || 'Connection failed');
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      setError('Network error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setConnectionStatus('disconnected');
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-6 h-6 text-primary-500" />
        <h1 className="text-2xl font-semibold">Telegram Setup</h1>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6"
      >
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Connect Telegram Bot
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Connect your Telegram bot to start receiving trading signals.
          </p>
        </div>

        {!connected ? (
          <form onSubmit={handleBotSetup} className="space-y-4">
            <div>
              <label htmlFor="botToken" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bot Token
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="botToken"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-neutral-700 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your bot token from @BotFather"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Get your bot token from <a href="https://t.me/botfather" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">@BotFather</a>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !botToken}
                className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Connect Bot'
                )}
              </button>

              <button
                type="button"
                onClick={() => testConnection(botToken)}
                disabled={loading || !botToken}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Test Connection
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <p className="ml-2 text-sm text-green-800 dark:text-green-200">
                Telegram bot connected successfully!
              </p>
            </div>

            {botInfo.username && (
              <div className="flex flex-col items-center p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                <div className="mb-4">
                  <QRCode 
                    value={`https://t.me/${botInfo.username}`}
                    size={200}
                    level="H"
                    includeMargin={true}
                    className="dark:bg-white p-2 rounded"
                  />
                </div>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Scan this QR code or click below to start chatting with your bot
                </p>
                <a
                  href={`https://t.me/${botInfo.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open Chat
                </a>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => navigate('/signal-history')}
                className="flex-1 mr-2 flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View Signals
              </button>
              <button
                onClick={() => navigate('/metatrader-setup')}
                className="flex-1 ml-2 flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Setup MT5
              </button>
            </div>

            <button
              onClick={handleDisconnect}
              className="mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700"
            >
              Disconnect
            </button>
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

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Connection Status</h3>
          <div className="mt-2 flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{connectionStatus}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}