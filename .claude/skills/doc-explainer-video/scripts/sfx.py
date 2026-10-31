"""Procedural sound effects and a music bed (no downloads, no sound library needed).

Usage:
  python sfx.py [--out audio] [--meta out/meta.json | --duration 60] [--bed tense|sombre|none] [--seed 7]
  python sfx.py --list

Writes <out>/sfx_<name>.wav for every effect below (48 kHz mono float) and <out>/music_bed.wav.
Bed length: --duration seconds, else meta.json "duration" + 4 s tail (mix.py trims it), else 60 s.
  tense  = D-minor saw drone, eighth-note low pulse at 96 bpm, hi-hat tick, slow string swells (map films)
  sombre = held pads drifting Dm -> Bb -> Gm -> A every 18 s, sub pulse every 2 s, slow swell (3D films)
Every sound has its own generator seeded from --seed and its name, so output is deterministic and
regenerating one name never changes another.
Map films: marker, scribble, highlighter, paper_slide, page_turn, typewriter, whoosh_in, whoosh_out, impact, clock.
3D films:  hum, slide, beep, beep_red, whoosh, swell, clunk, slam, paper_flurry, typing, alarm, radio, ticks, rumble, paper.
"""
import argparse, json, zlib
from pathlib import Path
import numpy as np, soundfile as sf, scipy.signal as ss

SR = 48000
import sys
for _s in (sys.stdout, sys.stderr):   # Windows pipes default to cp1252; IPA and transcript text need UTF-8
    if hasattr(_s, 'reconfigure'): _s.reconfigure(encoding='utf-8', errors='replace')
ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument('--out', type=Path, default=Path('audio'))
ap.add_argument('--meta', type=Path, default=Path('out/meta.json'), help='film meta with "duration" (used if --duration is not given)')
ap.add_argument('--duration', type=float, help='bed length in seconds')
ap.add_argument('--bed', choices=['tense', 'sombre', 'none'], help='default sombre; with --only the bed is left alone unless --bed is given')
ap.add_argument('--seed', type=int, default=7)
ap.add_argument('--only', help='comma list of effect names to write (default all)')
ap.add_argument('--list', action='store_true', help='print effect names and exit')
A = ap.parse_args()
if A.bed is None: A.bed = 'none' if A.only else 'sombre'

rng = np.random.default_rng(A.seed)
def t_(d): return np.arange(int(d*SR))/SR
def noise(d): return rng.standard_normal(int(d*SR))
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'high', fs=SR, output='sos'), x)
def norm(x, p=.9): return x/(np.max(np.abs(x))+1e-9)*p
def env(n, a, r): e = np.ones(n); a, r = int(a*SR), int(r*SR); e[:a] = np.linspace(0, 1, a); e[n-r:] *= np.linspace(1, 0, r); return e
def fade(x, a=.01, r=.05): return x*env(len(x), a, r)
def sweep(x, fc, wide=(.6, 1.5)):          # band-pass with a moving centre fc(u), u = 0..1 over the sound
    out = np.zeros_like(x); n = len(x)
    for i in range(0, n, 2048): f = fc(i/n); out[i:i+2048] = bp(x[i:i+2560], f*wide[0], f*wide[1])[:len(out[i:i+2048])]
    return out
def beeps(f, d, n, gap):
    y = np.zeros(int((d+gap)*n*SR))
    for k in range(n): p = int(k*(d+gap)*SR); y[p:p+int(d*SR)] += fade(np.sin(2*np.pi*f*t_(d)), .005, .03)
    return y

# ---- map-film set (paper, marker, desk) ----
def marker():        # felt marker on paper: squeaky band noise with stroke AM
    d = .5; return norm(bp(noise(d), 1800, 6500)*(.6+.4*np.sin(2*np.pi*11*t_(d)+rng.random()*6))*env(int(d*SR), .02, .15))*.55
def scribble():      # fast back-and-forth
    d = .6; return norm(bp(noise(d), 1500, 7000)*np.abs(np.sin(2*np.pi*9*t_(d)))**1.5*env(int(d*SR), .01, .1))*.5
def highlighter():   # softer, lower, one long swipe
    d = .35; return norm(bp(noise(d), 900, 4000)*env(int(d*SR), .03, .12))*.4
def paper_slide():   # rustle with a soft landing
    d = .4; x = bp(noise(d), 400, 5000)*np.exp(-t_(d)*5); land = lp(noise(.06), 900)*np.exp(-t_(.06)*60)
    y = np.zeros(int(.45*SR)); y[:len(x)] += x*.8; y[int(.18*SR):int(.18*SR)+len(land)] += land*2.5; return norm(y)*.55
def page_turn():     # flutter of a few crisp bursts
    d = .5; return norm(bp(noise(d), 700, 9000)*(np.sin(2*np.pi*14*t_(d)*(1-t_(d)))**2)*np.exp(-t_(d)*4))*.55
