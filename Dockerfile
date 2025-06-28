FROM node:18
WORKDIR /app
COPY server.js .
RUN npm init -y && npm install express node-fetch@2
EXPOSE 3000
CMD ["node", "server.js"]
