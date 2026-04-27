# 06 Decision Log

## Decision: product direction changed

The app is no longer an AI writing workspace. It is now an import/review/tracking app for text stories.

Reason:

- import-analysis workflow is more aligned with the current product goal
- structured data and manual review are more important than generation

## Decision: remove AI runtime paths

Removed or disabled:

- AI service
- context builder service
- AI endpoints
- AI action UI
- provider-based generation flows

Reason:

- those paths anchored the old product direction and created unnecessary complexity

## Decision: keep reusable CRUD modules

Kept:

- auth
- projects
- chapters
- characters
- events
- plot threads
- dashboard

Reason:

- these modules still fit the new product with wording and flow changes

## Decision: move to UTF8 database

New DB:

- `story_workspace_utf8`

Reason:

- original DB encoding caused Vietnamese text import failures

## Decision: stale session guard

Auth flow now checks the session user against the current DB before proceeding.

Reason:

- switching databases caused foreign-key failures from stale session cookies

## Decision: parser remains heuristic for MVP

Reason:

- simplest path that is good enough for MVP
- keeps the system review-first, not over-engineered

## Decision: alias merge is manual first

Reason:

- alias detection is noisy
- manual merge is safer and already solves a real workflow pain

## Decision: characters list defaults to confidence-first review

Reason:

- imported candidate cleanup is easier when high-frequency names surface first
- alphabetical mode remains available for manual scanning

## Decision: desktop app uses Electron wrapper

Reason:

- lowest-risk path to convert the existing Next.js app into a desktop app
- preserves the current codebase and service layer
- avoids rewriting the product into a separate native stack

## Decision: desktop bundle includes standalone server + bundled Node runtime

Reason:

- packaged Electron executable was not a reliable way to start the internal server via `ELECTRON_RUN_AS_NODE`
- bundling `node.exe` makes the packaged app more deterministic on Windows
- staging into `desktop-bundle/` avoids Windows symlink issues from Next standalone output

## Decision: lint ignores generated desktop build folders

Ignored folders:

- `desktop-bundle`
- `dist-desktop`

Reason:

- these are generated artifacts and should not be linted as source code
