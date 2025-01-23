FROM node:22 AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY . ./

RUN pnpm install --frozen-lockfile
WORKDIR /app/app/client
RUN pnpm build --mode web
RUN mv /app/app/client/dist /app/app/server/

WORKDIR /app/app/server
ENV NODE_ENV=production
ENV PORT=3014
EXPOSE 3014
CMD ["pnpx", "tsx", "./src/index.ts"]
