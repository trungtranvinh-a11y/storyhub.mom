# Agent Context Entry Point

This repository uses the Obsidian vault at [StoryHub](C:\Data\Programming\Web\StoryHub) as the durable project memory for future coding sessions.

When starting a new session, read these files first in order:

1. [StoryHub/00_current_state.md](C:\Data\Programming\Web\StoryHub\00_current_state.md)
2. [StoryHub/01_product_scope.md](C:\Data\Programming\Web\StoryHub\01_product_scope.md)
3. [StoryHub/02_architecture.md](C:\Data\Programming\Web\StoryHub\02_architecture.md)
4. [StoryHub/03_schema_notes.md](C:\Data\Programming\Web\StoryHub\03_schema_notes.md)
5. [StoryHub/04_parser_eval.md](C:\Data\Programming\Web\StoryHub\04_parser_eval.md)
6. [StoryHub/05_next_steps.md](C:\Data\Programming\Web\StoryHub\05_next_steps.md)
7. [StoryHub/06_decision_log.md](C:\Data\Programming\Web\StoryHub\06_decision_log.md)
8. [Technical Handoff Spec.txt](C:\Data\Programming\Web\Technical Handoff Spec.txt)

Quick operational notes:

- Product direction is `Text Story Tracking & Analysis Workspace`, not AI writing.
- Primary app workspace is the Next.js app rooted at `C:\Data\Programming\Web`.
- Obsidian vault exists only to persist project memory and handoff context.
- Database currently points to the UTF8 PostgreSQL database `story_workspace_utf8`.
- If auth/session behavior looks inconsistent after DB changes, re-login and review [StoryHub/06_decision_log.md](C:\Data\Programming\Web\StoryHub\06_decision_log.md).
