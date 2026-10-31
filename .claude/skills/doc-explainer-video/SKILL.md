---
name: doc-explainer-video
description: >-
  Make a short documentary explainer video (30 s to 5 min) entirely in code, from a one-line story to a finished, fact-checked, word-timed MP4 with narration, music and sound effects. Two house styles are ready to use: a Johnny Harris / RealLifeLore map explainer (satellite + vintage paper map + red marker) and a fern-style 3D "clay" documentary (grey mannequins, dark studio void, thin white infographics). Use this skill whenever the user wants an explainer video, a YouTube-style documentary clip, a map animation with narration, a 3D reconstruction of a real incident, a "make a video like this channel" request, or wants to turn a news event, place, border or incident into a narrated video, even if they don't say "skill" or name a style. Also use it to plan cost and render time for such a video, or to render one on the user's own GPU.
---

# Documentary explainer videos, made in code

A film here is one HTML page whose canvas is a pure function of time, keyed to the words of a synthetic narrator, rendered frame by frame with Playwright, mixed and encoded with FFmpeg. No AI image or video generation, no stock footage: every pixel is drawn by code or comes from properly licensed open data (e.g. Sentinel-2 cloudless 2016 imagery, CC BY 4.0).

The pipeline below was learned by making three real films (a 41 s map explainer, a 50 s and a 4:46 3D documentary). Each step exists because skipping it caused a visible defect once.

## The stages, in order

1. **Story and length.** Ask for the story in one line and the length. If the user has none, pitch three with a hook line each. Pick the style: map explainer (`references/style-map.md`) or 3D clay documentary (`references/style-3d-clay.md`). Read the chosen style file now.
2. **Fact-check before writing a word.** Read the Wikipedia article(s) in full (fetch the HTML page, not the API, which rate-limits). Every claim in the script must trace to a sentence you read. Real people: no invented quotes, private details or dialogue; attribute quotes as the article does. Prefer naming roles ("security experts") unless the user wants names.
3. **Script, then approval.** Write short lines grouped into chapters as a markdown file (`## 1 · Title`, numbered lines; see the template in `references/script-format.md`). Budget about 2.45 spoken words per second at Kokoro speed 1.05 plus pauses: 50 s ≈ 120 words, 5 min ≈ 660 words. Add a shot list (stage, subject, camera move, keyed word). Show both and wait for approval before recording; a voice change later forces a full re-time and re-render.
4. **Voice.** `scripts/voice.py` (Kokoro `am_michael`, speed 1.05). First run `--check` on every proper noun and acronym; respell or substitute phonemes until right. Known fixes: "METR" → say "meter"; Tsawwassen → /təˈwɑːsən/; Kokoro flaps the t in "dataset" (Whisper hears "dare set"), "One wrote:" loses its t before a colon, "subpoenaed" needs `səpˈiːnd`; "A I" with a space is read as "a I", write "AI".
5. **Word timing.** `scripts/whisper_words.py` on the final wav, then `scripts/align_words.py` to map Whisper's words back onto the script words (Whisper writes "1,200" for "twelve hundred", splits "OpenAI"). Expect ~95 % of words timed directly; the rest are interpolated. Then listen with your eyes: compare the Whisper transcript with the script, because mishearings reveal pronunciation bugs.
6. **Build the page.** Start from the closest example in `assets/` (`example-3d-film.html`, `example-map-film.html`) and keep its contract: `window.filmReady` (a promise that resolves to `{duration, frames, events}`) and `window.filmDrawFrame(n)` drawing into `canvas#out`. Key every camera move, pop-in, label and SFX to a word, by line and word (`T(line, 'word')`), never to a second, so a new voice re-times the whole film for free.
7. **Look before rendering.** Render ~35 stills spread over the film (`scripts/render.py PROJECT stills --times ...`), build a contact sheet, fix what is wrong (blocked subjects, empty wide shots, labels off-frame, harsh colour), then render full-size crops of the worst shots. Two or three passes are normal.
8. **Render.** `scripts/render.py PROJECT frames --workers 3` (cloud, software WebGL) or `--gpu` on the user's machine (`references/local-gpu.md`). It skips finished frames and rewrites broken ones, so a killed run just resumes. Budget time from `references/environment.md` before promising a delivery time.
9. **Sound.** `scripts/sfx.py` (procedural SFX and a bed, `--bed tense` for maps, `sombre` for 3D), then `scripts/mix.py`: bed ducked under every word, voice ≥ 12 dB over music, one SFX per event, −14 LUFS measured on the stereo file.
10. **Encode and verify from the MP4, not from the page.** `scripts/encode.py` writes the H.264 CRF 19 file, measures loudness and pulls frames at keyed words. Check that each event lands on its word, labels are legible, nothing is blank.
11. **Deliver.** Users often cannot download large files on their phone. Make a web encode (`encode.py --web`, ~11 MB) and `scripts/preview_page.py` to publish a private page with a "Play with sound" button; also send the full MP4 file. Commit sources, not frames or wavs, and commit `audio/mix.m4a` so a GPU machine can render without re-synthesizing audio.

## What makes these films look intentional

- **One continuous camera.** Moves are long, eased (cubic or quartic in-out) and slow; holds creep forward a little and breathe (±2 px). No frame is ever still: grain, boiling marker strokes or a creeping camera keep something alive.
- **Everything is keyed to a word.** The circle draws on "town", the door bursts on "broke", the counter runs between two words. Audiences feel sync errors of 0.2 s.
- **Colour carries meaning.** In 3D: red = danger/attacker, blue = defender, green = allowed. On maps: red marker for the story, tinted sides for the two parties. One accent per shot.
- **Text is sparse and physical.** Tags, torn strips, stamps, documents and cards appear on their word and leave on the next idea. Never word-by-word captions.
- **Hold at the end.** 1.5 to 2.5 s of the final image after the last word, then fade.

## Before you promise anything

- **Cost**: the expensive part is your own work (research, scene code, looking at contact sheets), not rendering. Relative to a 50 s clip: 5 min ≈ 2.5–4×, 15 min ≈ 5–8×. Long films should be split into chapters built and checked one at a time.
- **Render time** (software WebGL, 4 CPUs, 3 workers): a simple 2D map frame ≈ 1–1.5 s, a Three.js frame with ~1,000 instanced figures and shadows ≈ 3.5–4 s per worker. A 4:46 3D film took ~4.5 hours in the cloud. A local GPU is 10–30× faster.
- **Background jobs stop at 2 hours** in the cloud environment: render in chunks with `--end`, the resumable mode picks up the rest.
- **Clarify scope words.** "Make it 5 minutes" can mean a standalone 5-minute film or part 1 of a longer one. Ask which before writing the script.

## Files

- `references/style-map.md`: the map explainer look, structure and build specifics (satellite masks, paper map pyramid, marker, paper props).
- `references/style-3d-clay.md`: the 3D documentary look, stages, chapter structure and Three.js specifics.
- `references/script-format.md`: script and shot-list template.
- `references/environment.md`: hosts to allow, installs, render-time table, cloud limits.
- `references/local-gpu.md`: rendering on the user's own Windows/macOS/Linux GPU.
- `references/gotchas.md`: every bug that actually happened, with its fix.
- `scripts/`: voice.py, whisper_words.py, align_words.py, render.py, sfx.py, mix.py, encode.py, preview_page.py (each has usage in its docstring).
- `assets/`: complete example pages and the two original prompt templates.
