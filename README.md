# StoryHub

Desktop-style story tracking and analysis workspace for importing story text, reviewing parsed chapters, tracking characters, timeline events, and plot threads.

## Current status

- Next.js workspace app is working
- Import-analysis domain is active
- Desktop wrapper via Electron is configured
- Windows unpacked desktop build is generated in `dist-desktop/win-unpacked`

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM 7
- PostgreSQL
- Auth.js credentials auth
- Electron desktop wrapper

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Make sure PostgreSQL is running locally and update `.env` if needed.

3. Create the target database and apply migrations:

```bash
npm run db:setup
```

4. Optionally seed demo data:

```bash
npm run db:seed
```

5. Start the web app:

```bash
npm run dev
```

6. Start the desktop app in development mode:

```bash
npm run desktop:dev
```

7. Build the desktop bundle:

```bash
npm run desktop:pack
```

This creates an unpacked Windows desktop app in:

```text
dist-desktop/win-unpacked/StoryHub.exe
```

8. Build the desktop installer:

```bash
npm run desktop:build
```

## Environment variables

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/story_workspace_utf8?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/story_workspace_utf8?schema=public"
DATABASE_ADMIN_URL="postgresql://postgres:postgres@localhost:5432/postgres"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

- `DATABASE_URL`: runtime connection string used by the app
- `DIRECT_URL`: direct connection string used by Prisma CLI and migrations
- `DATABASE_ADMIN_URL`: optional admin connection string used by `npm run db:ensure`

## Useful scripts

- `npm run db:ensure`: create the target database if PostgreSQL is reachable
- `npm run db:migrate:dev`: create/apply a new development migration
- `npm run db:migrate:deploy`: apply committed migrations
- `npm run db:seed`: seed demo auth + starter story data
- `npm run db:studio`: open Prisma Studio

## Demo seed credentials

- Email: `demo@storyplanner.local`
- Password: `password123`

## Notes

- Desktop packaging uses `Next standalone + Electron`.
- `desktop:prepare` stages a dereferenced bundle into `desktop-bundle/` so Windows symlink restrictions do not break packaging.
- The desktop app bundles `node.exe` so the internal Next.js server can start without relying on Electron's `ELECTRON_RUN_AS_NODE` behavior.
