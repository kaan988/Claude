# Voice + ducked music bed + one SFX per event -> -14 LUFS
import numpy as np, soundfile as sf, json, scipy.signal as ss, pyloudnorm as pyln
SR = 48000
meta = json.load(open('out/meta.json')); words = json.load(open('audio/words.json'))['words']
v, vsr = sf.read('audio/voice.wav'); v = ss.resample_poly(v, 2, 1) if vsr == 24000 else v
N = int(meta['duration']*SR) + SR//2
voice = np.zeros(N); voice[:len(v)] = v[:N]
m, _ = sf.read('audio/music_bed.wav'); music = np.zeros(N); music[:min(N, len(m))] = m[:N]
# duck: gain follows the words (attack 40 ms, release 250 ms)
target = np.zeros(N)
for w in words: target[int(max(0, w['t0']-.05)*SR):int((w['t1']+.05)*SR)] = 1
g = np.zeros(N); a, r, s = 1-np.exp(-1/(.04*SR)), 1-np.exp(-1/(.25*SR)), 0.
for i in range(0, N, 32):
    tt = target[i]; s += ((a if tt > s else r)*32)*(tt-s); g[i:i+32] = s
duck = 10**((-7*g)/20)
music *= duck
# set bed so every phrase has voice ≥ 10 dB over music
def rms(x): return np.sqrt(np.mean(x**2)+1e-12)
vr = rms(voice[target > 0]); mr = rms(music[target > 0])
music *= (vr/mr)*10**(-14/20)
sfx = np.zeros(N)
for e in meta['events']:
    x, _ = sf.read(f"audio/sfx_{e['sfx']}.wav"); p = int(e['t']*SR)
    if p < 0: x = x[-p:]; p = 0
    n = min(len(x), N-p); sfx[p:p+n] += x[:n]*e.get('gain', 1)*.55
mix = voice + music + sfx
# per-phrase check: voice over music
phr, cur = [], [words[0]]
for w in words[1:]:
    if w['t0']-cur[-1]['t1'] > .15: phr.append(cur); cur = [w]
    else: cur.append(w)
phr.append(cur)
worst = min(20*np.log10(rms(voice[int(p[0]['t0']*SR):int(p[-1]['t1']*SR)])/rms(music[int(p[0]['t0']*SR):int(p[-1]['t1']*SR)])) for p in phr)
print(f'phrases {len(phr)}, worst voice-over-music {worst:.1f} dB')
import warnings; warnings.filterwarnings('ignore')
meter = pyln.Meter(SR)
for _ in range(6):                                      # normalize, soft-limit peaks at -1 dBFS, repeat
    mix = pyln.normalize.loudness(mix, meter.integrated_loudness(mix), -14.0)
    mix = np.where(np.abs(mix) > .7, np.sign(mix)*(.7 + .19*np.tanh((np.abs(mix)-.7)/.19)), mix)
print('LUFS', round(meter.integrated_loudness(mix), 2), 'peak dBFS', round(20*np.log10(np.max(np.abs(mix))), 2))
sf.write('audio/mix.wav', np.stack([mix, mix], 1).astype(np.float32), SR)
