FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY server/package.json ./server/

RUN npm ci --workspace=server

FROM deps AS generate
WORKDIR /app

COPY server/prisma ./server/prisma
COPY server/prisma.config.ts ./server/prisma.config.ts
COPY server/tsconfig.json ./server/tsconfig.json

RUN cd server && npx prisma generate

FROM generate AS runner
WORKDIR /app

COPY src ./src
WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npx", "tsx", "src/index.ts"]