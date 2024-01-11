FROM node:16-alpine
EXPOSE 3000

WORKDIR /app

COPY dist /app/dist
COPY server /app/server

WORKDIR /app/server
RUN npm install
RUN chown -R node:node /app
RUN chmod 755 /app
USER node
CMD ["npx", "tsx", "index.ts"]
