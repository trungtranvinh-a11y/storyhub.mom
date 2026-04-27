# 03 Schema Notes

## Core models still in use

- `User`
- `Project`
- `Chapter`
- `Character`
- `Event`
- `PlotThread`
- join tables for chapter-character and event-character links

## New import-analysis models

### `ImportJob`

Purpose:

- tracks one upload/import run

Important fields:

- `projectId`
- `sourceDocumentId`
- `filename`
- `sourceSizeBytes`
- `status`
- `stage`
- `errorMessage`
- `chapterCount`
- `characterCandidateCount`
- `eventDraftCount`
- `completedAt`

### `SourceDocument`

Purpose:

- stores uploaded source text for auditing and re-review

Important fields:

- `projectId`
- `filename`
- `mimeType`
- `rawText`
- `normalizedText`

## `Chapter` model notes

The meaning of `Chapter` changed.

Before:

- user-authored writing chapter

Now:

- parsed chapter extracted from imported text

Important fields:

- `sourceDocumentId`
- `importJobId`
- `sourceHeading`
- `content`
- `summary`
- `timeInStory`
- `parseNotes`
- `status`

## `Character` model notes

Important import-related fields:

- `canonicalName`
- `mentionCount`
- `isCandidate`
- `detectionSource`

Manual edit behavior:

- manual create/update forces `isCandidate = false`
- merge combines aliases, links, mention counts, and notes

## `Event` model notes

Important import-related fields:

- `isDraft`
- `detectionSource`

## Removed/deprecated model

- `AIGenerationLog` removed from active product direction

## Migration note

Prisma schema and migrations are already updated for the import-analysis domain. Review `prisma/schema.prisma` and the latest migration if schema work resumes.
