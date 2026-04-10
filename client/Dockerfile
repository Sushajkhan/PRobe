FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY client/package.json ./client/

RUN npm ci --workspace=client

FROM deps AS builder
WORKDIR /app

COPY client ./client

ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard

RUN cd client && npx next build

FROM node:20-alpine AS runner
WORKDIR /app/client

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/client/.next/standalone ./
COPY --from=builder /app/client/.next/static ./.next/static
COPY --from=builder /app/client/public ./public

EXPOSE 3001

CMD ["node", "server.js"]