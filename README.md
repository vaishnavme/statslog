# Statslog

Statslog is a small, self-hosted web analytics stack. The monorepo includes a Next.js frontend, an Express + Prisma API, and shared UI/config packages so you can track visitors, sessions, page views, and custom events per project.

## Stack

- Turborepo workspace with TypeScript across all packages
- Frontend: Next.js app in `apps/web`
- Backend: Express API in `apps/server` using Prisma and PostgreSQL
- Shared packages: `packages/ui`, `packages/eslint-config`, `packages/typescript-config`

## Features (backend today)

- Email/password auth with JWT cookies and rolling session storage
- Project CRUD scoped to each user
- Data models for visitors, sessions, page views, and events (Prisma schema)

## Getting started

1. Install dependencies (Node 18+):

```sh
npm install
```

2. Environment for the API (`apps/server/.env`):

```env
<-- Server -->
ENV=dev
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/statslog
JWT_SECRET=super-secret
```

3. Database setup (PostgreSQL):

```sh
cd apps/server
npx prisma migrate dev --name init
npx prisma generate

# preview database via prisma studio
npx prisma studio
```

4. Run in development (from repo root):

```sh
npm run dev
# or individually
npm run dev -w apps/server
npm run dev -w apps/web
```

5. Run in Server in development

```sh
npm run dev -w apps/server
cd apps/server

docker compose up
```

6. Production builds:

```sh
npm run build
npm run start -- --filter=server
npm run start -- --filter=web
```

## API surface (apps/server)

**User**

- `POST /api/v1/auth/signup` — create user and session
- `POST /api/v1/auth/login` — login and issue session
- `POST /api/v1/auth/logout` — revoke current session

**Project**

- `GET /api/v1/project` — list projects for current user
- `GET /api/v1/project/:projectId` — fetch a project owned by the user
- `POST /api/v1/project` — create project (name, website)
- `DELETE /api/v1/project/:projectId` — delete a project

## Project layout

- `apps/server` — Express API, Prisma schema, and migrations
- `apps/web` — Next.js frontend (app router)
- `packages/eslint-config`, `packages/typescript-config` — shared linting/TS presets

## Tooling and scripts

- `npm run dev` — turbo dev across apps
- `npm run build` — turbo build across apps
- `npm run lint` — lint via workspace config
- `npm run check-types` — type-check all packages
