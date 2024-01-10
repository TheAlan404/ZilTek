FROM node:16-alpine
EXPOSE 3000

WORKDIR /app

COPY dist /app/dist
COPY server /app/server

WORKDIR /app/server
RUN npm install
USER node
CMD ["npx", "tsx", "index.ts"]
