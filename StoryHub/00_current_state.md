# 00 Current State

## Project identity

- Product name: `Text Story Tracking & Analysis Workspace`
- Internal desktop app name: `StoryHub`
- Old product direction: AI writing workspace
- Current direction: import story text, parse it into structured data, review the extracted data, and track story logic over time

## Current stack

- Frontend: Next.js App Router + TypeScript + Tailwind CSS
- Backend: Next.js route handlers + service layer
- Database: PostgreSQL + Prisma ORM
- Auth: `next-auth` credentials flow with protected `/app` routes
- Desktop runtime: Electron wrapper around the Next.js app

## Current status

- Auth works
- Project CRUD works
- Imports page exists
- Import pipeline works for `.txt` and `.md`
- Chapters are generated from parsed source text
- Character candidates are detected heuristically
- Event drafts are generated heuristically
- Plot threads and timeline events are editable review/tracking modules
- Dashboard has import-aware stats and quick actions
- AI writing flows have been removed from runtime
- Workspace UI has been refactored toward a desktop-app feel
- Characters page supports confidence-first sorting and filters
- Character merge flow exists for alias cleanup
- Desktop app wrapper is implemented
- Windows unpacked desktop app build is available in `dist-desktop/win-unpacked`

## Database/runtime state

- Local DB in use: `story_workspace_utf8`
- Encoding reason: original DB had `WIN1258` and caused Unicode import failures
- Local demo user:
  - Email: `demo@storyplanner.local`
  - Password: `password123`

## Important routes

- `/app/projects`
- `/app/projects/new`
- `/app/projects/[projectId]/dashboard`
- `/app/projects/[projectId]/imports`
- `/app/projects/[projectId]/chapters`
- `/app/projects/[projectId]/chapters/[chapterId]`
- `/app/projects/[projectId]/characters`
- `/app/projects/[projectId]/characters/[characterId]`
- `/app/projects/[projectId]/timeline`
- `/app/projects/[projectId]/plot-threads`
- `/app/projects/[projectId]/settings`

## Current quality snapshot

- Chapter split: good for `Chuong`, `Chapter`, `Hoi`, `Part`, and `Book`
- Character extraction: improved but still the weakest area
- Event draft extraction: good enough for MVP review, still heuristic
- Alias merge: basic manual merge now exists in character detail
- Characters list defaults to confidence review order using mention count

## Verification state

Last known successful checks:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run desktop:pack`