def typewriter():    # clacky typewriter with body thump
    y = np.zeros(int(1.0*SR))
    for k in range(16):
        p = int((k*.055+rng.random()*.015)*SR); c = hp(noise(.03), 1500)*np.exp(-t_(.03)*220) + .5*np.sin(2*np.pi*190*t_(.03))*np.exp(-t_(.03)*120)
        y[p:p+len(c)] += c*(.6+.4*rng.random())
    return norm(y)*.35
def _whoosh_dir(d, up):
    x = noise(d); n = len(x); out = sweep(x, lambda u: 300 + 2600*(u if up else 1-u), (.6, 1.6))
    return norm(lp(out, 6000)*np.sin(np.pi*np.linspace(0, 1, n))**(1.5 if up else 2.5))*.6
def whoosh_in(): return _whoosh_dir(1.2, True)
def whoosh_out(): return _whoosh_dir(.8, False)
def impact():        # sub thump + crack + short room tail
    d = 1.4; tt = t_(d); thump = np.sin(2*np.pi*(52+60*np.exp(-tt*18))*tt)*np.exp(-tt*5)
    return norm(thump*1.2 + hp(noise(d), 800)*np.exp(-tt*35)*.6 + lp(noise(d), 2500)*np.exp(-tt*4)*.15)*.95
def clock():         # tick-tock
    y = np.zeros(int(1.2*SR))
    for k in range(5): p = int(k*.24*SR); c = bp(noise(.02), 2500 if k % 2 else 1800, 7000)*np.exp(-t_(.02)*250); y[p:p+len(c)] += c
    return norm(y)*.4

# ---- 3D-film set (rooms, screens, alarms) ----
def hum():           # server-room hum, 6 s with long fades
    d = 6.0; tt = t_(d)
    return fade(norm(lp(noise(d), 300)*.6 + np.sin(2*np.pi*60*tt)*.25 + np.sin(2*np.pi*120*tt)*.12 + bp(noise(d), 3000, 6000)*.05)*.5, 1.0, 1.2)
def slide():
    d = .7; return fade(norm(bp(noise(d), 300, 3000)*np.exp(-t_(d)*4) + lp(noise(d), 200)*np.exp(-((t_(d)-.6)**2)/.002))*.5)
def beep(): return norm(beeps(1320, .09, 2, .07))*.35
def beep_red(): return norm(beeps(660, .14, 3, .1) + beeps(663, .14, 3, .1))*.35
def whoosh():        # symmetric whoosh, centre rises and falls
    d = 1.6; x = noise(d); return norm(lp(sweep(x, lambda u: 250 + 2200*np.sin(np.pi*u)), 5000)*np.sin(np.pi*np.linspace(0, 1, len(x)))**2)*.55
def swell():
    d = 3.0; tt = t_(d); s = np.sin(np.pi*tt/d)
    return fade(norm(sum(np.sin(2*np.pi*f*tt) for f in (55, 82.4, 110))*s**2 + lp(noise(d), 400)*.2*s), .2, .5)*.6
def clunk():
    d = .5; tt = t_(d); return norm(np.sin(2*np.pi*(90+150*np.exp(-tt*40))*tt)*np.exp(-tt*18) + hp(noise(d), 1500)*np.exp(-tt*80)*.6)*.8
def slam():
    d = 1.5; tt = t_(d)
    return norm(np.sin(2*np.pi*(48+70*np.exp(-tt*20))*tt)*np.exp(-tt*5) + bp(noise(d), 200, 4000)*np.exp(-tt*25)*.8 + lp(noise(d), 1500)*np.exp(-tt*3)*.15)*.95
def paper_flurry():  # many sheets, accelerating
    y = np.zeros(int(2.0*SR))
    for k in range(70): p = int((1.6*k/70)**1.4/1.6**.4*SR); c = bp(noise(.05), 1500, 7000)*np.exp(-t_(.05)*90); y[p:p+len(c)] += c*(.4+.6*rng.random())
    return norm(y)*.45
def typing():        # keyboard
    y = np.zeros(int(1.8*SR))
    for k in range(26): p = int((k*.065+rng.random()*.012)*SR); c = hp(noise(.025), 2000)*np.exp(-t_(.025)*250); y[p:p+len(c)] += c
    return norm(y)*.3
def alarm():
    d = 2.4; tt = t_(d); sq = np.sin(2*np.pi*1.25*tt)
    return fade(norm(np.sin(2*np.pi*(700+200*(sq > 0))*tt)*(.6+.4*sq)), .05, .4)*.25
def radio():         # squelch then two pips
    d = 1.0; tt = t_(d); pip = np.sin(2*np.pi*1046*tt)
    return fade(norm(bp(noise(d), 800, 3200)*.3*(tt < .25) + pip*((tt > .3) & (tt < .45)) + pip*((tt > .55) & (tt < .7))))*.35
def ticks():         # fast counter ticks
    y = np.zeros(int(2.4*SR))
    for k in range(40): p = int(k*.055*SR); c = hp(noise(.01), 4000)*np.exp(-t_(.01)*400); y[p:p+len(c)] += c
    return norm(y)*.3
