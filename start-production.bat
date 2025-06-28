@echo off
REM Change to the project directory
cd /d %~dp0project

REM 1. Build the Express server Docker image
docker build -t telegram-webhook-server .

REM 2. Stop and remove any existing container (ignore error if not running)
docker rm -f telegram-server

REM 3. Run the Express server container
docker run -d --name telegram-server -p 3000:3000 telegram-webhook-server

REM 4. Start ngrok in a new window (replace YOUR_TOKEN with your actual ngrok authtoken)
start cmd /k "docker run --rm -it -e NGROK_AUTHTOKEN=2wtt2m4nWYfGDAW7AWPrCVBOkMw_3ZgNKpTWDZTmQGjSnUvAJ ngrok/ngrok http host.docker.internal:3000"

REM 5. Start the React app (Vite dev server) in a new window
start cmd /k "npm run dev"

echo.
echo All services started!
echo - Your Express server is running in Docker on port 3000.
echo - ngrok is exposing your server (check the new terminal window for your public URL).
echo - Your React app is running (check the new terminal window for the local URL).
pause