"""Render a code-made film page to JPEG frames with Playwright (every frame is a pure function of time).

Usage:
  python render.py PROJECT stills --times 1.5,8,30 [--samples 2]
  python render.py PROJECT frames [--workers 3] [--end 900]
Common flags: --page film.html --width 1920 --height 1080 [--fps N] [--digits N] [--quality 0.95]
              --gpu [--angle d3d11|metal|vulkan] | (default) software WebGL via SwiftShader
stills render at full quality unless --samples lowers the page's own motion-blur sample count.
--fps defaults to meta.fps from the page; --digits defaults to what frames/ already uses, else 5.
frames exits non-zero, naming missing frames, if anything below --end is absent or broken.
              --chromium PATH   (override the browser executable)

The page must expose a ready promise (window.filmReady / hfReady / prReady) resolving to
{duration, frames, events, ...} and a draw function (window.filmDrawFrame / hfDrawFrame / prDrawFrame)
that paints frame N into canvas#out. Meta goes to PROJECT/out/meta.json, frames to PROJECT/frames/.
"""
import argparse, base64, functools, http.server, json, os, subprocess, sys, threading, time
from pathlib import Path

READY = ('filmReady', 'hfReady', 'prReady')
DRAW = ('filmDrawFrame', 'hfDrawFrame', 'prDrawFrame')


def serve(root):
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    # pin MIME types: on Windows, mimetypes reads the registry, which can map .js to text/plain and break module scripts
    Q.extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript', '.mjs': 'text/javascript',
                        '.json': 'application/json', '.wasm': 'application/wasm', '.css': 'text/css', '.html': 'text/html',
                        '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg'}
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=str(root)))   # port 0 = free port
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def browser_args(a):
    args = ['--disable-gpu-vsync', '--js-flags=--max-old-space-size=6000']
    if a.gpu:
        args += ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--force_high_performance_gpu']
        angle = a.angle or {'win32': 'd3d11', 'darwin': 'metal'}.get(sys.platform)
        if angle: args += ['--use-gl=angle', f'--use-angle={angle}']
    else:   # software WebGL: slow but identical everywhere, works headless without a GPU
        args += ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']
    return args


def launch(p, a):
    kw = {'args': browser_args(a)}
    if a.chromium: kw['executable_path'] = str(a.chromium)
    try:
        return p.chromium.launch(**kw)
    except Exception as e:
        if "executable doesn't exist" in str(e).lower():   # bundled revision missing or bad --chromium path
            sys.exit(f'Chromium not found ({str(e).splitlines()[0]}).\nPass --chromium PATH/TO/chrome or run: python -m playwright install chromium')
        raise


def open_page(p, a, url):
    b = launch(p, a)
    pg = b.new_page(viewport={'width': a.width, 'height': a.height})
    pg.on('console', lambda m: print('console:', m.type, m.text, m.location.get('url', ''), flush=True) if m.type in ('error', 'warning') else None)
    pg.on('response', lambda r: print('HTTP', r.status, r.url, flush=True) if r.status >= 400 else None)
    pg.route('**/favicon.ico', lambda r: r.fulfill(status=204))   # silence the browser's automatic favicon 404
    pg.on('pageerror', lambda e: print('PAGEERROR', e, flush=True))
    pg.goto(url)
    ready = pg.evaluate(f"{json.dumps(READY)}.find(k => window[k] !== undefined) || null")
    if not ready: sys.exit(f'page defines none of window.{"/".join(READY)}')
    meta = pg.evaluate(f'window.{ready}')   # evaluate awaits the promise
    gpu = pg.evaluate("(() => { const g = document.createElement('canvas').getContext('webgl'); if (!g) return 'no WebGL';"
                      " const e = g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER) })()")
    print('WebGL renderer:', gpu, flush=True)
    if a.gpu and 'swiftshader' in str(gpu).lower(): print('warning: --gpu requested but WebGL runs on SwiftShader (software); update the graphics driver or try --angle', flush=True)
    draw = pg.evaluate(f"{json.dumps(DRAW)}.find(k => typeof window[k] === 'function') || null")
    if not draw: sys.exit(f'page defines none of window.{"/".join(DRAW)} after {ready} resolved')
    return b, pg, meta, draw


def grab(pg, draw, frame, samples=None):
    extra = f',{int(samples)}' if samples else ''   # optional 2nd arg, e.g. motion-blur sample override
    d = pg.evaluate(f"(() => {{ window.{draw}({int(frame)}{extra}); return document.getElementById('out').toDataURL('image/jpeg', {QUALITY}) }})()")
    return base64.b64decode(d.split(',', 1)[1])


def write_atomic(path, data):
    tmp = path.with_name(path.name + '.tmp'); tmp.write_bytes(data)   # a killed run leaves no half-written frame
    for i in range(20):   # Windows: Defender or Explorer may hold a fresh file for a moment
        try: os.replace(tmp, path); return
        except PermissionError:
            if i == 19: raise
            time.sleep(.05 * (i + 1))


def jpeg_ok(path):
    try:
        with open(path, 'rb') as f:
            if f.read(2) != b'\xff\xd8': return False
            f.seek(-2, os.SEEK_END); return f.read(2) == b'\xff\xd9'
    except OSError:
        return False


