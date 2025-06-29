const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// Add CORS headers for frontend communication
app.use(cors());

app.use(express.json());

const messages = []; // Store received messages
const signals = [];

const supabaseUrl = 'https://kvgxaejazevkvekeatad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2Z3hhZWphemV2a3Zla2VhdGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMjAzODksImV4cCI6MjA2Njc5NjM4OX0.JD6cMIk-TrXQdSkVtdRN-0sH86MCBupRThiJ5fqd6pg';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function parseSignal(text) {
  // Example: "EURUSD BUY 1.0842"
  const match = text.match(/(\\w+)\\s+(BUY|SELL)\\s+([\\d.]+)/i);
  if (!match) return null;
  return {
    pair: match[1],
    direction: match[2],
    price: parseFloat(match[3])
  };
}

app.post('/telegram-webhook', async (req, res) => {
  const msg = req.body.message?.text;
  if (msg) {
    await supabase.from('signals').insert([
      {
        pair: 'N/A',
        direction: 'N/A',
        entry_price: 'N/A',
        status: 'received',
        text: msg,
        timestamp: new Date().toISOString()
      }
    ]);
  }
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// New endpoint to view messages
app.get('/messages', (req, res) => {
  res.send(`
    <h2>Received Telegram Messages</h2>
    <pre>${JSON.stringify(messages, null, 2)}</pre>
  `);
});

app.get('/signals', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  res.json(signals);
});

app.post('/test-telegram-bot', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ 
      ok: false, 
      error: 'No token provided' 
    });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    
    if (data.ok) {
      res.json({ 
        ok: true, 
        result: data.result 
      });
    } else {
      res.status(400).json({ 
        ok: false, 
        error: data.description || 'Invalid token' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
