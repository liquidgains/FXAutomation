<<<<<<< HEAD
# Forex Signal Trader

A full-stack trading dashboard for receiving, analyzing, and visualizing trading signals from Telegram, with Dockerized backend and modern React frontend.

## 🚀 Features
- **Telegram Bot Integration**: Receive trading signals via Telegram bot webhooks
- **Live Signal Dashboard**: View and analyze signals in real time
- **Production Analytics**: Track profit, win rate, and other key metrics
- **MetaTrader (MT5) Setup**: (Planned) Connect to MetaTrader for automated trading
- **Dockerized Backend**: Express server for webhooks and analytics
- **ngrok Integration**: Expose local server for Telegram webhooks
- **Modern React Frontend**: Beautiful dashboard with Tailwind CSS

## 🛠️ Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME
```

### 2. Start the Backend (Docker)
```sh
docker build -t telegram-webhook-server .
docker run -d --name telegram-server -p 3000:3000 telegram-webhook-server
```

### 3. Start ngrok
```sh
docker run --rm -it -e NGROK_AUTHTOKEN=YOUR_TOKEN -p 4040:4040 ngrok/ngrok http host.docker.internal:3000
```

### 4. Start the Frontend
```sh
cd project
npm install
npm run dev
```

### 5. Set Telegram Webhook
Open:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<YOUR_NGROK_URL>/telegram-webhook
```

## 📊 Project Structure
- `server.js` — Express backend for webhooks and analytics
- `project/` — React frontend (Vite, Tailwind CSS)
- `Dockerfile` — Docker setup for backend

## ⚡ Important Notes
- **ngrok**: Only one free tunnel at a time. Use your actual authtoken.
- **Telegram Bot**: Privacy mode should be OFF for full message reception.
- **MetaTrader Integration**: Planned for future releases.

## 🙏 Credits
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [ngrok](https://ngrok.com/)
- [React](https://react.dev/)
- [Docker](https://www.docker.com/)

---

**Happy Trading!** 
=======
# FXAutomation
>>>>>>> 0fa0152b6d84628cbcbadb9ca1d718260fdf254c
