import React, { useEffect, useState } from 'react';

const TELEGRAM_API_URL = 'https://9ad7-1-39-26-143.ngrok-free.app/messages';

const TelegramMessages: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetch(TELEGRAM_API_URL)
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Telegram Messages</h2>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>
            <strong>{msg.message?.from?.first_name}:</strong> {msg.message?.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TelegramMessages;
