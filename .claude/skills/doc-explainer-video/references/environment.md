# Environment, installs and timings

## Hosts to allow (cloud sandboxes block most by default)
| Host | Needed for |
|---|---|
| `en.wikipedia.org` | fact-checking (fetch `/wiki/<Title>` HTML; the `/w/api.php` endpoint rate-limits with 429) |
| `tiles.maps.eox.at` | Sentinel-2 cloudless 2016 tiles (map style only) |
| `huggingface.co` **and** `us.aws.cdn.hf.co` | faster-whisper model files (the API host alone is not enough; weights come from the CDN) |
| `github.com` + release asset hosts | Kokoro `kokoro-v1.0.onnx` and `voices-v1.0.bin` (thewh1teagle/kokoro-onnx release `model-files-v1.0`) |
| `raw.githubusercontent.com` | Google Fonts files (`google/fonts`), Natural Earth GeoJSON |
| `cdn.jsdelivr.net` | d3 7.9.0, topojson-client 3.1.0, world-atlas 2.0.2, three 0.160.0 |
| `pypi.org`, `files.pythonhosted.org` | Python packages |
| `download.blender.org` | only if rendering with Blender |

Sound libraries (freesound, pixabay, archive.org) are often blocked; `scripts/sfx.py` synthesizes every effect and the bed instead. Say so to the user.

If YouTube asks a cloud machine to "sign in to confirm you're not a bot", stop: do not work around bot checks. Ask the user for the video file or screenshots instead (public oEmbed title/thumbnail is fine).

## Installs
`pip install numpy pillow opencv-python-headless playwright faster-whisper kokoro-onnx soundfile scipy pyloudnorm` plus FFmpeg. In the Claude cloud container a Chromium already exists at `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`; a newer pip Playwright looks for another revision, so pass `--chromium` with that path instead of installing browsers. Download the faster-whisper weights directly (`config.json`, `tokenizer.json`, `vocabulary.txt`, `model.bin` from `Systran/faster-whisper-small.en`) if the hub client fails, and pass the folder with `--model`.

## Render-time table (software WebGL, 4 CPUs, 3 workers)
| Content | s per frame per worker | 50 s film | 5 min film |
|---|---|---|---|
| 2D canvas map, 8–40 blur samples | 1–1.5 | ~15 min | ~1.5 h |
| Three.js, few objects | 2.5–3 | ~20 min | ~2.5 h |
| Three.js, 1,200 shadowed figures | 3.5–4 | ~25 min | ~4.5 h |

A local GPU is 10–30× faster (see `local-gpu.md`). Cloud background commands stop after 2 hours: render in chunks with `--end`; the frames mode resumes and re-renders any frame a kill left broken. Running more workers than cores does not help: three workers already saturate four CPUs.

## Disk
Frames are ~200–250 KB JPEGs: 50 s ≈ 250 MB, 5 min ≈ 1.5 GB. Delete frames after a verified encode if space is tight.
