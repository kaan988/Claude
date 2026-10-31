# Map explainer style (Johnny Harris / RealLifeLore look)

A 1920x1080, 30 fps film on one continuous camera: real satellite imagery for close-ups, a vintage paper map for everything wider, a boiling red marker drawn on top, and physical paper props. Example: `assets/example-map-film.html` (Point Roberts, 41 s). Original brief: `assets/prompt-map.md`.

## Look
- **Satellite**: Sentinel-2 cloudless **2016** by EOX (`https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg`, note z/y/x). Only the 2016 layer is CC BY 4.0; later years are non-commercial. Keep the credit in frame for the whole film: "Imagery: Sentinel-2 cloudless 2016 by EOX, contains modified Copernicus Sentinel data".
- Cut the land out and lay it over a drawn navy sea (#14304A centre to #0B1E31 edges) with a soft teal shallow-water halo (#2A6274).
- **Paper map**: ocean #A9C2C4, land #ECE2CA, countries #E6C1A7 / #EEDAA4 / #D2DEB8, coast dark brown 1.25 px over three soft water-lining strokes (30, 19, 10 px), dashed brown borders, 10° graticule at 26 %, labels Cormorant Garamond 700, letter-spaced.
- Paper texture multiplied over everything (85 % on paper, 22 % on satellite), 7 % grain, warm vignette.
- **Marker** #D9291D, 7–10 px, round caps, resampled every ~26 px, wobble ±1.5 px re-rolled 8 times a second so it boils like ink; dark underlay 1.6 px wider, pink 30 % highlight offset up-left. Circles 1.1–1.13 turns. Handwriting in Permanent Marker.
- **Props**: cream tags with a colour bar and tape (Oswald 700 54 px title, Special Elite 28 px subtitle typed in on the next word), a black count-up tag, torn strips with a yellow highlighter swipe, tear-off calendar pages that flip, clocks, a red rubber stamp with camera shake, a tracker card. Pop-ins are a spring (damping 0.48, 19 rad/s) from 55 % with a small rotation settle; exits shrink and fade in 0.22 s.
- Live lat/long readout in Special Elite bottom-left on satellite shots.

## Structure (30–45 s)
Hook on tight satellite ("From this ___, kids/you ___"), red circle on the key word with a handwritten word → name the places (tag on the name, subtitle on the next word) → the key number (dashed route + counting tag) → context: pull out to the paper map at continent scale in ~1.3 s, the big line drawn in marker with a handwritten label, dive straight back → consequence: two props, one flips → local twist: torn strips with highlighter → the story: stamp the year with shake, frame splits into two tinted sides, tracker card, dotted path with a moving marker that crosses the line on the right word → ending: pull back to the big map, both sides tinted, red circle on the subject, end card whose number is scribbled out and replaced by the punchline, held 1.5 s.

## Build specifics
- **Projection**: web Mercator in world units (256 = globe), camera = focus point + its screen offset + zoom Z at 2^Z px per unit. Rotate so the story's region is far from the antimeridian (e.g. centre lon −100 for North America); apply the same rotation to the d3 projection and to the satellite mosaic placement.
- **Zoom moves**: Z interpolates linearly under a quartic ease. Pan proportional to view width, `p(u) = (2^-Z(u) − 2^-Z0) / (2^-Z1 − 2^-Z0)`, keeps the start in frame while zooming out; a naive linear pan races ahead and shows empty sea mid-zoom.
- **Satellite mosaics** at z9 / z11 / z13 around the subject; finer mosaics fade in with zoom (z11 over Z 10–11, z13 over Z 12–13); satellite fades to paper between Z 9.3 and 7.3.
- **Land mask**: the literal "R > B + 5" fails on forest and towns in this imagery (land can be bluer than red). Measure red-minus-blue relative to the sea's own level (median of smooth dark pixels, about −31) and call land R−B > sea + 6…8; exclude the smooth teal river plume (G−B > 8 and local std < 6). Then 1.5 px blur, open + close, remove specks, fill small holes, feather mosaic edges (bake the feather into the alpha).
- **Paper map**: pre-render a pyramid of canvases every 0.5 Z covering only the regions the camera visits at that zoom (sample the camera path), 50 m data below Z 5.5, 10 m above; pick the level just above the camera zoom so lines stay crisp. Drop Antarctica and any ring with `d3.geoArea > 2π` or land floods the sea.
- **Motion blur**: 8 sub-samples over half a frame, raised up to 40 when the zoom is fast (otherwise fast zooms ghost).
- **Borders on satellite**: compute where the border line actually crosses land from the mask and draw the dashed border only there.
- The page needs an http server (file:// taints the canvas and blocks JSON), so `scripts/render.py` serves the project. Wrap large topojson as JS globals anyway.
