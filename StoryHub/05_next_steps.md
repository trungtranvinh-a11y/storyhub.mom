# 05 Next Steps

## Highest priority

1. Improve character extraction again
2. Add source excerpts to character/event drafts
3. Add candidate review actions on top of raw edit forms
4. Verify desktop runtime end-to-end on the target machine

## Desktop follow-up

- verify installer artifact end-to-end on the target machine
- add a custom app icon for Windows builds
- consider auto-updater only if desktop distribution becomes a real requirement
- if installer is required, finish `desktop:build` verification outside this constrained tool session

## Recommended implementation order

### A. Parser quality

- catch title-based names more reliably:
  - `bac si Tri`
  - `tien si Vu`
  - `Lao Chu`
  - `Dinh Mac`
- reduce false positives:
  - `Hai`
  - `Thu`
  - location-like names

### B. Review UX

- candidate accept/dismiss state
- source excerpts on character detail and event list
- import detail panel with richer quality report
- more confidence cues beyond raw mention count

### C. Import workflow

- re-import mode:
  - append
  - replace parsed output from current source
- optional manual split review after import

## Nice-to-have later

- background jobs for large files
- more file types beyond `.txt` and `.md`
- better chapter merge/split tools

## Avoid for now

- AI writing
- heavy NLP
- advanced plot inference
- relationship graph
