FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy && node dist/index.js"