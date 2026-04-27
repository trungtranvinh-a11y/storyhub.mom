# 02 Architecture

## App structure

- `src/app`: route handlers and app routes
- `src/services`: business logic and import/parser services
- `src/modules`: UI and module-specific components/actions
- `src/validation`: Zod schemas
- `src/database`: Prisma client wiring
- `prisma`: schema and migrations
- `electron`: desktop main process
- `scripts/desktop`: desktop dev/build preparation scripts

## Key backend pattern

- UI submits to server actions or route handlers
- Route handlers stay thin
- Business logic lives in services
- Prisma access is centralized via service layer
- Authorization checks are enforced per user and per project

## Auth

- Credentials-based auth via `next-auth`
- Protected app shell under `/app`
- Middleware protects private routes
- Additional DB-backed user existence check prevents stale sessions after DB switches

## Import pipeline

Primary service: `src/services/import-service.ts`

Pipeline steps:

1. create `ImportJob`
2. normalize imported text
3. create `SourceDocument`
4. split chapters
5. create `Chapter` rows
6. extract character candidates
7. create/update `Character` rows
8. create chapter-character links
9. draft `Event` rows
10. mark `ImportJob` as completed or failed

## Parser services

- `src/services/text-normalizer-service.ts`
- `src/services/chapter-split-service.ts`
- `src/services/character-candidate-service.ts`
- `src/services/event-draft-service.ts`

## Important UI modules

- `src/modules/imports/components/import-upload-panel.tsx`
- `src/modules/chapters/components/chapter-editor-form.tsx`
- `src/modules/characters/components/character-form.tsx`
- `src/modules/characters/components/character-merge-form.tsx`
- `src/modules/app-shell/components/app-shell.tsx`
- `src/modules/app-shell/components/app-sidebar.tsx`
- `src/modules/app-shell/components/app-topbar.tsx`

## Current review UX additions

- Characters list supports:
  - sort by `confidence`
  - sort by `alphabetical`
  - filter by `all`, `candidates`, `reviewed`
- Character detail supports manual merge into another character record
- Imports page shows simple warnings when parse quality signals are weak

## Current constraints

- parser is heuristic, not NLP-heavy
- import currently runs synchronously
- no queue/background worker yet
- no OCR
- no provider-based AI analysis

## Desktop architecture

- Web app remains the primary runtime implementation
- Electron provides a desktop shell
- Production desktop app runs a bundled internal Next.js standalone server
- `desktop-bundle/` is a staged folder created by `scripts/desktop/prepare.mjs`
- `node.exe` is copied into the desktop bundle so the packaged app can boot the internal server directly

Primary files:

- `electron/main.mjs`
- `scripts/desktop/dev.mjs`
- `scripts/desktop/prepare.mjs`
