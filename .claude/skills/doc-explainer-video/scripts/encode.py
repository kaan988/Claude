"""Encode rendered frames + mix to H.264, then verify the result from the MP4 itself.

Usage:
  python encode.py --fps 25 [--project .] [--pattern frames/f_%05d.jpg] [--audio audio/mix.m4a] [--out out/film.mp4]
                   [--crf 19] [--preset slow] [--sheet 12] [--at "3.2:door,41.5:counter"]
                   [--web [--web-mb 11] [--web-height 0]] [--web-only] [--ffmpeg ffmpeg] [--ffprobe ffprobe]

Main encode: libx264 CRF 19 preset slow yuv420p, AAC 192k, +faststart, -shortest -> out/film.mp4.
Verify (always, from the MP4, never from the page): ffprobe duration of file/video/audio, ebur128 integrated
loudness and true peak, a contact sheet of --sheet frames evenly spread (out/check_sheet.jpg) and, with --at,
frames at given times (keyed words) in out/check_at.jpg. Look at both sheets before delivering.
--web: two-pass encode that fits --web-mb (default 11 MB, so a base64 page stays < 16 MB) -> out/film_web.mp4;
--web-height 0 picks 1080/720/540 from the bitrate the budget allows. --web-only skips the main encode.
"""
import argparse, io, json, os, re, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw

for _s in (sys.stdout, sys.stderr):   # Windows pipes default to cp1252; IPA and transcript text need UTF-8
    if hasattr(_s, 'reconfigure'): _s.reconfigure(encoding='utf-8', errors='replace')
ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('--project', type=Path, default=Path('.'))
ap.add_argument('--fps', type=float, required=True)
ap.add_argument('--pattern', default='frames/f_%05d.jpg', help='frame pattern relative to project (ffmpeg %%0Nd syntax)')
ap.add_argument('--start-number', type=int, default=0)
ap.add_argument('--audio', type=Path, help='default: audio/mix.m4a, else audio/mix.wav')
ap.add_argument('--out', type=Path, default=Path('out/film.mp4'))
ap.add_argument('--crf', type=int, default=19)
ap.add_argument('--preset', default='slow')
ap.add_argument('--sheet', type=int, default=12, help='frames in the contact sheet')
ap.add_argument('--at', help='"t:label,t:label" frames to pull at given seconds')
ap.add_argument('--web', action='store_true')
ap.add_argument('--allow-gaps', action='store_true', help='encode even if frames are missing')
ap.add_argument('--web-only', action='store_true')
ap.add_argument('--web-mb', type=float, default=11)
ap.add_argument('--web-height', type=int, default=0, help='0 = auto from bitrate')
ap.add_argument('--web-audio', default='128k')
ap.add_argument('--ffmpeg', default='ffmpeg')
ap.add_argument('--ffprobe', default='ffprobe')
A = ap.parse_args()
P = A.project; out = P/A.out; out.parent.mkdir(parents=True, exist_ok=True)
def run(cmd, **kw): return subprocess.run([str(c) for c in cmd], check=True, **kw)
def ff(*a): run([A.ffmpeg, '-y', '-hide_banner', '-loglevel', 'error', *a])
def probe(f):
    j = json.loads(run([A.ffprobe, '-v', 'error', '-show_format', '-show_streams', '-of', 'json', f], capture_output=True).stdout)
    s = {x['codec_type']: x for x in j['streams']}
    return float(j['format']['duration']), s
audio = P/A.audio if A.audio else next((P/f for f in ('audio/mix.m4a', 'audio/mix.wav') if (P/f).exists()), None)
if audio is None or not audio.exists(): sys.exit('no audio: run mix.py first or pass --audio')

def check_frames():                                         # ffmpeg stops at the first gap and -shortest would cut the audio to match
    m = re.search(r'%0(\d+)d', A.pattern); d = int(m.group(1)) if m else 5
    meta = P/'out/meta.json'
    n = int(json.loads(meta.read_text(encoding='utf-8'))['frames']) if meta.exists() else None
    if n is None: print('warning: no out/meta.json, cannot check the frame count'); return
    bad = []
    for f in range(A.start_number, A.start_number + n):
        p = P/(A.pattern % f)
        try:
            with open(p, 'rb') as h:
                head = h.read(2); h.seek(-2, os.SEEK_END); ok = head == b'\xff\xd8' and h.read(2) == b'\xff\xd9'
        except OSError: ok = False
        if not ok: bad.append(f)
    if bad: sys.exit(f'{len(bad)} of {n} frames missing or broken (e.g. {bad[:10]}): finish the render first, or use --allow-gaps')
    print(f'all {n} frames present')
