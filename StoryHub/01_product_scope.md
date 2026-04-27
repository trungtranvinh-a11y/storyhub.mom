# 01 Product Scope

## Current product direction

This app is not an AI writing workspace anymore.

It is a text story tracking and analysis app where users:

- create projects
- upload text story files
- parse source text
- split chapters
- detect character candidates
- generate event/summary drafts
- review and edit structured metadata
- monitor project state from a dashboard

## Core product principle

Structured story data is the center. Parsing is only the ingestion layer. Review and correction by the user are expected parts of the workflow.

## In-scope MVP

- auth
- project CRUD
- import file
- parse text
- chapter list
- chapter detail review
- character list
- character detail/edit
- event list/edit
- plot thread list/edit
- dashboard
- import jobs page

## Explicitly not in scope

- AI continue writing
- AI rewrite
- AI suggest next chapter
- provider-based text generation
- collaboration
- relationship graph
- maps
- publishing
- OCR image pipeline

## Domain model summary

- `Project`: story/project being analyzed
- `ImportJob`: one upload + parse run
- `SourceDocument`: raw and normalized text from uploaded file
- `Chapter`: parsed chapter, not user-authored draft chapter
- `Character`: detected or manually curated character record
- `Event`: draft or reviewed story event
- `PlotThread`: manually tracked unresolved thread or arc

## UX direction

- desktop-first
- import-first workflow
- review-oriented chapter and character screens
- clear status, warnings, and empty states
- no dependency on AI provider access
