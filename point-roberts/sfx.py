# Procedural SFX + tense documentary bed (no downloads: freesound is blocked here)
import numpy as np, soundfile as sf, scipy.signal as ss
SR = 48000; rng = np.random.default_rng(7)
def t_(d): return np.arange(int(d*SR))/SR
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, 'high', fs=SR, output='sos'), x)
def env(n, a, r): e = np.ones(n); A = int(a*SR); R = int(r*SR); e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R); return e
def norm(x, p=.9): return x/np.max(np.abs(x))*p
def noise(d): return rng.standard_normal(int(d*SR))
S = {}
# felt marker on paper: squeaky band noise with stroke AM
d = .5; x = bp(noise(d), 1800, 6500); am = .6+.4*np.sin(2*np.pi*11*t_(d)+rng.random()*6)
S['marker'] = norm(x*am*env(len(x), .02, .15))*.55
# scribble: fast back-and-forth
d = .6; x = bp(noise(d), 1500, 7000); am = np.abs(np.sin(2*np.pi*9*t_(d)))**1.5
S['scribble'] = norm(x*am*env(len(x), .01, .1))*.5
# highlighter: softer, lower, one long swipe
d = .35; x = bp(noise(d), 900, 4000); S['highlighter'] = norm(x*env(len(x), .03, .12))*.4
# paper slide: lowpassed rustle with a soft landing
d = .4; x = bp(noise(d), 400, 5000)*np.exp(-t_(d)*5); land = lp(noise(.06), 900)*np.exp(-t_(.06)*60)
y = np.zeros(int(.45*SR)); y[:len(x)] += x*.8; y[int(.18*SR):int(.18*SR)+len(land)] += land*2.5
S['paper_slide'] = norm(y)*.55
# page turn: flutter of a few crisp bursts
d = .5; x = bp(noise(d), 700, 9000); fl = (np.sin(2*np.pi*14*t_(d)*(1-t_(d)))**2)*np.exp(-t_(d)*4)
S['page_turn'] = norm(x*fl)*.55
# typing: typewriter clicks
y = np.zeros(int(1.0*SR))
for k in range(16):
    p = int((k*.055+rng.random()*.015)*SR); c = hp(noise(.03), 1500)*np.exp(-t_(.03)*220) + .5*np.sin(2*np.pi*190*t_(.03))*np.exp(-t_(.03)*120)
    y[p:p+len(c)] += c*(.6+.4*rng.random())
S['typing'] = norm(y)*.35
# whooshes: band noise with moving centre
def whoosh(d, up):
    x = noise(d); out = np.zeros_like(x); n = len(x); seg = 2048
    for i in range(0, n, seg):
        u = i/n; f = 300 + 2600*(u if up else 1-u)
        out[i:i+seg] = bp(x[i:i+seg+512], f*.6, f*1.6)[:len(out[i:i+seg])]
    e = np.sin(np.pi*np.linspace(0, 1, n))**(1.5 if up else 2.5)
    return norm(lp(out, 6000)*e)*.6
S['whoosh_in'] = whoosh(1.2, True); S['whoosh_out'] = whoosh(.8, False)
# impact: sub thump + crack + short room tail
d = 1.4; tt = t_(d); thump = np.sin(2*np.pi*(52+60*np.exp(-tt*18))*tt)*np.exp(-tt*5); crack = hp(noise(d), 800)*np.exp(-tt*35)
tail = lp(noise(d), 2500)*np.exp(-tt*4)*.15
S['impact'] = norm(thump*1.2+crack*.6+tail)*.95
# clock tick-tock
y = np.zeros(int(1.2*SR))
for k in range(5):
    p = int(k*.24*SR); c = bp(noise(.02), 2500 if k % 2 else 1800, 7000)*np.exp(-t_(.02)*250); y[p:p+len(c)] += c
S['clock'] = norm(y)*.4
for k, v in S.items(): sf.write(f'audio/sfx_{k}.wav', v.astype(np.float32), SR)

# tense documentary bed: D minor drone, low pulse, ticking, slow string swells
D = 44.0; tt = t_(D); bed = np.zeros_like(tt)
def saw(f): return 2*((tt*f) % 1)-1
pad = sum(saw(f*(1+dt)) for f in (73.42, 110.0, 146.83, 174.61) for dt in (-.003, .003))
bed += lp(pad, 900)*.10*(.7+.3*np.sin(2*np.pi*tt/8))
bed += np.sin(2*np.pi*36.71*tt)*.25                                   # sub D
bpm = 96; beat = 60/bpm
for k in range(int(D/beat*2)):                                        # eighth-note low pulse
    p = int(k*beat/2*SR); n = int(.22*SR); e = np.exp(-np.arange(n)/SR*14)
    f = 73.42 if (k//8) % 4 != 3 else 69.30
    if p+n < len(bed): bed[p:p+n] += lp(np.sign(np.sin(2*np.pi*f*np.arange(n)/SR)), 500)*e*(.22 if k % 2 == 0 else .12)
for k in range(int(D/beat)):                                          # tick
    p = int(k*beat*SR); c = hp(noise(.015), 5000)*np.exp(-t_(.015)*300)
    if p+len(c) < len(bed): bed[p:p+len(c)] += c*.10
strings = sum(np.sin(2*np.pi*f*tt + 3*np.sin(2*np.pi*5.2*tt)/f) for f in (293.66, 349.23, 440.0))
bed += strings*.035*(np.sin(np.pi*np.clip(tt/D, 0, 1))**2)*(.5+.5*np.sin(2*np.pi*tt/11))
bed *= np.minimum(1, tt/1.5)
sf.write('audio/music_bed.wav', norm(bed, .8).astype(np.float32), SR)
print('ok', list(S))
