# Procedural SFX + sombre bed (no sound library reachable here)
import numpy as np, soundfile as sf, scipy.signal as ss
SR = 48000; rng = np.random.default_rng(11)
t_ = lambda d: np.arange(int(d*SR))/SR
noise = lambda d: rng.standard_normal(int(d*SR))
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'high', fs=SR, output='sos'), x)
def norm(x, p=.9): return x/(np.max(np.abs(x))+1e-9)*p
def fade(x, a=.01, r=.05): n = len(x); e = np.ones(n); A, R = int(a*SR), int(r*SR); e[:A] = np.linspace(0, 1, A); e[n-R:] *= np.linspace(1, 0, R); return x*e
S = {}
d = 6.0; tt = t_(d); S['hum'] = fade(norm(lp(noise(d), 300)*.6 + np.sin(2*np.pi*60*tt)*.25 + np.sin(2*np.pi*120*tt)*.12 + bp(noise(d), 3000, 6000)*.05)*.5, 1.0, 1.2)
d = .7; S['slide'] = fade(norm(bp(noise(d), 300, 3000)*np.exp(-t_(d)*4) + lp(noise(d), 200)*np.exp(-((t_(d)-.6)**2)/.002))*.5)
def beep(f, d=.18, n=1, gap=.12):
    y = np.zeros(int((d+gap)*n*SR))
    for k in range(n): p = int(k*(d+gap)*SR); y[p:p+int(d*SR)] += fade(np.sin(2*np.pi*f*t_(d)), .005, .03)
    return y
S['beep'] = norm(beep(1320, .09, 2, .07))*.35; S['beep_red'] = norm(beep(660, .14, 3, .1) + beep(663, .14, 3, .1))*.35
d = 1.6; x = noise(d); out = np.zeros_like(x)
for i in range(0, len(x), 2048): u = i/len(x); f = 250 + 2200*np.sin(np.pi*u); out[i:i+2048] = bp(x[i:i+2560], f*.6, f*1.5)[:len(out[i:i+2048])]
S['whoosh'] = norm(lp(out, 5000)*np.sin(np.pi*np.linspace(0, 1, len(x)))**2)*.55
d = 3.0; tt = t_(d); S['swell'] = fade(norm(sum(np.sin(2*np.pi*f*tt) for f in (55, 82.4, 110))*np.sin(np.pi*tt/d)**2 + lp(noise(d), 400)*.2*np.sin(np.pi*tt/d)), .2, .5)*.6
d = .5; tt = t_(d); S['clunk'] = norm(np.sin(2*np.pi*(90+150*np.exp(-tt*40))*tt)*np.exp(-tt*18) + hp(noise(d), 1500)*np.exp(-tt*80)*.6)*.8
d = 1.5; tt = t_(d); S['slam'] = norm(np.sin(2*np.pi*(48+70*np.exp(-tt*20))*tt)*np.exp(-tt*5) + bp(noise(d), 200, 4000)*np.exp(-tt*25)*.8 + lp(noise(d), 1500)*np.exp(-tt*3)*.15)*.95
y = np.zeros(int(2.0*SR))
for k in range(70): p = int((1.6*k/70)**1.4/1.6**.4*SR); c = bp(noise(.05), 1500, 7000)*np.exp(-t_(.05)*90); y[p:p+len(c)] += c*(.4+.6*rng.random())
S['paper_flurry'] = norm(y)*.45
y = np.zeros(int(1.8*SR))
for k in range(26): p = int((k*.065+rng.random()*.012)*SR); c = hp(noise(.025), 2000)*np.exp(-t_(.025)*250); y[p:p+len(c)] += c
S['typing'] = norm(y)*.3
d = 2.4; tt = t_(d); S['alarm'] = fade(norm(np.sin(2*np.pi*(700+200*(np.sin(2*np.pi*1.25*tt) > 0))*tt)*(.6+.4*np.sin(2*np.pi*1.25*tt))), .05, .4)*.25
d = 1.0; tt = t_(d); S['radio'] = fade(norm(bp(noise(d), 800, 3200)*.3*(tt < .25) + np.sin(2*np.pi*1046*tt)*(tt > .3)*(tt < .45) + np.sin(2*np.pi*1046*tt)*(tt > .55)*(tt < .7)))*.35
y = np.zeros(int(2.4*SR))
for k in range(40): p = int(k*.055*SR); c = hp(noise(.01), 4000)*np.exp(-t_(.01)*400); y[p:p+len(c)] += c
S['ticks'] = norm(y)*.3
d = 2.5; tt = t_(d); S['rumble'] = fade(norm(lp(noise(d), 120)*np.sin(np.pi*tt/d) + np.sin(2*np.pi*38*tt)*np.sin(np.pi*tt/d)*.5), .1, .6)*.8
for k, v in S.items(): sf.write(f'audio/sfx_{k}.wav', v.astype(np.float32), SR)
# sombre bed: low held pad in D minor, slow movement to Bb, sub pulse every 2 s, very quiet
D = 56; tt = t_(D)
def saw(f): return 2*((tt*f) % 1)-1
chord = lambda fs, w: sum(saw(f*(1+dd)) for f in fs for dd in (-.004, .004))*w
w1 = np.clip(1 - np.abs((tt - 14)/18), 0, 1); w2 = np.clip(1 - np.abs((tt - 36)/18), 0, 1); w3 = np.clip((tt-38)/10, 0, 1)
bed = lp(chord((73.42, 110, 146.83, 174.61), w1) + chord((58.27, 116.54, 146.83, 174.61), w2) + chord((73.42, 110, 146.83, 220), w3), 700)*.12
for k in range(int(D/2)):
    p = int(k*2*SR); n = int(1.2*SR)
    if p+n < len(bed): bed[p:p+n] += np.sin(2*np.pi*36.7*np.arange(n)/SR)*np.exp(-np.arange(n)/SR*3)*.35
bed += lp(noise(D), 900)*.015
bed *= np.minimum(1, tt/2.5)
sf.write('audio/music_bed.wav', norm(bed, .8).astype(np.float32), SR)
print('ok', len(S), 'sfx')
