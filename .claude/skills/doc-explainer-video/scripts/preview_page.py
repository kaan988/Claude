"""Build a single self-contained HTML player page (video embedded as a base64 data URI) for private sharing.

Usage:
  python preview_page.py out/film_web.mp4 --title "THE HUGGING FACE INCIDENT" [--caption "51 seconds, 1920x960. ..."]
                         [--note "Made entirely in code."] [--button "Play with sound"] [--accent "#D9291D"]
                         [--lang en] [--out out/preview.html] [--max-mb 16]

Dark single-theme screening room: title, the film, a big accent button that unmutes and plays (phones start
muted or block autoplay), a caption and an optional small note. The page must stay under 16 MB (artifact
limit); base64 adds a third, so make the video with `encode.py --web --web-mb 11`. Aspect ratio comes from
the file (ffprobe), so 2:1 and 16:9 films both fit. Publish the page with the Artifact tool.
"""
import argparse, base64, html, json, subprocess, sys
from pathlib import Path

for _s in (sys.stdout, sys.stderr):   # Windows pipes default to cp1252; IPA and transcript text need UTF-8
    if hasattr(_s, 'reconfigure'): _s.reconfigure(encoding='utf-8', errors='replace')
ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('video', type=Path)
ap.add_argument('--title', required=True)
ap.add_argument('--caption', default='')
ap.add_argument('--note', default='')
ap.add_argument('--button', default='Play with sound')
ap.add_argument('--accent', default='#D9291D')
ap.add_argument('--lang', default='en')
ap.add_argument('--out', type=Path, default=Path('out/preview.html'))
ap.add_argument('--max-mb', type=float, default=16)
ap.add_argument('--ffprobe', default='ffprobe')
A = ap.parse_args()

try:
    j = json.loads(subprocess.run([A.ffprobe, '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', str(A.video)],
                                  capture_output=True, check=True).stdout)['streams'][0]
    aspect = f"{j['width']} / {j['height']}"
except Exception: aspect = '16 / 9'
e = html.escape
b64 = base64.b64encode(A.video.read_bytes()).decode('ascii')
page = f'''<meta charset="utf-8">
<title>{e(A.title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Special+Elite&display=swap">
<style>
/* one dark screening room, the film centred, a typed caption under it */
:root {{ --bg: #14110E; --screen: #000; --paper: #ECE2CA; --muted: #A89A82; --accent: {e(A.accent)};
  --display: "Oswald", "Arial Narrow", sans-serif; --type: "Special Elite", "Courier New", monospace; color-scheme: dark }}
html, body {{ background: var(--bg); }}
body {{ margin: 0; color: var(--paper); font-family: var(--type); }}
main {{ max-width: 1100px; margin: 0 auto; padding-block: 28px 40px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
  display: grid; gap: 16px; }}
h1 {{ font-family: var(--display); font-weight: 700; letter-spacing: .06em; font-size: clamp(26px, 4vw, 40px); margin: 0; text-wrap: balance; }}
video {{ width: 100%; max-width: 100%; aspect-ratio: {aspect}; background: var(--screen); display: block; box-shadow: 0 10px 40px rgba(0,0,0,.5); }}
p {{ margin: 0; color: var(--muted); font-size: 15px; line-height: 1.6; max-width: 65ch; }}
.note {{ font-size: 12px; }}
.stage {{ position: relative; }}
#play {{ position: absolute; inset: 0; margin: auto; width: fit-content; height: fit-content; padding: 16px 26px; border: 0; cursor: pointer;
  background: var(--accent); color: var(--paper); font-family: var(--display); font-weight: 700; font-size: clamp(16px, 2.4vw, 24px);
  letter-spacing: .08em; text-transform: uppercase; box-shadow: 0 8px 24px rgba(0,0,0,.5); }}
#play:focus-visible {{ outline: 3px solid var(--paper); outline-offset: 3px; }}
</style>
<main>
  <h1>{e(A.title)}</h1>
  <div class="stage"><video controls playsinline preload="auto" id="film" src="data:video/mp4;base64,{b64}"></video><button id="play" type="button">&#9654;&nbsp; {e(A.button)}</button></div>
  {f'<p>{e(A.caption)}</p>' if A.caption else ''}
  {f'<p class="note">{e(A.note)}</p>' if A.note else ''}
</main>
<script>
const v = document.getElementById('film'), b = document.getElementById('play');
b.addEventListener('click', () => {{ v.muted = false; v.volume = 1; v.play().catch(() => {{}}); b.hidden = true; }});
v.addEventListener('play', () => {{ b.hidden = true; }});
v.addEventListener('ended', () => {{ b.hidden = false; }});
</script>
'''
A.out.parent.mkdir(parents=True, exist_ok=True)
A.out.write_text(page, encoding='utf-8')
mb = A.out.stat().st_size/1e6
print(f'{A.out}: {mb:.2f} MB (video {A.video.stat().st_size/1e6:.2f} MB, aspect {aspect})')
if mb > A.max_mb: A.out.unlink(); sys.exit(f'page is {mb:.1f} MB > {A.max_mb} MB: re-encode with encode.py --web --web-mb {A.max_mb*0.72:.1f}')
