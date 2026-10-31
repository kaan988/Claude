# Fetch Sentinel-2 cloudless 2016 (EOX, CC BY 4.0) tiles at z9/z11/z13 and stitch mosaics
import math, os, io, concurrent.futures as cf, urllib.request, numpy as np
from PIL import Image
URL = 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg'
LEVELS = {9: (-130.5, 45.0, -115.5, 53.0), 11: (-124.6, 48.25, -121.6, 49.75), 13: (-123.30, 48.88, -122.62, 49.15)}
def tx(lon, z): return (lon+180)/360*2**z
def ty(lat, z):
    r = math.radians(lat); return (1-math.log(math.tan(r)+1/math.cos(r))/math.pi)/2*2**z
def get(z, x, y):
    p = f'tiles/{z}/{y}_{x}.jpg'
    if not os.path.exists(p):
        os.makedirs(os.path.dirname(p), exist_ok=True)
        for k in range(4):
            try:
                d = urllib.request.urlopen(URL.format(z=z, x=x, y=y), timeout=30).read(); open(p, 'wb').write(d); break
            except Exception as e: err = e
        else: raise err
    return p
meta = {}
for z, (w, s, e, n) in LEVELS.items():
    x0, x1 = int(tx(w, z)), int(tx(e, z)); y0, y1 = int(ty(n, z)), int(ty(s, z))
    jobs = [(z, x, y) for y in range(y0, y1+1) for x in range(x0, x1+1)]
    with cf.ThreadPoolExecutor(12) as ex: paths = list(ex.map(lambda a: get(*a), jobs))
    im = Image.new('RGB', ((x1-x0+1)*256, (y1-y0+1)*256))
    for (zz, x, y), p in zip(jobs, paths): im.paste(Image.open(p).convert('RGB'), ((x-x0)*256, (y-y0)*256))
    im.save(f'tiles/mosaic_z{z}.png'); meta[z] = dict(x0=x0, y0=y0, w=im.width, h=im.height)
    print(z, len(jobs), 'tiles', im.size)
import json; json.dump(meta, open('tiles/meta.json', 'w'))