def spawn_workers(a):
    # re-run this script once per worker; each takes frames with index % N == k
    base = [sys.executable, str(Path(__file__).resolve()), str(a.project), 'frames', '--page', a.page,
            '--width', str(a.width), '--height', str(a.height), '--digits', str(a.digits), '--quality', str(a.quality)]
    if a.fps: base += ['--fps', str(a.fps)]
    if a.end is not None: base += ['--end', str(a.end)]
    if a.gpu: base.append('--gpu')
    if a.angle: base += ['--angle', a.angle]
    if a.chromium: base += ['--chromium', str(a.chromium)]
    procs = [subprocess.Popen(base + ['--worker', f'{k}/{a.workers}']) for k in range(a.workers)]
    rcs = [p.wait() for p in procs]
    rc = next((r for r in rcs if r != 0), 0)   # a worker killed by a signal returns a negative code
    print(f'workers done (exit codes {rcs})', flush=True)
    return rc or check_complete(a)


def frame_path(a, f): return a.project / 'frames' / f'f_{f:0{a.digits}d}.jpg'


def check_complete(a):
    meta = json.loads((a.project / 'out' / 'meta.json').read_text('utf-8'))
    end = a.end if a.end is not None else int(meta['frames'])
    bad = [f for f in range(end) if not jpeg_ok(frame_path(a, f))]
    if bad:
        print(f'{len(bad)} of {end} frames missing or broken, e.g. {bad[:10]}; rerun the same command to fill them in', flush=True); return 2
    print(f'all {end} frames present', flush=True); return 0


def detect_digits(frames_dir):
    widths = {len(p.stem) - 2 for p in frames_dir.glob('f_*.jpg') if p.stem[2:].isdigit()}
    if len(widths) > 1: sys.exit(f'frames/ mixes {sorted(widths)}-digit frame names; remove one set first')
    return widths.pop() if widths else 5


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('project', type=Path, help='project dir served over http (contains the page)')
    ap.add_argument('mode', choices=['stills', 'frames'])
    ap.add_argument('--page', default='film.html')
    ap.add_argument('--width', type=int, default=1920)
    ap.add_argument('--height', type=int, default=1080)
    ap.add_argument('--fps', type=float, help='turns --times seconds into frames (default: meta.fps from the page, else 30 with a warning)')
    ap.add_argument('--times', help='stills: comma-separated seconds')
    ap.add_argument('--samples', type=int, help='stills: 2nd arg passed to the draw function (optional)')
    ap.add_argument('--end', type=int, help='frames: stop before this frame (default meta.frames)')
    ap.add_argument('--workers', type=int, default=1, help='frames: parallel browser processes')
    ap.add_argument('--worker', help=argparse.SUPPRESS)   # internal: "k/N"
    ap.add_argument('--digits', type=int, help='zero padding of frame numbers (default: what frames/ already uses, else 5)')
    ap.add_argument('--quality', type=float, default=.95, help='JPEG quality 0..1')
    ap.add_argument('--gpu', action='store_true', help='use the real GPU instead of SwiftShader')
    ap.add_argument('--angle', help='Linux --gpu only: ANGLE backend, e.g. vulkan')
    ap.add_argument('--chromium', type=Path, help='browser executable (default: Playwright bundled Chromium)')
    for s in (sys.stdout, sys.stderr):   # Windows pipes default to cp1252; page text may hold any character
        if hasattr(s, 'reconfigure'): s.reconfigure(encoding='utf-8', errors='replace')
    a = ap.parse_args()
    a.project = a.project.resolve()
    global QUALITY; QUALITY = a.quality
    if not (a.project / a.page).is_file(): sys.exit(f'no {a.page} in {a.project}')
    if a.mode == 'stills' and not a.times: sys.exit('stills needs --times')
    frames_dir = a.project / 'frames'; frames_dir.mkdir(exist_ok=True); (a.project / 'out').mkdir(exist_ok=True)
    if a.digits is None: a.digits = detect_digits(frames_dir)
    if a.mode == 'frames' and a.workers > 1 and not a.worker: sys.exit(spawn_workers(a))
    k, n = map(int, a.worker.split('/')) if a.worker else (0, 1)
    tag = f'[{k}/{n}]' if a.worker else ''

    from playwright.sync_api import sync_playwright
    srv = serve(a.project)
    try:
        with sync_playwright() as p:
            b, pg, meta, draw = open_page(p, a, f'http://127.0.0.1:{srv.server_address[1]}/{a.page}')
            if k == 0: write_atomic(a.project / 'out' / 'meta.json', json.dumps(meta, indent=1).encode('utf-8'))
            fps = a.fps or meta.get('fps')
            if a.mode == 'stills':
                if not fps: fps = 30; print('warning: page meta has no fps and --fps not given; assuming 30', flush=True)
                for ts in a.times.split(','):
                    f = round(float(ts) * fps); t = time.time()
                    write_atomic(frames_dir / f'still_{f:04d}.jpg', grab(pg, draw, f, a.samples or None))
                    print('still', f, f'{time.time() - t:.2f}s', flush=True)
            else:
                end = a.end if a.end is not None else int(meta['frames']); t0 = time.time(); done = skipped = 0
                for f in range(k, end, n):
                    path = frame_path(a, f)
                    if jpeg_ok(path): skipped += 1; continue
                    if path.exists(): print(tag, 'broken frame, re-rendering', path.name, flush=True)
                    write_atomic(path, grab(pg, draw, f)); done += 1
                    if done % 50 == 0:
                        el = time.time() - t0; print(tag, 'frame', f, 'rendered', done, f'{el:.0f}s', f'{done / el:.2f} fps', flush=True)
                el = time.time() - t0
                print(tag, f'done: rendered {done}, skipped {skipped} (end {end}) in {el:.1f}s', flush=True)
            b.close()
        if a.mode == 'frames' and not a.worker: return check_complete(a)
    finally:
        srv.shutdown()


QUALITY = .95

if __name__ == '__main__':
    sys.exit(main())
