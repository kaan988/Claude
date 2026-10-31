# Playwright seeks the page (every frame is a pure function of time) and grabs the canvas
import sys, json, base64, subprocess, http.server, threading, functools, os, time
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.abspath(__file__))
def serve(port):
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    h = functools.partial(Q, directory=ROOT)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', port), h); threading.Thread(target=srv.serve_forever, daemon=True).start(); return srv
def open_page(p, port):
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-gpu-vsync', '--js-flags=--max-old-space-size=6000'])
    pg = b.new_page(viewport={'width': 1920, 'height': 960})
    pg.on('console', lambda m: print('console:', m.text) if m.type in ('error', 'warning') else None)
    pg.on('pageerror', lambda e: print('PAGEERROR', e))
    pg.goto(f'http://127.0.0.1:{port}/film.html')
    meta = pg.evaluate('window.hfReady'); return b, pg, meta
def grab(pg, frame, n=None):
    d = pg.evaluate(f"(()=>{{hfDrawFrame({frame}{','+str(n) if n else ''}); return document.getElementById('out').toDataURL('image/jpeg',0.95)}})()")
    return base64.b64decode(d.split(',')[1])
if __name__ == '__main__':
    mode = sys.argv[1]
    port = 8700 + int(sys.argv[2]) if len(sys.argv) > 2 else 8700
    srv = serve(port)
    with sync_playwright() as p:
        b, pg, meta = open_page(p, port)
        json.dump(meta, open('out/meta.json', 'w'), indent=1)
        if mode == 'stills':      # stills at given seconds
            for ts in sys.argv[3].split(','):
                f = round(float(ts)*25); t = time.time(); open(f'frames/still_{f:04d}.jpg', 'wb').write(grab(pg, f, int(sys.argv[4]) if len(sys.argv) > 4 else 2)); print('still', f, round(time.time()-t, 2), 's')
        elif mode == 'range':     # frames a..b to frames/f_XXXX.jpg
            a, bb = map(int, sys.argv[3].split(':')); t0 = time.time()
            for f in range(a, bb):
                open(f'frames/f_{f:04d}.jpg', 'wb').write(grab(pg, f))
                if f % 50 == 0: print(sys.argv[2], f, round(time.time()-t0), 's', flush=True)
        elif mode == 'missing':   # every frame f with f % n == k that is not on disk yet, up to an optional end frame
            k, n = map(int, sys.argv[3].split('/')); end = int(sys.argv[4]) if len(sys.argv) > 4 else meta['frames']; t0 = time.time(); done = 0
            for f in range(k, end, n):
                if os.path.exists(f'frames/f_{f:04d}.jpg'): continue
                p = f'frames/f_{f:04d}.jpg'; open(p + '.tmp', 'wb').write(grab(pg, f)); os.replace(p + '.tmp', p); done += 1   # atomic: a killed run leaves no half-written frame
                if done % 50 == 0: print(sys.argv[2], f, done, round(time.time()-t0), 's', flush=True)
        b.close()
