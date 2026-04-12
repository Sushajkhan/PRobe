FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY server/package.json ./server/

RUN npm ci --workspace=server

FROM deps AS generate
WORKDIR /app

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY tsconfig.json ./tsconfig.json

RUN cd server && npx prisma generate

FROM generate AS runner
WORKDIR /app

COPY src ./src
WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npx", "tsx", "src/index.ts"]