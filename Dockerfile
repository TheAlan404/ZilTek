FROM node:16-alpine
EXPOSE 3000

USER node
WORKDIR /home/node

COPY . .

RUN npm install
RUN npm run build

WORKDIR /home/node/server
CMD ["npx", "tsx", "index.ts"]
