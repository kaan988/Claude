# Land mask: R > B + T after 1.5px blur, open+close, remove specks, fill holes; feathered RGBA mosaics
import cv2, numpy as np, sys
SP = sys.argv[1] if len(sys.argv) > 1 else None
for z, T, speck in ((9, 6, 300), (11, 7, 800), (13, 8, 2500)):
    im = cv2.imread(f'tiles/mosaic_z{z}.png').astype(np.float32)
    b = cv2.GaussianBlur(im, (0, 0), 1.5)
    rb = b[..., 2] - b[..., 0]; gb = b[..., 1] - b[..., 0]
    L = b.mean(2); mu = cv2.blur(L, (15, 15)); sd = np.sqrt(np.maximum(cv2.blur(L*L, (15, 15)) - mu*mu, 0))
    sea = (sd < 1.0) & (L < 60); seaRB = min(float(np.median(rb[sea])), -31.0) if z != 9 else -31.0   # this imagery's sea is bluer than red by ~30
    # 'redder than blue' measured against the sea's own red-blue level; smooth teal river plume excluded
    m = ((rb > seaRB + T) & ((gb < 8) | (sd > 6))).astype(np.uint8)
    print(z, 'sea R-B', seaRB)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, k); m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k)
    # remove specks (land and water)
    for val in (1, 0):
        src = (m == val).astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(src, 8)
        small = np.isin(lab, np.where(st[:, cv2.CC_STAT_AREA] < speck)[0]) & (src == 1)
        m[small] = 1 - val
    # fill holes: water regions not touching the border become land
    inv = (1 - m).astype(np.uint8); n, lab, st, _ = cv2.connectedComponentsWithStats(inv, 4)
    h, w = m.shape; edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    for i in range(1, n):
        if i not in edge and st[i, cv2.CC_STAT_AREA] < h*w*(0.01 if z == 9 else 0.002): m[lab == i] = 1
    a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2)
    # feather mosaic edges
    fe = 96
    ramp = lambda L: np.clip(np.minimum(np.arange(L), np.arange(L)[::-1]) / fe, 0, 1)
    edgef = np.outer(ramp(h), ramp(w)).astype(np.float32)
    rgba = np.dstack([im.astype(np.uint8), (np.clip(a*edgef, 0, 1)*255).astype(np.uint8)])
    cv2.imwrite(f'tiles/land_z{z}.png', rgba)
    # teal shallow-water halo (#2A6274) at half resolution
    hm = cv2.resize(m.astype(np.float32), (w//2, h//2), interpolation=cv2.INTER_AREA)
    hal = cv2.GaussianBlur(cv2.dilate(hm, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))), (0, 0), 9)
    hal = np.clip(hal*1.3, 0, 1) * cv2.resize(edgef, (w//2, h//2))
    halo = np.dstack([np.full_like(hal, 0x74), np.full_like(hal, 0x62), np.full_like(hal, 0x2A), hal*200]).astype(np.uint8)
    cv2.imwrite(f'tiles/halo_z{z}.png', halo)
    if z == 13:   # where 49N crosses land, for the dashed border
        import json, math
        meta = json.load(open('tiles/meta.json'))[str(z)]
        Y = (1-math.log(math.tan(math.radians(49))+1/math.cos(math.radians(49)))/math.pi)/2*2**z*256 - meta['y0']*256
        row = m[int(round(Y))]; runs = []; i = 0
        while i < w:
            if row[i]:
                j = i
                while j < w and row[j]: j += 1
                if j-i > 40: runs.append([round((meta['x0']*256+i)/(2**z*256)*360-180, 5), round((meta['x0']*256+j)/(2**z*256)*360-180, 5)])
                i = j
            else: i += 1
        json.dump(runs, open('tiles/border49.json', 'w')); print('49N land runs', runs)
    if SP:
        pv = im.copy(); pv[m == 0] = pv[m == 0]*0.25 + np.array([255, 0, 255])*0.3
        pv = cv2.resize(pv, (w*1100//w, h*1100//w)); cv2.imwrite(f'{SP}/mask{z}.jpg', pv)
    print(z, m.mean())
