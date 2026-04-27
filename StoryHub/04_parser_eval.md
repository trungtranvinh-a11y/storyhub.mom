# 04 Parser Evaluation

## Test files

- `sample_story_easy.txt`
- `sample_story_alias.txt`
- `sample_story_harder.txt`
- guide: `sample_story_test_guide.txt`

## Current parser strengths

- chapter split works for `Chuong`, `Chapter`, `Hoi`, `Part`, and `Book`
- event drafts now create an opening beat and often a turning point
- import pipeline is stable end-to-end on UTF8 text
- noise in character candidates is lower than before

## Latest observed results

### `sample_story_easy.txt`

- chapter count: `3`
- character candidates: `Lam`, `Minh`, `Phuc`, `Hao`
- event drafts: `6`

What improved:

- clean chapter split
- event coverage now closer to guide
- much less candidate noise

Still missing:

- `An`
- `Vu`

### `sample_story_alias.txt`

- chapter count: `3`
- character candidates: `Ta Linh`, `Ha Nghi`, `Tu Canh`, `Chu`, `Mac`, `Bach Ho`
- event drafts: `6`

What improved:

- chapter split fixed completely for `Hoi`
- alias-like records now appear and can be merged manually

Still weak:

- `Dinh Mac` collapses to `Mac`
- `Lao Chu` collapses to `Chu`
- alias recognition is still manual

### `sample_story_harder.txt`

- chapter count: `4`
- character candidates are closer to:
  - `Khang`
  - `Mai`
  - `Huy`
  - `Tri`
  - `Yen`
  - plus some false positives depending on current regex tuning
- event drafts: `8`

What improved:

- event count is much better than the old one-per-chapter approach
- `Tri` is now detectable in some passes

Still weak:

- `Vu` is still often missed
- false positives like `Hai` or `Thu` can still leak through

## Main parser bottleneck

Character extraction remains the weakest part of the system.

## Recommended next parser improvements

1. better alias/title phrase handling
2. better single-token false-positive suppression
3. source excerpt storage for each candidate/event draft
4. review actions for accept/dismiss candidate
