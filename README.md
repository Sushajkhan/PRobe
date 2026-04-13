<p align="center">
  <img src="./assets/logo.png" alt="PRobe Logo" width="80" height="80" />
</p>

<h1 align="center">PRobe</h1>

<p align="center">
  AI-powered GitHub pull request code review — automatically.
</p>

<p align="center">
  <a href="https://probeai.in">Live Demo</a> ·
  <a href="https://github.com/sushajkhan/probe/issues">Report Bug</a> ·
  <a href="https://github.com/sushajkhan/probe/issues">Request Feature</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/Express-black?style=flat-square&logo=express" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white" />
</p>

<br />

<p align="center">
  <img src="./assets/screenshots/dashboard.png" alt="PRobe Dashboard" width="100%" />
</p>

---

## What is PRobe?

PRobe is a GitHub App that reviews pull requests automatically using Gemini AI. The moment a PR is opened, PRobe fetches the diff, analyzes it, and posts a structured review comment directly on the PR — broken down by critical issues, warnings, and suggestions. Everything is tracked in a dashboard where you can filter reviews, browse findings, and monitor code quality across all your repositories.

## Screenshots

<table>
  <tr>
    <td>
      <img src="./assets/screenshots/reviews.png" alt="Reviews List" />
      <p align="center"><sub>Reviews List</sub></p>
    </td>
    <td>
      <img src="./assets/screenshots/review-detail.png" alt="Review Detail" />
      <p align="center"><sub>Review Detail</sub></p>
    </td>
  </tr>
  <tr>
    <td>
      <img src="./assets/screenshots/analytics.png" alt="Analytics" />
      <p align="center"><sub>Analytics</sub></p>
    </td>
    <td>
      <img src="./assets/screenshots/settings.png" alt="Settings" />
      <p align="center"><sub>Settings</sub></p>
    </td>
  </tr>
</table>

## How it works

```
GitHub PR opened
      │
      ▼
Express server validates webhook signature
      │
      ▼
Job pushed to BullMQ queue (Redis)
      │
      ▼
Worker picks up the job
  ├── Fetches PR diff from GitHub API
  ├── Uploads diff to AWS S3
  ├── Sends diff to Gemini AI
  ├── Saves findings to PostgreSQL
  └── Posts review comment on GitHub PR
      │
      ▼
Results visible in Next.js dashboard
```

## Features

- **Automatic PR reviews** — triggered by GitHub webhooks, no manual action needed
- **Structured findings** — every issue has a file path, line number, severity, and a concrete suggestion
- **Severity filtering** — filter reviews and findings by critical, warning, or suggestion
- **Analytics** — charts and trends across all your repositories
- **Per-repo controls** — connect, pause, or disconnect any repository
- **Security** — PRobe only reads the PR diff. No source browsing, no commit history, no secrets
- **Async processing** — reviews run through a job queue so the API never blocks on Gemini

## Tech Stack

**Frontend**

- [Next.js 15](https://nextjs.org) (App Router)
- [TypeScript](https://typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query v5](https://tanstack.com/query)
- [Clerk](https://clerk.com) — GitHub OAuth

**Backend**

- [Node.js](https://nodejs.org) / [Express](https://expressjs.com)
- [TypeScript](https://typescriptlang.org)
- [Prisma 7](https://prisma.io)
- [PostgreSQL](https://postgresql.org)
- [Redis](https://redis.io) / [BullMQ](https://bullmq.io)
- [AWS S3](https://aws.amazon.com/s3)
- [Gemini AI](https://ai.google.dev)
- [Pino](https://getpino.io) — structured logging

**Infrastructure**

- [Docker](https://docker.com) + Compose — local development
- [Vercel](https://vercel.com) — frontend hosting
- [Railway](https://railway.app) — backend hosting,managed Redis,managed PostgreSQL

## Project Structure

```
probe/
├── client/                         # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── (auth)/             # sign-in page (no sidebar)
│       │   └── (app)/              # all app pages (shared layout)
│       │       ├── layout.tsx
│       │       ├── dashboard/
│       │       ├── reviews/
│       │       ├── analytics/
│       │       └── settings/
│       ├── components/
│       ├── hooks/                  # React Query hooks
│       ├── lib/api.ts              # fetch layer
│       └── types/index.ts
│
├── server/                         # Express backend
│   └── src/
│       ├── index.ts                # server entry
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       ├── services/               # github, gemini, s3
│       ├── workers/                # BullMQ job processor
│       ├── queues/
│       └── lib/                    # prisma, redis, logger
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
│
│
└── docker-compose.yml
```

## Running Locally

### Prerequisites

- [Docker](https://docker.com) and Docker Compose
- [Node.js](https://nodejs.org) 20+
- A [GitHub App](https://github.com/settings/apps/new)
- A [Clerk](https://clerk.com) project (GitHub OAuth enabled)
- A [Google AI](https://aistudio.google.com) API key
- An [AWS S3](https://aws.amazon.com/s3) bucket

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/probe.git
cd probe
npm install
```

### 2. Set up environment variables

**`server/.env`**

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

DATABASE_URL=postgresql://probe:probepass@localhost:5433/probe
REDIS_URL=redis://localhost:6379

CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx

GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket

GEMINI_API_KEY=your_key
GEMINI_MODEL=your_model
BACKEND_URL=http://localhost:3000

```

**`client/.env.local`**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start everything

```bash
docker compose up --build
```

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:3001 |
| Backend API | http://localhost:3000 |
| PostgreSQL  | localhost:5433        |
| Redis       | localhost:6379        |

### 4. Set up GitHub webhooks locally

Use [ngrok](https://ngrok.com) to expose the local server:

```bash
ngrok http 3000
```

Set the webhook URL in your GitHub App settings to:

```
https://your-ngrok-url.ngrok.io/api/webhook
```

## Deployment

| Service  | Provider |
| -------- | -------- |
| Frontend | Vercel   |
| Backend  | Railway  |
| Database | Railway  |
| Redis    | Railway  |

## License

[MIT](./LICENSE)