def rumble():
    d = 2.5; tt = t_(d); s = np.sin(np.pi*tt/d); return fade(norm(lp(noise(d), 120)*s + np.sin(2*np.pi*38*tt)*s*.5), .1, .6)*.8
def paper():         # one sheet put down
    d = .45; x = bp(noise(d), 500, 6000)*np.exp(-t_(d)*7); land = lp(noise(.05), 900)*np.exp(-t_(.05)*70)
    y = np.zeros(int(.5*SR)); y[:len(x)] += x; y[int(.2*SR):int(.2*SR)+len(land)] += land*2; return norm(y)*.45

FX = {f.__name__: f for f in (marker, scribble, highlighter, paper_slide, page_turn, typewriter, whoosh_in, whoosh_out, impact, clock,
                              hum, slide, beep, beep_red, whoosh, swell, clunk, slam, paper_flurry, typing, alarm, radio, ticks, rumble, paper)}
if A.list: print(' '.join(FX)); raise SystemExit
names = A.only.split(',') if A.only else list(FX)
A.out.mkdir(parents=True, exist_ok=True)
for k in names:
    rng = np.random.default_rng([A.seed, zlib.crc32(k.encode())])   # per-sound seed: deterministic, independent
    sf.write(A.out/f'sfx_{k}.wav', FX[k]().astype(np.float32), SR)

# ---- music bed ----
def bed_tense(D):
    tt = t_(D); saw = lambda f: 2*((tt*f) % 1)-1
    pad = sum(saw(f*(1+dt)) for f in (73.42, 110.0, 146.83, 174.61) for dt in (-.003, .003))
    bed = lp(pad, 900)*.10*(.7+.3*np.sin(2*np.pi*tt/8)) + np.sin(2*np.pi*36.71*tt)*.25      # drone + sub D
    beat = 60/96
    for k in range(int(D/beat*2)):                                    # eighth-note low pulse, drops to C# every 4th bar
        p = int(k*beat/2*SR); n = int(.22*SR); e = np.exp(-np.arange(n)/SR*14); f = 73.42 if (k//8) % 4 != 3 else 69.30
        if p+n < len(bed): bed[p:p+n] += lp(np.sign(np.sin(2*np.pi*f*np.arange(n)/SR)), 500)*e*(.22 if k % 2 == 0 else .12)
    for k in range(int(D/beat)):                                      # tick on the beat
        p = int(k*beat*SR); c = hp(noise(.015), 5000)*np.exp(-t_(.015)*300)
        if p+len(c) < len(bed): bed[p:p+len(c)] += c*.10
    strings = sum(np.sin(2*np.pi*f*tt + 3*np.sin(2*np.pi*5.2*tt)/f) for f in (293.66, 349.23, 440.0))
    bed += strings*.035*(np.sin(np.pi*np.clip(tt/D, 0, 1))**2)*(.5+.5*np.sin(2*np.pi*tt/11))
    return bed*np.minimum(1, tt/1.5)
def bed_sombre(D):
    tt = t_(D); saw = lambda f: 2*((tt*f) % 1)-1
    CH = [(73.42, 110, 146.83, 174.61), (58.27, 116.54, 146.83, 174.61), (49.0, 98.0, 146.83, 196.0), (55.0, 110.0, 146.83, 164.81)]
    bed = np.zeros_like(tt); seg = 18.0
    for k in range(int(D/seg)+2):                                     # triangular cross-fade between chords
        w = np.clip(1 - np.abs((tt - k*seg)/seg), 0, 1)**1.5
        bed += lp(sum(saw(f*(1+dd)) for f in CH[k % 4] for dd in (-.004, .004)), 650)*w*.12
    for k in range(int(D/2)):                                         # sub pulse every 2 s
        p = int(k*2*SR); n = int(1.2*SR)
        if p+n < len(bed): bed[p:p+n] += np.sin(2*np.pi*36.7*np.arange(n)/SR)*np.exp(-np.arange(n)/SR*3)*.3
    bed *= .75 + .25*np.sin(2*np.pi*tt/47)
    bed += lp(noise(D), 900)*.015
    return bed*np.minimum(1, tt/2.5)

if A.bed != 'none':
    if A.duration: D = A.duration
    elif A.meta.exists(): D = json.loads(A.meta.read_text(encoding='utf-8'))['duration'] + 4
    else: D = 60.0; print('no --duration and no', A.meta, '-> 60 s bed')
    rng = np.random.default_rng([A.seed, zlib.crc32(b'bed')])
    sf.write(A.out/'music_bed.wav', norm((bed_tense if A.bed == 'tense' else bed_sombre)(D), .8).astype(np.float32), SR)
    print(f'ok {len(names)} sfx, {A.bed} bed {D:.1f} s -> {A.out}')
else: print(f'ok {len(names)} sfx -> {A.out}')
