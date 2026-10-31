# Script and shot-list format

`scripts/voice.py` reads this file directly, so keep the shape.

```markdown
# <Film title> (<length>): script and shot list

Source for every fact: Wikipedia, "<article>" (read <date>).
About <N> words at ~147 wpm (Kokoro am_michael, speed 1.05) plus chapter pauses, about <m:ss>.

## 1 · Cold open (0:00–0:40) · stage: server hall
1. July eleventh, twenty twenty-six. Someone uploads a dataset to Hugging Face.
2. The dataset carries code.

## 2 · Title (≈2 s, no voice)
THE TITLE, built on a dark blue grid.

## 3 · The test (0:42–1:15) · stage: void
3. To understand who was inside, go back two months, to a test.
3b. A line inserted later keeps the numbering stable.

## Shot list (one line per shot: stage · subject · camera move · keyed word)
| # | Stage | Subject | Camera | Keyed word |
|---|---|---|---|---|
| 1 | hall | aisle of racks, date stamp | slow dolly | "uploads" → dataset slides in |
```

Rules that keep timing robust:
- Write numbers as words ("twelve hundred", "twenty twenty-six"); the aligner maps Whisper's digits back to them.
- Avoid a word appearing twice in one line if you will key to it; keys are `(line, word, nth)` and the nth is counted inside the line only.
- Apostrophes are part of the word: key `"it's"` exactly; a loose matcher that accepts `its` once started an ending 3.5 s early.
- Chapters without numbered lines (a title sting) produce a silent gap set by `--gap-after-line`.
- Budget: ~147 spoken words per minute at speed 1.05, plus 0.35 s per line pause and 0.9 s per chapter turn.