if not A.web_only and not A.allow_gaps: check_frames()
if not A.web_only:
    ff('-framerate', A.fps, '-start_number', A.start_number, '-i', P/A.pattern, '-i', audio,
       '-c:v', 'libx264', '-preset', A.preset, '-crf', A.crf, '-pix_fmt', 'yuv420p',
       '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out)
if not out.exists(): sys.exit(f'{out} missing (run without --web-only first)')

# ---- verify from the MP4 ----
dur, st = probe(out); v, a = st.get('video', {}), st.get('audio', {})
vd, ad = float(v.get('duration', 0)), float(a.get('duration', 0))
print(f"{out}: {out.stat().st_size/1e6:.1f} MB, {v.get('width')}x{v.get('height')} {v.get('r_frame_rate')} fps, "
      f"{v.get('nb_frames', '?')} frames, duration {dur:.3f} s (video {vd:.3f}, audio {ad:.3f})")
if not a: print('WARNING: no audio stream')
elif abs(vd-ad) > .25: print(f'WARNING: video and audio differ by {abs(vd-ad):.2f} s (missing frames or short mix?)')
r = subprocess.run([A.ffmpeg, '-hide_banner', '-nostats', '-i', str(out), '-map', '0:a:0', '-filter_complex', 'ebur128=peak=true', '-f', 'null', '-'],
                   capture_output=True, text=True, encoding='utf-8', errors='replace')
summ = r.stderr[r.stderr.rfind('Summary:'):]
I = re.search(r'I:\s*(-?[\d.]+) LUFS', summ); TP = re.search(r'Peak:\s*(-?[\d.]+|-inf) dBFS', summ)
print(f"loudness of the mp4: {I.group(1) if I else '?'} LUFS integrated, true peak {TP.group(1) if TP else '?'} dBFS")

def grab(f, t):                                          # one decoded frame at t seconds, as a PIL image
    png = run([A.ffmpeg, '-hide_banner', '-loglevel', 'error', '-ss', f'{t:.3f}', '-i', f, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'],
              capture_output=True).stdout
    return Image.open(io.BytesIO(png)).convert('RGB') if png else None
def sheet(items, dst, cols=4, tw=480):
    ims = [(grab(out, t), lab) for t, lab in items]; ims = [(i, l) for i, l in ims if i]
    if not ims: print('no frames decoded for', dst); return
    th = round(tw*ims[0][0].height/ims[0][0].width); rows = (len(ims)+cols-1)//cols
    S = Image.new('RGB', (cols*tw, rows*th), 'black'); d = ImageDraw.Draw(S)
    for k, (im, lab) in enumerate(ims):
        x, y = (k % cols)*tw, (k//cols)*th; S.paste(im.resize((tw, th)), (x, y))
        d.rectangle([x, y, x+len(lab)*7+10, y+16], fill='black'); d.text((x+5, y+3), lab, fill='yellow')
    S.save(dst, quality=85); print('wrote', dst, f'({len(ims)} frames)')
n = max(1, A.sheet); span = max(0, vd or dur) - .1
sheet([(span*(k+.5)/n, f'{span*(k+.5)/n:.2f}s') for k in range(n)], out.parent/'check_sheet.jpg')
if A.at:
    items = [(float(t), f'{float(t):.2f}s {lab}') for t, _, lab in (p.strip().partition(':') for p in A.at.split(',') if p.strip())]
    sheet(items, out.parent/'check_at.jpg', cols=min(4, len(items)))

# ---- web encode: two-pass to a size budget ----
if A.web or A.web_only:
    web = out.parent/'film_web.mp4'; ak = int(A.web_audio.rstrip('k'))
    budget = A.web_mb*1e6*8*.96                              # bits, 4 % container overhead
    for attempt in range(3):
        vk = int(budget/dur/1000 - ak)
        if vk < 150: sys.exit(f'{A.web_mb} MB is too small for {dur:.0f} s (video would get {vk} kb/s)')
        h = A.web_height or (1080 if vk > 2500 else 720 if vk > 1000 else 540)
        h = min(h, int(v.get('height', h))); vf = ['-vf', f'scale=-2:{h}:flags=lanczos']
        with tempfile.TemporaryDirectory() as td:            # pass logs out of the project dir
            log = Path(td)/'pass'; common = ['-i', out, *vf, '-c:v', 'libx264', '-preset', 'slow', '-b:v', f'{vk}k',
                                             '-maxrate', f'{int(vk*1.6)}k', '-bufsize', f'{vk*2}k', '-pix_fmt', 'yuv420p', '-passlogfile', log]
            ff(*common, '-pass', '1', '-an', '-f', 'null', os.devnull)
            ff(*common, '-pass', '2', '-c:a', 'aac', '-b:a', A.web_audio, '-movflags', '+faststart', web)
        size = web.stat().st_size
        print(f'{web}: {size/1e6:.2f} MB at {h}p, video {vk} kb/s (budget {A.web_mb} MB)')
        if size <= A.web_mb*1e6: break
        budget *= A.web_mb*1e6/size*.97                      # overshot: shrink and retry
