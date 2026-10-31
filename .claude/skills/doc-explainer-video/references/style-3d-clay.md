# 3D clay documentary style (fern-like)

A 1920x960 (2:1), 25 fps documentary: a calm, cold museum model of a real event. Examples: `assets/example-3d-film.html` (The Hugging Face Incident, 4:46, 35 shots). Original brief: `assets/prompt-3d.md`. Measured from three reference parts: median shot 7–8 s, longest single move 78 s, chapters joined by dips to black, integrated loudness −14 LUFS.

## Look
- **Untextured clay world**: every person a faceless mannequin (merged capsule legs, capsule torso, sphere head) in matte white-grey; props and rooms plain grey, bevelled (RoundedBoxGeometry). Only the hero object carries real colour.
- **Three stages, nothing else**: (1) sky or an interior rebuilt in grey with a cold teal-grey key, shot at human height (e.g. a server hall aisle); (2) the **studio void**: seamless floor #1a1a1a, background/fog #0b0b0b, a barely visible 1 m grid, one soft top spotlight pooling under the subject; (3) optional bright sky stage. Dip to black between stages.
- **Colour is information**: red (#E0322B) = attacker/danger, blue (#3C8DFF) = defenders, green (#3DDC84) = allowed/on. Agents as red-glowing mannequins (emissive ~0.45), defenders blue.
- **2D layer** (white on dark, 1.5 px lines): time ruler across the top with a sliding caret; boxed date stamps bottom-left (Plex Mono on #444957 at 85 %); leader-line labels (Jost 500 34 px + 24 px subtitle); dot grids where one dot = N things; floating paper cards with live canvas textures (documents, quote cards, letters) with typed text and red underlines.
- Type: Jost (titles, labels), IBM Plex Mono (stamps, rulers, documents). Sentence case. Vignette, 5 % grain.

## Structure
Short (≤ 60 s): cold open → mechanism → human scale → question. Long (3–12 min), chapters with rough shares: cold open (15 %), title sting (2 s, no voice, built on a dark blue grid), background/test (10 %), warnings (5 %), the mechanism and escape (20 %), the attack (15 %), discovery and response (15 %), the question and the change (15 %), last line held 2–2.5 s, fade.

## Build specifics (Three.js 0.160, software WebGL works)
- Two `THREE.Scene`s (interior and void) rendered by one WebGLRenderer with `preserveDrawingBuffer: true`, ACES tone mapping, PCF soft shadows; the 2D layer is a separate canvas composited each frame (`canvas#out`).
- Import map to vendored `three.module.min.js` and addons (BufferGeometryUtils, RoundedBoxGeometry). Vendor them (`cdn.jsdelivr.net/npm/three@0.160.0/...`).
- Crowds as one InstancedMesh (1,200 mannequins is fine); per-frame matrix/colour updates are cheap, shadows are the cost.
- **Key light follows the camera's look target**; scale fog and key with camera distance (`fog = min(.02, .45/dist)`, key height/angle/intensity up with distance), or wide shots vanish into fog.
- Cards: plane + CanvasTexture redrawn only while visible; fade with opacity, rise 0.4 m on entry.
- Pops: `1 + e^(−7v)·sin(16v − π/2)·0.25`. Camera shots: list of `{t, dur, pos, look, fov}` keyed to words, cubic in-out, holds creep 4 cm/s.
- Keep figures out of the way of the subject: if a desk sits inside a crowd, hide the instances around it (scale 0) rather than moving the camera into heads.
- Never show violence or bodies for real incidents; the timestamp, the empty frame and silence carry it.
