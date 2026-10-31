<inputs>
Ask me for: my story in one line (a real incident, machine, building or system, plus the one question it raises, e.g. "how could this happen?") and the length (60-90 s short, or 8-12 min long form). If I have no idea, pitch me 3 with a cold-open line each and let me pick. Check every fact on Wikipedia (and the official investigation report, if there is one) before you write a word. Real victims and real people get names only if Wikipedia names them; never invent quotes, dialogue or private details.
</inputs>

<direction>
A 1920x960 (2:1) 25 fps 3D documentary explainer in the fern look, made 100% in code: scripted Blender scenes plus a 2D infographic layer. Calm, cold, precise: a museum model of the event, not an action movie.
3D look: untextured "clay" world. Every person is a faceless mannequin in matte white-grey (#D8D8D8 to #9A9A9A); props and rooms are plain grey models with bevelled edges. Only the hero object carries its real colours (e.g. the aircraft livery). Soft area lights, ambient occlusion, gentle depth of field, light film grain.
Three stages, nothing else:
- Sky: the hero object small in a sea of volumetric clouds over terrain, bright and overexposed (#89899E sky, white cloud tops).
- Studio void: a seamless dark floor (#101010 to #191919) with a barely visible 1 m floor grid, one soft top spotlight pooling under the subject, everything else falling to black. Used for every "how it works" model: cutaways, mechanisms, people in rooms.
- Interior: the real space rebuilt in grey with one tinted key light (cold teal-grey #262F32 walls, door #6B8A95), shot at human height.
Accent colour is information, never decoration: red light or red marks = danger or the critical person; green (#3DDC84-like) = unlocked/allowed; pale screen blue for displays. At most one accent per shot.
2D layer (white on dark, thin 1.5 px lines): a time ruler across the top with minute ticks, the current time above it and a small caret that slides as time passes; boxed time and date stamps bottom-left ("9:27 AM" / "24th March 2015", white text on a #444957 box at 85% opacity); dot grids where one dot = one person; Gantt-style timelines; portrait cards linked by lines with small speech bubbles; floating paper documents in 3D with a ticked box or a hand-drawn red circle. Type: one clean geometric sans (Jost or Futura-like), sentence case, 28-44 px, no outlines, no drop shadows except a faint one on 3D paper.
Banned: AI video or image generation, stock footage of the real event, fake news clips, gore or bodies, glowing sci-fi HUDs, glossy gradients, emoji, word-by-word captions, fast hard cutting, any frame where nothing moves.
</direction>

<structure>
Long, slow, continuous camera moves: median shot about 7-8 s, the best ones 30-75 s as one move; join chapters with a dip to black or a slow cross-dissolve, cut only inside the studio void. Narration about 150 wpm (calm; tune by ear).
Proportions for an 8-12 min film (scale down for a short: keep beats 1, 2, 4, 6, 8):
1. Cold open (0-15%): the hero object small in the clouds, time stamp bottom-left; then the observers who notice something is wrong (a dark control room, a big screen with the trace going down, the time ruler ticking minute by minute, red light flooding in on the worst minute). End on the last known moment, never the impact itself; fade to black.
2. Title sting (about 2 s): logo builds on a dark blue grid.
3. The aftermath (15-25%): what investigators found, shown as grey models only (the wreck as scattered grey shapes, the recorders on the void floor, a mannequin hand picking one up).
4. The mechanism (25-45%): rebuild the space and explain the one mechanism that made it possible as a clean cutaway in the void (e.g. the door, its keypad and its three switch states, each state lighting its accent colour). Then replay the event inside it in real time with the time stamp running.
5. Why the mechanism exists (one short beat): the historical reason, shown as a framed archival still or a grey model, not footage.
6. The human scale (45-55%): a dot grid of everyone affected, one dot highlighted per name you can source; one person's story told through a document or object.
7. The person behind it (55-80%): their path as a sequence of grey rooms in the void (bedroom, school, office), forms floating to camera with the decisive answer ticked, a Gantt timeline of the key months, a portrait-card diagram of who knew what and why the information never travelled.
8. The question and the change (80-100%): a still landscape with the open question in plain white text; then the rules that changed, typed in as a numbered list under the regulator's name; end on a slow pull-back to the hero stage with the final time stamp, and hold 2 s in silence before the fade.
</structure>

<build>
1. Tools (all free, all local). Install what's missing and tell me what you installed:
- Blender 4.x run headless (blender -b -P scene.py), Eevee Next for the clay look; Python with numpy, Pillow, OpenCV and Playwright; FFmpeg
- faster-whisper small.en int8 on the CPU; Kokoro (kokoro-onnx) with kokoro-v1.0.onnx and voices-v1.0.bin
- Google Fonts: Jost (UI and titles), IBM Plex Mono (time stamps and rulers)
- CC0 only for any 3D model you don't build (Poly Haven, Kenney, Quaternius); build people from one rigged mannequin with posed keyframes
- one free sombre ambient bed (low strings or a held synth pad), plus SFX: cabin hum, wind at altitude, radio beep, door lock clunk, keypad buzz, alarm tone, paper, distant rumble. If no free source is reachable, synthesise them in code and say so.
2. Voice: write short lines and show me the script before you record. Kokoro am_michael (or bm_george for a British read) at speed 1.0-1.05; one wav per line, joined; pauses at chapter breaks 0.8-1.2 s, inside a chapter shrink pauses over 0.35 s to 0.3 s. Run every name through Kokoro's phonemizer and respell (or substitute phonemes) until it's right. Word times: faster-whisper on the final wav.
3. Timing: key every camera move, light change, ruler tick, dot highlight, document and SFX to a word (by its nth occurrence), never to a second.
4. Scenes: one Python file per shot that builds the scene from primitives and CC0 parts, sets the camera path as one continuous Bezier move with ease-in-out, reads its start/end words from words.json and renders a PNG sequence. Clouds are volumetrics with a noise texture; keep the hero object under 15% of frame width in the sky shots.
5. 2D layer: one HTML canvas page (pure function of time, Playwright grabs it) renders rulers, stamps, dot grids, timelines, diagrams and text with alpha; FFmpeg composites it over the 3D sequences.
6. Render check: contact sheet of stills and full-size crops before the full render; after it, pull frames from the finished mp4 and check those.
7. Edit and sound: voice 12 dB over the bed, the bed ducking under each word; one SFX per event; a near-silent second before every chapter turn. Mix to -14 LUFS, encode H.264 CRF 19 with AAC.
</build>

<gotchas>
Eevee volumetric clouds flicker between frames unless the noise is animated in world space and samples are raised; render clouds once as a slow plate when the camera allows. Headless Blender has no display: set the render engine and GPU/CPU device in the script, not the UI. Mannequins look like toys when every light is soft; keep one hard key light per shot. Real logos and liveries are trademarks: use them only to identify the real subject, never as decoration. Archival photos need a licence or public-domain status and a credit in frame; if you don't have one, rebuild the moment as a grey model. Keep victims dignified: no bodies, no impact shot, no recreated final screams; the timestamp and the silence carry it.
</gotchas>

<start>
Ask me for my story first (or pitch me 3), fact-check it, then show me the script and a shot list (one line per shot: stage, subject, camera move, keyed word) before you make the voice.
</start>
