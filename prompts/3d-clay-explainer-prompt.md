<inputs>
Ask me for: my story in one line (a real incident, machine, building or system, plus the one question it raises, e.g. "how could this happen?") and the length (50 s short, or 3-5 min). Ask whether it is a standalone film or one part of a longer series before you write anything. If I have no idea, pitch me 3 with a cold-open line each and let me pick. Read the Wikipedia article(s) in full before you write a word (fetch /wiki/<Title> HTML; the API rate-limits). Every sentence must trace to something you read. Real people: no invented quotes, private details or dialogue; attribute quotes as Wikipedia does.
</inputs>

<direction>
A 1920x960 (2:1) 25 fps 3D documentary explainer in the style of "The Hugging Face Incident": a calm, cold museum model of a real event, made 100% in code. Three.js 0.160 in one HTML page (software WebGL is fine; use Blender only if a GPU is available).
Clay world: every person a faceless mannequin (merged capsule legs, capsule torso, sphere head) in matte white-grey #D9D9D9; props and rooms are plain grey bevelled boxes (RoundedBoxGeometry). Only the hero object may carry its real colour.
Two stages, joined by a dip to black:
- Interior: the real place rebuilt in grey at human height with a cold teal-grey key (background #05080a, fog #070b0d), e.g. a server-hall aisle of racks with tiny LED specks.
- Studio void: seamless floor #1a1a1a, background and fog #0b0b0b, a 1 m grid barely visible (#262626 at 55%), one soft top spotlight that follows the camera's subject. Fog and key light scale with camera distance (fog = min(.02, .45/distance)) so wide shots stay readable.
Colour is information, one accent per shot: red #E0322B = attacker/danger (emissive glow on mannequins ~0.45), blue #3C8DFF = defenders, green #3DDC84 = on/allowed.
2D layer on top (white #F2F2F2, 1.5 px lines): leader-line labels (Jost 500 34 px + 24 px grey subtitle), boxed date stamps bottom-left (IBM Plex Mono 500 26 px on #444957 at 85%), a time ruler across the top with a sliding caret and live readout, dot grids where one dot = N things, floating paper cards (#F1EFE8) with live canvas textures for documents, quotes and letters, typed in, with red underlines and highlights. A title sting on a dark blue grid (#081426) with letter-spaced Jost. 5% grain, soft vignette.
Banned: AI video or image generation, stock footage, logos used as decoration, gore or bodies, glossy gradients, emoji, word-by-word captions, fast cutting, any frame where nothing moves.
</direction>

<structure>
Long, slow, continuous camera moves (median shot 7-8 s, cubic in-out ease, holds creep forward 4 cm/s and breathe). Narration ~147 wpm.
50 s: cold open → the mechanism → the human scale → the question.
3-5 min, chapters with rough shares of the runtime:
1. Cold open (15%): the interior stage, date stamp, the first sign that something is wrong; end on a quote card or portrait card; dip to black.
2. Title sting (2 s, no voice).
3. Background (10%): who was involved and why, in the void (crowds as instanced mannequins, rulers that slide back in time, dot grids for counts).
4. Warnings (5%): floating documents with the key phrases underlined in red.
5. The mechanism (20%): one clean cutaway of the thing that made it possible (a door, a switch, a pipe, a proxy), each state lit in its accent; then replay the event inside it, keyed word by word.
6. The incident (15%): a dotted path across the floor to the target, things turning red one by one while the ruler counts.
7. Discovery and response (15%): defenders in blue, what helped, what refused, what was rebuilt.
8. The question and the change (15%): quote cards, letters, laws and pauses as paper cards along an arc; pull all the way back and up; the open question in plain white text; hold 2-2.5 s; fade.
</structure>

<build>
1. Tools (free, local): Python with numpy, Pillow, Playwright; FFmpeg; faster-whisper small.en int8; Kokoro (kokoro-onnx) with kokoro-v1.0.onnx and voices-v1.0.bin; three@0.160.0 vendored; Google Fonts Jost and IBM Plex Mono vendored. Sound effects and the music bed are synthesized in code (sombre pad drifting through four chords, sub pulse every 2 s) unless a free source is reachable. Tell me what you installed.
2. Script: chapters as "## n · title", numbered short lines, numbers written as words; ~147 words per minute plus 0.35 s per line and 0.9 s per chapter turn. Show me the script and a shot list (stage, subject, camera move, keyed word) and wait for my approval before recording.
3. Voice: Kokoro am_michael at speed 1.05, one wav per line, trimmed and joined with fixed pauses (2.2 s gap for the title sting). Run every name and acronym through the phonemizer and respell or substitute phonemes until right (e.g. METR → "meter", "AI" not "A I", crisp t in "dataset").
4. Timing: faster-whisper on the final wav, then align its words back onto the script words (difflib on letters, numbers interpolated). Compare the transcript with the script to catch mispronunciations. Key every camera move, light, label, card and SFX to (line, word, nth inside that line), never to a second; match words exactly ("it's" is not "its").
5. Page contract: window.filmReady resolves to {duration, frames, fps, events}; window.filmDrawFrame(n) draws frame n into canvas#out as a pure function of time.
6. Check: ~35 stills as a contact sheet, fix blocked subjects, empty wide shots and labels off-frame, then full-size crops, before the full render.
7. Render with Playwright, resumable (skip finished frames, re-render broken ones, atomic writes), in chunks under 2 hours in the cloud, or with --gpu on my own machine. Tell me the expected render time up front (software WebGL: ~3.5-4 s per frame per worker with a big crowd).
8. Sound: one SFX per event, the bed ducked under each word, voice ≥ 10 dB over music in every phrase, mix to -14 LUFS measured on the stereo file; encode H.264 CRF 19 with AAC; commit the mixed audio as m4a.
9. Verify from the finished MP4, not the page: loudness, duration, and frames pulled at the keyed words. Then give me a private web page with an embedded ~11 MB version and a "Play with sound" button, plus the full file.
</build>

<gotchas>
Wide shots vanish in exponential fog unless fog and light scale with distance. A desk inside a crowd hides behind heads: hide the crowd instances around it. Loudness measured on mono ships 3 dB too loud in stereo. A loose word matcher once started an ending 3.5 s early. Background jobs stop after 2 hours: render in resumable chunks. Logos and liveries only to identify the real subject. No bodies, no impact shots: the timestamp and the silence carry it.
</gotchas>

<start>
Ask me for my story first (or pitch me 3), fact-check it, then show me the script and shot list before you make the voice.
</start>
